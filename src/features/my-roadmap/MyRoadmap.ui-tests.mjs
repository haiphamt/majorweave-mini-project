// Task regression suite. Each browser context owns disposable IndexedDB data.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';

export async function runRoadmapUITests() {
  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.MAJORWEAVE_PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({ headless: true, ...(process.env.MAJORWEAVE_BROWSER_CHANNEL ? { channel: process.env.MAJORWEAVE_BROWSER_CHANNEL } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const baseUrl = process.env.MAJORWEAVE_TEST_URL || 'http://127.0.0.1:5174';
  const evidence = 'docs/tasks/MW-TEAM-02/evidence';
  fs.mkdirSync(evidence, { recursive: true });
  const results = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const check = async (name, test) => {
    try { await test(); results.push({ name, status: 'pass' }); console.log(`  PASS UI: ${name}`); }
    catch (error) { results.push({ name, status: 'fail', error: error.message }); throw error; }
  };
  const create = () => page.getByRole('button', { name: 'Tạo kế hoạch mới', exact: true });
  const ready = async () => {
    await create().waitFor();
    await page.waitForFunction(() => {
      const button = document.querySelector('main .primary-button.full-width');
      return button && !button.disabled;
    });
  };
  const stored = () => page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('majorweave', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('workspace', 'readonly');
      const read = transaction.objectStore('workspace').get('local');
      read.onsuccess = () => resolve(read.result);
      read.onerror = () => reject(read.error);
      transaction.oncomplete = () => db.close();
    };
  }));
  const savedNotice = () => page.getByRole('status').filter({ hasText: /^Đã lưu/ }).waitFor();
  try {
    await page.goto(`${baseUrl}/#/roadmap`);
    await ready();
    await check('Missing goal, invalid hours and all-known reject without saving', async () => {
      await create().click();
      assert.match(await page.getByRole('alert').innerText(), /mục tiêu/);
      await page.getByLabel('Mục tiêu của bạn').fill('Roadmap UI verification');
      for (const hours of ['1', '21', '2.5', '']) {
        await page.getByLabel('Số giờ học mỗi tuần').fill(hours);
        await create().click();
        assert.match(await page.getByRole('alert').innerText(), /số nguyên từ 2 đến 20/);
      }
      await page.getByLabel('Số giờ học mỗi tuần').fill('5');
      for (const checkbox of await page.getByRole('checkbox', { name: /^Đã biết:/ }).all()) await checkbox.check();
      await create().click();
      assert.match(await page.getByRole('alert').innerText(), /chặng chưa biết/);
      assert.equal(await stored(), undefined);
      for (const checkbox of await page.getByRole('checkbox', { name: /^Đã biết:/ }).all()) await checkbox.uncheck();
    });
    await check('Tuesday cancel/Escape preserve date and restore focus', async () => {
      await page.getByLabel('Ngày bắt đầu').fill('2026-10-06');
      await create().click();
      await page.getByRole('button', { name: 'Giữ ngày đã chọn' }).click();
      assert.equal(await page.getByLabel('Ngày bắt đầu').inputValue(), '2026-10-06');
      await create().click(); await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').count(), 0);
      assert.ok(await create().evaluate(element => element === document.activeElement));
    });
    await check('Monday confirm creates a persisted v2 plan and stays on roadmap', async () => {
      await create().click();
      await page.getByRole('button', { name: 'Dùng ngày 2026-10-12' }).click();
      await savedNotice();
      const workspace = await stored();
      assert.equal(workspace.plans.length, 1);
      assert.ok(workspace.plans[0].current.tasks.length > 0);
      assert.equal(workspace.plans[0].current.startDate, '2026-10-12');
      assert.ok(page.url().endsWith('/#/roadmap'));
      await page.reload(); await ready();
      assert.equal(await page.getByLabel('Ngày bắt đầu').inputValue(), '2026-10-12');
    });
    await check('Create defaults to a second independent plan on the same track', async () => {
      const before = await stored();
      await create().click(); await savedNotice();
      const after = await stored();
      assert.equal(after.plans.length, 2);
      assert.deepEqual(after.plans[0], before.plans[0]);
      assert.notEqual(after.plans[0].id, after.plans[1].id);
      assert.equal(after.activePlanId, after.plans[1].id);
    });
    await check('Preview cancel is read-only; confirm keeps generation history', async () => {
      const before = await stored();
      await page.getByLabel('Số giờ học mỗi tuần').fill('2');
      await page.getByRole('button', { name: 'Xem trước tạo lại' }).click();
      await page.getByRole('dialog').waitFor();
      assert.deepEqual(await stored(), before);
      await page.keyboard.press('Escape');
      assert.deepEqual(await stored(), before);
      await page.getByRole('button', { name: 'Xem trước tạo lại' }).click();
      await page.getByRole('button', { name: 'Xác nhận tạo lại' }).click(); await savedNotice();
      const after = await stored();
      assert.equal(after.plans.length, 2);
      assert.equal(after.activePlanId, before.activePlanId);
      assert.equal(after.plans[1].history.length, 1);
      assert.deepEqual(after.plans[1].history[0], before.plans[1].current);
    });
    await check('Prerequisite warning, remove/re-add, source and known edits survive draft save/reload', async () => {
      const before = await stored();
      const learn = page.getByRole('checkbox', { name: /^Học:/ }).first();
      const label = await learn.getAttribute('aria-label');
      await learn.uncheck();
      assert.match(await page.locator('.form-error').first().innerText(), /Cần chọn/);
      await learn.check();
      const source = page.getByLabel(/^Nguồn học cho/).first();
      const choices = await source.locator('option').evaluateAll(options => options.map(option => option.value));
      assert.ok(choices.length > 1);
      await source.selectOption(choices[1]);
      const known = page.getByRole('checkbox', { name: /^Đã biết:/ }).first();
      await known.check();
      await page.getByRole('button', { name: 'Lưu bản nháp' }).click(); await savedNotice();
      await page.reload(); await ready();
      assert.ok(await page.getByRole('checkbox', { name: label, exact: true }).isChecked());
      assert.ok(await page.getByRole('checkbox', { name: /^Đã biết:/ }).first().isChecked());
      assert.deepEqual((await stored()).plans, before.plans);
      await page.getByRole('checkbox', { name: /^Đã biết:/ }).first().uncheck();
      assert.equal(await page.getByLabel(/^Nguồn học cho/).first().inputValue(), choices[1]);
    });
    for (const trackId of ['mobile.android', 'mobile.ios', 'mobile.flutter', 'mobile.react-native', 'game.unity', 'game.unreal', 'game.godot']) {
      await check(`${trackId}: select, change source, generate, reload`, async () => {
        const before = await stored();
        await page.getByLabel('Nhánh học', { exact: true }).selectOption(trackId);
        const source = page.locator('select[aria-label^="Nguồn học cho"]:has(option:nth-child(2))').first();
        const sourceLabel = await source.getAttribute('aria-label');
        const choices = await source.locator('option').evaluateAll(options => options.map(option => option.value));
        assert.ok(choices.length > 1);
        await source.selectOption(choices[1]);
        await page.getByLabel('Mục tiêu của bạn').fill(`Verify ${trackId}`);
        await page.getByLabel('Ngày bắt đầu').fill('2026-10-12');
        await create().click(); await savedNotice();
        const after = await stored();
        assert.equal(after.plans.length, before.plans.length + 1);
        assert.deepEqual(after.plans.slice(0, -1), before.plans);
        const plan = after.plans.at(-1);
        assert.equal(plan.trackId, trackId);
        assert.ok(plan.current.tasks.some(task => task.source?.id === choices[1]));
        await page.reload(); await ready();
        assert.equal(await page.getByLabel('Nhánh học', { exact: true }).inputValue(), trackId);
        assert.equal(await page.getByLabel(sourceLabel, { exact: true }).inputValue(), choices[1]);
        assert.deepEqual(await stored(), after);
      });
    }
    await check('Mobile layout and Monday dialog fit; keyboard confirmation works', async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: `${evidence}/v2-roadmap-mobile.png`, fullPage: true });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.getByLabel('Ngày bắt đầu').fill('2026-10-20');
      await page.getByRole('button', { name: 'Xem trước tạo lại' }).click();
      const dialog = page.getByRole('dialog'); await dialog.waitFor();
      const bounds = await dialog.boundingBox(); assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390);
      await page.screenshot({ path: `${evidence}/v2-monday-mobile.png` });
      const confirm = page.getByRole('button', { name: 'Dùng ngày 2026-10-26' });
      await confirm.focus(); await page.keyboard.press('Enter');
      await page.getByRole('heading', { name: 'Tạo lại kế hoạch?' }).waitFor();
      await page.keyboard.press('Escape');
      assert.equal(await page.getByLabel('Ngày bắt đầu').inputValue(), '2026-10-26');
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: `${evidence}/v2-roadmap-desktop.png`, fullPage: true });
    });
    await check('Save failure blocks edits; retry stores exactly one candidate plan', async () => {
      const before = await stored();
      await page.evaluate(() => {
        window.qaOriginalOpen = indexedDB.open.bind(indexedDB);
        indexedDB.open = () => { throw new Error('QA simulated storage failure'); };
      });
      await create().click();
      await page.getByRole('button', { name: 'Thử lưu lại' }).waitFor();
      assert.ok(await create().isDisabled());
      assert.ok(await page.getByLabel('Mục tiêu của bạn').isDisabled());
      await page.evaluate(() => { indexedDB.open = window.qaOriginalOpen; });
      assert.deepEqual(await stored(), before);
      await page.getByRole('button', { name: 'Thử lưu lại' }).click(); await savedNotice();
      assert.equal((await stored()).plans.length, before.plans.length + 1);
      assert.equal(await page.getByRole('button', { name: 'Thử lưu lại' }).count(), 0);
    });
    await check('Two-tab conflict keeps candidate; discard requires explicit confirmation', async () => {
      const other = await context.newPage();
      other.on('pageerror', error => errors.push(error.message));
      await other.goto(`${baseUrl}/#/roadmap`);
      await other.getByLabel('Mục tiêu của bạn').fill('Second tab revision');
      await other.getByRole('button', { name: 'Lưu bản nháp' }).click();
      await other.getByRole('status').filter({ hasText: /^Đã lưu/ }).waitFor();
      const before = await stored();
      await create().click();
      await page.getByRole('button', { name: 'Tải bản đã lưu…' }).waitFor();
      assert.deepEqual(await stored(), before);
      await page.getByRole('button', { name: 'Tải bản đã lưu…' }).click();
      await page.getByRole('button', { name: 'Giữ thay đổi' }).click();
      assert.ok(await create().isDisabled());
      await page.getByRole('button', { name: 'Tải bản đã lưu…' }).click();
      await page.getByRole('button', { name: 'Bỏ thay đổi và tải lại' }).click();
      await ready();
      assert.equal(await page.getByLabel('Mục tiêu của bạn').inputValue(), 'Second tab revision');
      assert.deepEqual(await stored(), before);
      await other.close();
    });
    await check('No obsolete controls, drawer links, v1 redirect or browser errors', async () => {
      assert.equal(await page.getByRole('button', { name: /^Đưa .* (lên|xuống)$/ }).count(), 0);
      assert.equal(await page.locator('main a[href="#/path"]').count(), 0);
      assert.equal(await page.locator('main .heading-tag').count(), 0);
      assert.ok(page.url().endsWith('/#/roadmap'));
      assert.deepEqual(errors, []);
    });
  } finally {
    fs.writeFileSync(`${evidence}/v2-ui-results.json`, JSON.stringify({ date: '2026-10-08', browser: browser.version(), baseUrl, isolatedContext: true, results, errors, scope: 'MyRoadmap v2; completion/MyPlan/migration remain integration work.' }, null, 2) + '\n');
    await context.close(); await browser.close();
  }
  return results.length;
}
