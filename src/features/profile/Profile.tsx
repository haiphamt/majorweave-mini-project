import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, GraduationCap, UserRound } from 'lucide-react';
import { faculties, majorName, stacks } from '../../data';
import { StudyActivity } from '../../components/StudyActivity';
import type { State } from '../../state';
import { validateProfile } from '../../domain/validate';

export function Profile({ state, update, toast }: { state: State; update: (patch: Partial<State>) => void; toast: (text: string) => void }) {
  const [name, setName] = useState(state.profileName);
  const [major, setMajor] = useState(state.major);
  const [error, setError] = useState('');
  useEffect(() => { setName(state.profileName); setMajor(state.major); setError(''); }, [state.profileName, state.major]);
  const cancel = () => { setName(state.profileName); setMajor(state.major); setError(''); };
  const save = () => {
    const result = validateProfile({ displayName: name.trim(), majorId: major || null, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }, faculties.flatMap(f => f.majors.map(m => m.id)));
    if (!result.ok) { setError(result.issues.map(issue => issue.message).join(' ')); return; }
    try {
      update({ profileName: result.value.displayName, major: result.value.majorId || '' });
      setName(result.value.displayName);
      setError('');
      // Legacy update returns void. Only AppShell knows whether persistence succeeded.
      toast('Đã cập nhật hồ sơ. Xem trạng thái lưu ở thanh trên.');
    } catch {
      setError('Chưa cập nhật được hồ sơ. Thông tin đang chỉnh vẫn được giữ để thử lại.');
    }
  };
  const plan = state.planMeta;
  return <div className="page profile-page">
    <div className="eyebrow page-eyebrow">MY PROFILE</div>
    <div className="page-heading"><div><h1>Your learning<br /><em>rhythm.</em></h1><p>Một nơi để nhìn lại những bước nhỏ và chỉnh thông tin học tập.</p></div><span className="heading-tag"><UserRound size={16} />{state.profileName || 'Người học'}</span></div>
    <div className="profile-layout"><form className="profile-paper" onSubmit={e => { e.preventDefault(); save(); }}>
      <span className="eyebrow">A LITTLE ABOUT YOU</span><h2>Hồ sơ trên thiết bị</h2>
      <label>Tên hiển thị<input maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="Bạn muốn được gọi là gì?" /></label>
      <label>Ngành đang theo học<select aria-label="Ngành đang theo học" value={major} onChange={e => setMajor(e.target.value)}><option value="">Chưa chọn ngành</option>{faculties.map(f => <optgroup key={f.id} label={f.name}>{f.majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</optgroup>)}</select></label>
      <p className="source-note">Ngành học giúp ưu tiên gợi ý. Bạn vẫn có thể khám phá hướng thuộc khoa khác.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="primary-button"><Check size={16} />Lưu hồ sơ</button>{' '}
      <button type="button" className="quiet-button" onClick={cancel}>Hủy thay đổi</button>
    </form><section className="profile-learning"><span className="eyebrow">WHERE YOU ARE HEADING</span><h2>Đang khám phá</h2><div className="profile-direction"><GraduationCap size={23} /><div><strong>{majorName(state.major)}</strong><span>Backend · {stacks[state.stack].name} / {stacks[state.stack].framework}</span></div></div>
      <p>{plan ? `Kế hoạch đang học: ${stacks[plan.stack].name} · ${plan.goal}.` : 'Chưa tạo kế hoạch. Hãy chọn chặng và dành một quỹ thời gian mỗi tuần.'}</p>
      <Link className="text-link" to="/path">Đổi nhánh và nguồn học <ArrowRight size={15} /></Link>
      <div className="profile-device"><span className="eyebrow">ON THIS DEVICE</span><strong>Hồ sơ trên trình duyệt này</strong><p>Bản thử đang lưu hồ sơ và kế hoạch trên máy này. Chưa có tài khoản hoặc đồng bộ sang thiết bị khác.</p></div>
    </section></div>
    <StudyActivity tasks={state.tasks} />
    <p className="profile-history-note">Biểu đồ dựa trên các việc có ngày hoàn thành được giữ trong kế hoạch hiện tại. Các việc bị bỏ khi tạo lại kế hoạch không còn được tính.</p>
    <div className="profile-plan-link"><div><h3>Sẵn sàng cho bước tiếp theo?</h3><p>Xem việc cần làm và tiến độ từng tuần tại My Plan.</p></div><Link className="secondary-button" to="/plan">Mở My Plan <ArrowRight size={16} /></Link></div>
  </div>;
}
