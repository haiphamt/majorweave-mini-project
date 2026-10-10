import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, authMessage, recoveryRequested } from './supabase';

type AuthState = {
  session: Session | null;
  configured: boolean;
  loading: boolean;
  recovering: boolean;
  error: string;
  retry: () => Promise<void>;
  finishRecovery: () => void;
};
const AuthContext = createContext<AuthState>({ session: null, configured: false, loading: false,
  recovering: false, error: '', retry: async () => {}, finishRecovery: () => {} });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!!supabase);
  const [recovering, setRecovering] = useState(false);
  const [error, setError] = useState('');
  async function retry() {
    if (!supabase) return;
    setLoading(true);
    try {
      const result = await supabase.auth.getSession();
      setError(authMessage(result.error));
      if (!result.error) { setSession(result.data.session); if (recoveryRequested && result.data.session) setRecovering(true); }
    } catch { setError('Chưa kiểm tra được phiên đăng nhập. Kiểm tra kết nối rồi thử lại.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    let eventReceived = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, next) => {
      if (!alive) return;
      eventReceived = true;
      setSession(next);
      setLoading(false);
      setError('');
      if (event === 'PASSWORD_RECOVERY' || event === 'INITIAL_SESSION' && recoveryRequested && next) setRecovering(true);
      if (event === 'SIGNED_OUT') setRecovering(false);
    });
    // Auth callbacks must remain synchronous; API calls here can deadlock the SDK.
    void supabase.auth.getSession().then(result => {
      if (!alive || eventReceived) return;
      if (!result.error) { setSession(result.data.session); if (recoveryRequested && result.data.session) setRecovering(true); }
      setError(authMessage(result.error));
      setLoading(false);
    }).catch(() => { if (alive && !eventReceived) { setError('Chưa kiểm tra được phiên đăng nhập.'); setLoading(false); } });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);
  // Let Supabase consume/clean email callback tokens before mounting HashRouter.
  return <AuthContext.Provider value={{ session, configured: !!supabase, loading, recovering, error, retry, finishRecovery: () => setRecovering(false) }}>
    {loading ? <div className="auth-startup" role="status">Đang mở uitplans.…</div> : children}
  </AuthContext.Provider>;
}
