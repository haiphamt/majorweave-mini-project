import { useRef, useState } from 'react';
import { localISO, shortDate, type Task } from './state';

export function StudyActivity({ tasks }: { tasks: Task[] }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monday = new Date(today); monday.setDate(today.getDate() - (today.getDay() + 6) % 7);
  const start = new Date(monday); start.setDate(start.getDate() - 11 * 7);
  const days = Array.from({ length: 84 }, (_, index) => {
    const date = new Date(start); date.setDate(start.getDate() + index);
    return { date, key: localISO(date), future: date > today };
  });
  const [selected, setSelected] = useState(localISO(today));
  const grid = useRef<HTMLDivElement>(null);
  const counts: Record<string, number> = {};
  for (const task of tasks) {
    if (!task.completed || !task.completedAt) continue;
    const date = new Date(task.completedAt);
    if (!Number.isFinite(date.getTime())) continue;
    const key = localISO(date); counts[key] = (counts[key] || 0) + 1;
  }
  const activeDays = days.filter(day => !day.future && counts[day.key] > 0);
  const completions = activeDays.reduce((sum, day) => sum + counts[day.key], 0);
  const undated = tasks.filter(task => task.completed && !task.completedAt).length;
  const chosenDay = days.find(day => day.key === selected) || days.find(day => day.key === localISO(today))!;
  const dateLabel = (date: Date) => date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  const countLabel = (key: string) => `${counts[key] || 0} việc hoàn thành`;
  const lastUsable = days.findIndex(day => day.key === localISO(today));
  return <section className="study-activity" aria-labelledby="study-activity-title">
    <div className="activity-heading"><div><span className="eyebrow">SMALL STEPS, OVER TIME</span><h2 id="study-activity-title">Nhịp học của bạn<span className="rust-text">.</span></h2></div><span className="activity-range">12 tuần gần nhất · {shortDate(start)} — {shortDate(today)}</span></div>
    <p className="activity-caption">Mỗi ô là một ngày. Màu thể hiện số việc bạn đánh dấu hoàn thành trong ngày đó.</p>
    <div className="activity-layout"><div className="activity-chart"><div className="activity-weekdays" aria-hidden="true">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => <span key={day}>{day}</span>)}</div><div className="activity-grid" ref={grid} aria-label="Lịch hoàn thành trong 12 tuần">{days.map((day, index) => {
      const count = counts[day.key] || 0;
      return <button type="button" key={day.key} data-date={day.key} className={`activity-cell level-${Math.min(count, 4)} ${selected === day.key ? 'selected' : ''} ${day.future ? 'future' : ''}`} disabled={day.future} tabIndex={selected === day.key ? 0 : -1} aria-label={`${dateLabel(day.date)}: ${day.future ? 'ngày sắp tới' : countLabel(day.key)}`} aria-pressed={selected === day.key} title={`${dateLabel(day.date)} · ${day.future ? 'Ngày sắp tới' : countLabel(day.key)}`} onClick={() => setSelected(day.key)} onKeyDown={event => {
        const delta = ({ ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 } as Record<string, number>)[event.key];
        if (delta === undefined) return;
        event.preventDefault();
        const next = days[Math.min(lastUsable, Math.max(0, index + delta))].key;
        setSelected(next); grid.current?.querySelector<HTMLButtonElement>(`[data-date="${next}"]`)?.focus();
      }} />;
    })}</div><div className="activity-months" aria-hidden="true">{Array.from({ length: 12 }, (_, week) => {
      const date = days[week * 7].date;
      return <span key={week}>{week === 0 || date.getMonth() !== days[(week - 1) * 7].date.getMonth() ? `Th${date.getMonth() + 1}` : ''}</span>;
    })}</div></div><div className="activity-totals"><div><strong>{activeDays.length}</strong><span>ngày có việc hoàn thành</span></div><div><strong>{completions}</strong><span>việc trong 12 tuần</span></div></div></div>
    <div className="activity-footer"><p className="activity-day-detail" role="status">{dateLabel(chosenDay.date)} · <strong>{countLabel(chosenDay.key)}</strong></p><div className="activity-legend"><span>0</span>{[0, 1, 2, 3, 4].map(level => <span key={level} className={`activity-cell level-${level}`} title={level === 4 ? '4 việc trở lên' : `${level} việc`} />)}<span>4+ việc</span></div></div>
    {completions === 0 && <p className="activity-caption">Đánh dấu một việc hoàn thành để bắt đầu ghi nhận nhịp học của bạn.</p>}
    {undated > 0 && <p className="activity-caption">{undated} việc đã hoàn thành chưa có ngày ghi nhận; tiến độ vẫn được giữ, biểu đồ chỉ tính những việc có ngày.</p>}
    <p className="activity-note">Số việc do bạn tự ghi nhận, không xác minh thời gian học hoặc tiến độ tại website bên ngoài. Dùng phím mũi tên để xem các ngày.</p>
  </section>;
}
