const { chromium } = require(process.env.MAJORWEAVE_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const specs = [
  { id: 'node', name: 'Node.js', framework: 'Express', language: 'js', runtime: 'node', api: 'express', test: 'test', oop: 'oop-js', auth: 'mdn-express', reference: 'https://roadmap.sh/nodejs' },
  { id: 'python', name: 'Python', framework: 'FastAPI', language: 'python', runtime: 'python-runtime', api: 'fastapi', test: 'pytest', oop: 'python-oop', auth: 'fastapi-auth', reference: 'https://roadmap.sh/python' },
  { id: 'java', name: 'Java', framework: 'Spring Boot', language: 'java', runtime: 'java-runtime', api: 'spring', test: 'junit', oop: 'java-mooc', auth: 'spring-security', reference: 'https://roadmap.sh/java' },
];
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const checks = [], errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const check = (name, value) => { assert.ok(value, name); checks.push(name); };
  const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('majorweave.prototype.v1')));
  const goto = route => page.goto(`http://127.0.0.1:5173/#/${route}`);
  try {
    await goto('path');
    for (const spec of specs) {
      await goto('path');
      if (spec.id !== 'node') {
        const before = await saved();
        await page.locator('.stack-option').filter({ hasText: spec.name }).click();
        check(`${spec.name}: changing the roadmap preserves the existing plan`, JSON.stringify((await saved()).tasks) === JSON.stringify(before.tasks));
        check(`${spec.name}: the existing plan is labeled separately`, await page.locator('.stack-plan-note').isVisible());
      }
      check(`${spec.name}: 15 stages include CS foundations`, await page.locator('.module-node').count() === 15 && await page.getByRole('heading', { name: 'Data Structures & Algorithms', exact: true }).isVisible() && await page.getByRole('heading', { name: 'Operating Systems & Linux', exact: true }).isVisible());
      check(`${spec.name}: language reference is correct`, await page.getByRole('link', { name: `${spec.name} trên roadmap.sh`, exact: true }).getAttribute('href') === spec.reference);
      check(`${spec.name}: System Design remains optional`, !(await saved()).selected.includes('design'));
      check(`${spec.name}: document language is a separate preference`, await page.getByLabel('Ngôn ngữ tài liệu', { exact: true }).isVisible());
      await page.getByRole('button', { name: /Object-Oriented Programming/ }).click();
      check(`${spec.name}: OOP source matches the chosen language`, await page.getByRole('dialog').locator('.resource-card.chosen').count() === 1 && await page.getByRole('dialog').locator('.resource-card.chosen a').getAttribute('href') === (spec.id === 'node' ? 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Classes_in_JavaScript' : spec.id === 'python' ? 'https://docs.python.org/3/tutorial/classes.html' : 'https://java-programming.mooc.fi/'));
      await page.getByRole('button', { name: 'Đóng', exact: true }).click();
      await page.getByRole('tab', { name: /Nguồn học/ }).click();
      const library = await page.locator('.resource-grid').innerText();
      check(`${spec.name}: foundation sources are present in the library`, ['Introduction to Algorithms', 'Computer Networking', 'Operating Systems: Three Easy Pieces', 'Computer System Engineering'].every(text => library.includes(text)));
      check(`${spec.name}: library contains the correct framework`, library.includes(spec.framework === 'Express' ? 'Node & ExpressJS' : spec.framework === 'FastAPI' ? 'FastAPI' : 'RESTful Web Service'));
      if (spec.id !== 'node') check(`${spec.name}: Node-only courses are not offered as branch courses`, !library.includes('Node.js Tutorial') && !library.includes('Node & ExpressJS'));
      await page.getByRole('tab', { name: /Roadmap/ }).click();
      await page.getByRole('link', { name: 'Tùy chỉnh roadmap', exact: true }).click();
      await page.getByLabel('Mục tiêu của bạn').fill(`API công việc · ${spec.name}`);
      await page.getByLabel('Ngày bắt đầu').fill('2026-10-05');
      await page.getByRole('button', { name: 'Tạo kế hoạch của tôi', exact: true }).click();
      if (spec.id !== 'node') {
        await page.getByRole('dialog').getByRole('button', { name: 'Giữ kế hoạch hiện tại', exact: true }).click();
        check(`${spec.name}: cancelling a rebuild retains the previous branch`, (await saved()).planMeta.stack !== spec.id);
        await page.getByRole('button', { name: 'Tạo kế hoạch của tôi', exact: true }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Tạo lại kế hoạch', exact: true }).click();
      }
      await page.getByRole('heading', { name: 'Make room for progress.' }).waitFor();
      const state = await saved();
      check(`${spec.name}: the generated plan records its own settings`, state.planMeta.stack === spec.id && state.planMeta.goal === `API công việc · ${spec.name}`);
      check(`${spec.name}: runtime, framework and tests reach the plan`, [spec.runtime, spec.api, spec.test].every(id => state.tasks.some(t => t.moduleId === id)));
      check(`${spec.name}: OOP, DSA, networking, OS and systems reach the plan`, ['oop', 'dsa', 'network', 'os', 'systems'].every(id => state.tasks.some(t => t.moduleId === id)));
      check(`${spec.name}: OOP and authentication use branch-appropriate sources`, state.tasks.filter(t => t.moduleId === 'oop').every(t => t.sourceId === spec.oop) && state.tasks.filter(t => t.moduleId === 'auth').every(t => t.sourceId === spec.auth));
      check(`${spec.name}: no tasks from another language branch`, !state.tasks.some(t => specs.filter(s => s.id !== spec.id).some(s => [s.language, s.runtime, s.api, s.test].includes(t.moduleId))));
      check(`${spec.name}: every week fits the selected time budget`, [...new Set(state.tasks.map(t => t.week))].every(week => state.tasks.filter(t => t.week === week).reduce((s, t) => s + t.minutes, 0) <= state.planMeta.hours * 60));
      check(`${spec.name}: framework task identifiers are unique`, new Set(state.tasks.map(t => t.id)).size === state.tasks.length);
      await page.reload();
      check(`${spec.name}: choice and plan survive reload`, (await saved()).stack === spec.id && (await saved()).planMeta.stack === spec.id);
    }
    await goto('profile');
    await page.getByLabel('Tên hiển thị', { exact: true }).fill('Demo student');
    await page.getByLabel('Ngành đang theo học', { exact: true }).selectOption('data');
    await page.getByRole('button', { name: 'Lưu hồ sơ', exact: true }).click();
    check('Profile edits save and leave the current plan intact', (await saved()).profileName === 'Demo student' && (await saved()).major === 'data' && (await saved()).planMeta.stack === 'java');
    await page.reload();
    check('Profile edits survive reload', await page.getByLabel('Tên hiển thị', { exact: true }).inputValue() === 'Demo student');
    await goto('explore');
    check('Profile major is used by Explore', await page.getByLabel('Ngành đang học', { exact: true }).inputValue() === 'data');
    for (const spec of specs) {
      await goto('path');
      await page.locator('.stack-option').filter({ hasText: spec.name }).click();
      await page.setViewportSize({ width: 320, height: 900 });
      check(`${spec.name}: choice and roadmap fit a 320px phone`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    await goto('path');
    await page.locator('.stack-option').filter({ hasText: 'Python' }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: 'artifacts/backend-stacks-desktop.png' });
    await page.getByRole('button', { name: /Data Structures & Algorithms/ }).click();
    await page.getByRole('dialog').screenshot({ path: 'artifacts/dsa-sources-desktop.png' });
    await page.getByRole('button', { name: 'Đóng', exact: true }).click();
    await goto('profile');
    await page.screenshot({ path: 'artifacts/profile-desktop.png', fullPage: true });
    const legacyContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const legacy = await legacyContext.newPage();
    await legacy.goto('http://127.0.0.1:5173/#/path');
    const oldTasks = [{ id: 'git-0', moduleId: 'git', title: 'Git task from the old plan', minutes: 60, sourceId: 'progit', week: 0, completed: true, completedAt: '2026-10-02T08:00:00.000Z', notes: 'Keep this note' }, { id: 'auth-1', moduleId: 'auth', title: 'Node authentication from the old plan', minutes: 120, sourceId: 'mdn-express', week: 0, completed: true, completedAt: '2026-10-02T09:00:00.000Z', notes: 'Node implementation' }];
    await legacy.evaluate(tasks => localStorage.setItem('majorweave.prototype.v1', JSON.stringify({ version: 1, major: 'software', level: 'basic', selected: ['js', 'git', 'http', 'node', 'express', 'sql', 'auth', 'test', 'deploy'], known: ['js'], sourceByModule: { node: 'w3-node' }, goal: 'Old plan', hours: 5, startDate: '2026-10-05', tasks })), oldTasks);
    await legacy.reload();
    const legacySaved = () => legacy.evaluate(() => JSON.parse(localStorage.getItem('majorweave.prototype.v1')));
    check('Old Node plans restore with correct branch, choices and notes', (await legacySaved()).stack === 'node' && (await legacySaved()).planMeta.stack === 'node' && (await legacySaved()).selected.length === 9 && JSON.stringify((await legacySaved()).tasks) === JSON.stringify(oldTasks) && (await legacySaved()).sourceByModule.node === 'w3-node');
    await legacy.getByRole('button', { name: 'Thêm nền tảng vào roadmap', exact: true }).click();
    check('Explicit foundation upgrade adds five stages without changing the old plan', (await legacySaved()).selected.length === 14 && JSON.stringify((await legacySaved()).tasks) === JSON.stringify(oldTasks));
    await legacy.locator('.stack-option').filter({ hasText: 'Python' }).click();
    check('Changing an old plan preserves its Node metadata', (await legacySaved()).planMeta.stack === 'node' && (await legacySaved()).planMeta.goal === 'Old plan');
    await legacy.getByRole('link', { name: 'Tùy chỉnh roadmap', exact: true }).click();
    await legacy.getByLabel('Mục tiêu của bạn').fill('New Python plan');
    await legacy.getByLabel('Ngày bắt đầu').fill('2026-10-12');
    await legacy.getByRole('link', { name: /^My plan/ }).click();
    check('Editing roadmap inputs does not relabel the old goal or start date', await legacy.getByText('Old plan', { exact: true }).isVisible() && (await legacySaved()).planMeta.startDate === '2026-10-05');
    await legacy.getByRole('link', { name: 'Chỉnh roadmap', exact: true }).click();
    await legacy.getByRole('button', { name: 'Tạo kế hoạch của tôi', exact: true }).click();
    await legacy.getByRole('dialog').getByRole('button', { name: 'Tạo lại kế hoạch', exact: true }).click();
    check('Shared Git completion and date remain after rebuilding for Python', (await legacySaved()).tasks.find(t => t.id === 'git-0').completedAt === oldTasks[0].completedAt && (await legacySaved()).tasks.find(t => t.id === 'git-0').notes === 'Keep this note');
    check('A Node authentication implementation is not counted as completed in Python', (await legacySaved()).tasks.filter(t => t.moduleId === 'auth').every(t => !t.completed && !t.completedAt));
    check('The rebuilt plan records the new branch and start date', (await legacySaved()).planMeta.stack === 'python' && (await legacySaved()).planMeta.startDate === '2026-10-12');
    await legacyContext.close();
    check('No browser runtime errors in stack/profile journeys', errors.length === 0);
    fs.writeFileSync('artifacts/stacks-verification.json', JSON.stringify({ passed: checks.length, checks, errors, date: new Date().toISOString() }, null, 2));
    console.log(`PASS: ${checks.length} stack, foundations, profile and migration checks.`);
  } catch (e) {
    await page.screenshot({ path: 'artifacts/stacks-failure.png', fullPage: true });
    throw e;
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
