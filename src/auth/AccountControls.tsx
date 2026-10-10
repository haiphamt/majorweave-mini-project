import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LogOut, UserRound } from 'lucide-react';
import { Dialog } from '../components/ui';
import { downloadBackup } from '../components/downloadBackup';
import { useWorkspace } from '../app/WorkspaceProvider';
import { useAccountScope } from '../app/AccountWorkspace';
import { readGuestBackup } from '../persistence/guest-backup';
import { useAuth } from './AuthProvider';
import { supabase, authMessage } from './supabase';

type Mode = 'account' | 'signin' | 'signup' | 'forgot' | 'recover' | 'verify' | null;
export function AccountControls() {
  const auth = useAuth();
  const scope = useAccountScope();
  const { workspace, dirty, status, transfer, unsavedWorkspace, preview, actions } = useWorkspace();
  const [mode, setMode] = useState<Mode>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendAt, setResendAt] = useState(0);
  const [resetAt, setResetAt] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [ownPreview, setOwnPreview] = useState(false);
  const [includeProfile, setIncludeProfile] = useState(false);
  const [includeChoices, setIncludeChoices] = useState(false);
  const busy = working || status === 'saving' || status === 'loading';
  const pending = scope.formDirty || dirty || !!unsavedWorkspace || !!transfer || !!preview;
  const user = auth.session?.user;
  const metadataName = typeof user?.user_metadata?.username === 'string' ? user.user_metadata.username.slice(0, 80) : '';
  const accountName = workspace?.profile.displayName || metadataName || 'Account';
  useEffect(() => { if (auth.recovering) { setMode('recover'); setPassword(''); setConfirmPassword(''); setError(''); } }, [auth.recovering]);
  const cooldown = mode === 'forgot' ? resetAt : resendAt;
  useEffect(() => {
    const tick = () => setSeconds(Math.max(0, Math.ceil((cooldown - Date.now()) / 1000)));
    tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer);
  }, [cooldown]);
  function open(next: Mode) {
    setMode(next); setError(''); setMessage(''); setPassword(''); setConfirmPassword(''); setShowPassword(false);
  }
  function close() {
    if (busy) return;
    if (ownPreview) {
      const result = actions.cancelTransfer();
      if (!result.ok) { setError(result.issues.map(i => i.message).join(' ')); return; }
      setOwnPreview(false);
    }
    setMode(null); setPassword(''); setConfirmPassword('');
    if (auth.recovering) auth.finishRecovery();
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase || busy) return;
    if (!scope.cloud && pending) { setError('Lưu hoặc xử lý thay đổi Guest trước khi đăng nhập. Bạn có thể xuất sao lưu trong menu Guest.'); return; }
    if ((mode === 'signup' || mode === 'recover') && password !== confirmPassword) { setError('Hai lần nhập mật khẩu chưa khớp.'); return; }
    setWorking(true); setError(''); setMessage('');
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    try {
      if (mode === 'signin') {
        const result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (result.error) { setError(authMessage(result.error)); return; }
        setMode(null);
      } else if (mode === 'signup') {
        const result = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { username: name.trim() }, emailRedirectTo: redirectTo } });
        if (result.error) { setError(authMessage(result.error)); return; }
        if (result.data.session) setMode(null);
        else { setMode('verify'); setResendAt(Date.now() + 60000); setMessage('Kiểm tra hộp thư và bấm liên kết xác nhận. Nếu bạn đã có tài khoản, hãy quay lại đăng nhập.'); }
      } else if (mode === 'forgot') {
        const result = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
        if (result.error) setError(authMessage(result.error));
        else { setMessage('Nếu email có tài khoản, bạn sẽ nhận được liên kết đặt lại mật khẩu. Hãy kiểm tra cả thư mục Spam.'); setResetAt(Date.now() + 60000); }
      } else if (mode === 'recover') {
        const result = await supabase.auth.updateUser({ password });
        if (result.error) setError(authMessage(result.error));
        else { auth.finishRecovery(); setMode('account'); setMessage('Đã cập nhật mật khẩu.'); }
      }
    } catch { setError('Chưa kết nối được. Vui lòng thử lại.'); }
    finally { setPassword(''); setConfirmPassword(''); setWorking(false); }
  }
  async function resend() {
    if (!supabase || seconds || busy) return;
    setWorking(true); setError('');
    try {
      const result = await supabase.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` } });
      if (result.error) setError(authMessage(result.error));
      else { setMessage('Yêu cầu gửi lại đã được tiếp nhận. Kiểm tra hộp thư của bạn.'); setResendAt(Date.now() + 60000); }
    } catch { setError('Chưa gửi được yêu cầu. Vui lòng thử lại.'); }
    finally { setWorking(false); }
  }
  function exportCurrent() {
    const result = actions.exportBackupFile();
    if (result.ok) downloadBackup(result.value.json);
    else setError(result.issues.map(i => i.message).join(' '));
  }
  async function signOut() {
    if (!supabase || busy) return;
    if (pending) { setError('Lưu, xuất hoặc xử lý phần đang sửa trước khi đăng xuất.'); return; }
    setWorking(true); setError('');
    try {
      const result = await supabase.auth.signOut({ scope: 'local' });
      if (result.error) setError(authMessage(result.error));
      else setMode(null);
    } catch { setError('Chưa đăng xuất được. Vui lòng thử lại.'); }
    finally { setWorking(false); }
  }
  async function prepareGuest() {
    if (!scope.cloud || scope.userId !== user?.id || busy) return;
    if (pending) { setError('Lưu hoặc hủy thay đổi hiện tại trước khi đưa dữ liệu Guest vào tài khoản.'); return; }
    setWorking(true); setError(''); setMessage('');
    try {
      const guest = await readGuestBackup();
      if (!guest.ok) { setError(guest.issues.map(i => i.message).join(' ')); return; }
      const source = guest.value.file.workspace;
      if (!source.plans.length && !Object.keys(source.drafts).length && !source.savedCredentialIds.length && !source.profile.displayName && !source.profile.majorId) { setMessage('Guest chưa có dữ liệu để chuyển.'); return; }
      const result = await actions.prepareImport(guest.value.json, {
        planActions: Object.fromEntries(source.plans.map(p => [p.id, 'copy'])),
        importProfile: includeProfile, importPreferences: includeChoices, importDrafts: includeChoices, importCredentials: includeChoices,
      });
      if (result.ok) setOwnPreview(true);
      else setError(result.issues.map(i => i.message).join(' '));
    } catch { setError('Chưa mở được dữ liệu Guest. Bản gốc vẫn được giữ.'); }
    finally { setWorking(false); }
  }
  async function confirmGuest() {
    if (busy || !ownPreview) return;
    setWorking(true); setError('');
    try {
      const result = await actions.confirmTransfer();
      if (result.ok) { setOwnPreview(false); setMessage('Đã đưa dữ liệu vào tài khoản. Bản Guest trên thiết bị vẫn được giữ.'); }
      else setError(result.issues.map(i => i.message).join(' '));
    } catch { setError('Chưa chuyển được dữ liệu. Bản xem trước vẫn được giữ để thử lại.'); }
    finally { setWorking(false); }
  }
  const titles = { account: user ? 'Your account.' : 'Guest.', signin: 'Welcome back.', signup: 'A new beginning.', forgot: 'Forgot your password?', recover: 'Choose a new password.', verify: 'Check your email.' };
  return <>
    <button className="account-pill" onClick={() => open('account')} aria-label={user ? 'Mở tài khoản' : 'Mở menu Guest'}><span className="status-dot"/>{user ? accountName : scope.cloud ? 'Session expired' : 'Guest'}</button>
    {!user && <button className="secondary-button nav-signin" onClick={() => open('signin')}>Sign in</button>}
    {mode && <Dialog title={titles[mode]} className="account-dialog" onClose={close}>
      <div className="dialog-body">
        {error && <p className="auth-feedback auth-error" role="alert">{error}</p>}
        {message && <p className="auth-feedback" role="status">{message}</p>}
        {auth.error && <div className="auth-feedback" role="alert"><p>{auth.error}</p><button className="text-link" onClick={() => void auth.retry()}>Thử kiểm tra phiên đăng nhập</button></div>}
        {mode === 'account' ? <>
          <p className="account-description">{user ? 'Kế hoạch của bạn, trên những thiết bị bạn dùng.' : 'Bắt đầu ngay. Kế hoạch được giữ trên trình duyệt này.'}</p>
          {user && <p className="account-email">{user.email}</p>}
          <div className="account-menu-links"><Link to="/profile" onClick={close}><UserRound size={18}/>Hồ sơ & nhịp học<ArrowRight size={16}/></Link><button disabled={busy} onClick={exportCurrent}>Xuất file sao lưu<ArrowRight size={16}/></button></div>
          {user && scope.cloud && scope.userId === user.id && <>
            <section className="guest-transfer"><h3>Mang theo kế hoạch Guest.</h3><p>Xem trước dữ liệu trên thiết bị này và chọn đưa vào tài khoản. Kế hoạch online đang có được giữ lại.</p>
              {ownPreview && transfer?.kind === 'backup' ? <>
                <p>{transfer.value.addedPlanIds.length} kế hoạch sẽ được thêm.</p>
                <ul>{transfer.value.candidate.plans.filter(p => transfer.value.addedPlanIds.includes(p.id)).map(p => <li key={p.id}>{p.name}</li>)}</ul>
                <p>Hồ sơ: {includeProfile ? 'nhập từ Guest' : 'giữ hiện tại'}. Lựa chọn học: {includeChoices ? 'nhập phần phù hợp từ Guest' : 'giữ hiện tại'}.</p>
                <div className="account-inline-actions"><button className="primary-button" disabled={busy} onClick={() => void confirmGuest()}>Xác nhận đưa vào tài khoản</button><button className="text-link" disabled={busy} onClick={() => { const r = actions.cancelTransfer(); if (r.ok) setOwnPreview(false); }}>Hủy</button></div>
              </> : <>
                <label className="checkbox-label"><input type="checkbox" checked={includeProfile} onChange={e => setIncludeProfile(e.target.checked)}/>Nhập hồ sơ Guest</label>
                <label className="checkbox-label"><input type="checkbox" checked={includeChoices} onChange={e => setIncludeChoices(e.target.checked)}/>Nhập lựa chọn học, nguồn và mục tiêu chứng nhận</label>
                <button className="secondary-button" disabled={busy} onClick={() => void prepareGuest()}>Xem trước dữ liệu Guest</button>
              </>}
            </section>
            <button className="text-link" disabled={busy || pending} onClick={async () => { const r = await actions.reloadWorkspace(); if (!r.ok) setError(r.issues.map(i => i.message).join(' ')); else setMessage('Đã tải dữ liệu mới nhất trong tài khoản.'); }}>Tải kế hoạch mới nhất</button>
          </>}
          <div className="account-bottom">{user ? <button className="secondary-button" disabled={busy} onClick={() => void signOut()}><LogOut size={17}/>Sign out</button> : <><button className="primary-button" onClick={() => open('signin')}>Sign in<ArrowRight size={17}/></button><p>Đăng nhập để dùng kế hoạch trên nhiều thiết bị.</p></>}</div>
        </> : mode === 'verify' ? <>
          <p>Liên kết xác nhận dành cho <strong>{email}</strong>. Bạn có thể mở email để hoàn tất đăng ký, rồi quay lại uitplans.</p>
          <p className="source-note">Chưa thấy thư? Kiểm tra Spam và địa chỉ email đã nhập.</p>
          <button className="secondary-button" disabled={busy || seconds > 0} onClick={() => void resend()}>{seconds ? `Gửi lại sau ${seconds}s` : 'Gửi lại email xác nhận'}</button>
          <button className="text-link auth-back" onClick={() => open('signin')}>Quay lại đăng nhập</button>
        </> : <>
          <p className="account-description">{mode === 'signup' ? 'Tạo tài khoản để giữ kế hoạch và tiếp tục học ở thiết bị khác.' : mode === 'forgot' ? 'Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu.' : mode === 'recover' ? 'Đặt mật khẩu mới cho tài khoản vừa được xác nhận qua email.' : 'Tiếp tục kế hoạch của bạn.'}</p>
          {!auth.configured && <p className="auth-feedback" role="status">Đăng nhập chưa được bật cho bản này. Bạn vẫn có thể dùng Guest và lưu kế hoạch trên thiết bị.</p>}
          <form onSubmit={e => void submit(e)}><fieldset disabled={busy || !auth.configured}>
            {mode === 'signup' && <label>Tên hiển thị<input autoComplete="nickname" value={name} maxLength={80} onChange={e => setName(e.target.value)} placeholder="Bạn muốn được gọi là gì?"/></label>}
            {mode !== 'recover' && <label>Email<input type="email" autoComplete="email" value={email} required maxLength={254} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label>}
            {mode !== 'forgot' && <><label>{mode === 'recover' ? 'Mật khẩu mới' : 'Mật khẩu'}<span className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} required minLength={mode === 'signin' ? undefined : 8} maxLength={128} onChange={e => setPassword(e.target.value)}/><button className="icon-button" type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></span></label>
              {(mode === 'signup' || mode === 'recover') && <label>Nhập lại mật khẩu<input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} required minLength={8} maxLength={128} onChange={e => setConfirmPassword(e.target.value)}/></label>}
            </>}
            {mode === 'signin' && <button className="text-link auth-forgot" type="button" onClick={() => open('forgot')}>Forgot password?</button>}
            <button className="primary-button full-width" disabled={mode === 'forgot' && seconds > 0} type="submit">{working ? 'Đang xử lý…' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? seconds ? `Gửi lại sau ${seconds}s` : 'Gửi liên kết đặt lại' : mode === 'recover' ? 'Lưu mật khẩu mới' : 'Sign in'}</button>
          </fieldset></form>
          <p className="auth-switch">{mode === 'signin' ? <>Chưa có tài khoản? <button className="text-link" disabled={busy} onClick={() => open('signup')}>Create one</button></> : mode !== 'recover' ? <button className="text-link" disabled={busy} onClick={() => open('signin')}>Quay lại đăng nhập</button> : null}</p>
        </>}
        {mode !== 'account' && <button className="auth-guest" disabled={busy} onClick={close}>{user ? 'Quay lại kế hoạch' : 'Keep planning as a guest'}</button>}
      </div>
    </Dialog>}
  </>;
}
