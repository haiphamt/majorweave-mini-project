import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
function publicKey(value: string | undefined) {
  if (!value) return false;
  if (value.startsWith('sb_publishable_')) return true;
  try { return JSON.parse(atob(value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).role === 'anon'; } catch { return false; }
}
function validURL(value: string | undefined) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return !parsed.username && !parsed.password && !parsed.search && !parsed.hash && parsed.pathname === '/' &&
      (parsed.protocol === 'https:' || import.meta.env.DEV && parsed.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname));
  } catch { return false; }
}
const configured = validURL(url) && publicKey(key);

// Capture the recovery intent before Supabase consumes the email callback fragment.
export const recoveryRequested = typeof window !== 'undefined' && new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery';

// Guest needs no auth SDK download when the project has not enabled accounts.
export const supabase: SupabaseClient | null = configured ? (await import('@supabase/supabase-js')).createClient(url!, key!, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;

export function authMessage(error: { code?: string; message?: string } | null): string {
  if (!error) return '';
  switch (error.code) {
    case 'invalid_credentials': return 'Email hoặc mật khẩu chưa đúng.';
    case 'email_not_confirmed': return 'Bạn cần xác nhận email trước khi đăng nhập.';
    case 'email_address_not_authorized': return 'Hệ thống gửi email chưa hỗ trợ địa chỉ này. Bạn có thể tiếp tục dùng Guest.';
    case 'user_already_exists': return 'Email này đã đăng ký. Hãy đăng nhập hoặc đặt lại mật khẩu.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit': return 'Bạn gửi yêu cầu hơi nhanh. Chờ một chút rồi thử lại.';
    case 'weak_password': return 'Mật khẩu chưa đủ mạnh. Hãy dùng ít nhất 8 ký tự.';
    case 'signup_disabled': return 'Đăng ký tài khoản đang tạm đóng. Bạn vẫn có thể dùng Guest.';
    default: return 'Chưa hoàn tất yêu cầu. Kiểm tra kết nối hoặc thử lại sau.';
  }
}
