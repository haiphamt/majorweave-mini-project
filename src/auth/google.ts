import type { SupabaseClient } from '@supabase/supabase-js';

export async function prepareGoogleSignIn(client: Pick<SupabaseClient, 'auth'>, redirectTo: string, pending: boolean) {
  // OAuth leaves the page: even expired-account edits must be saved/exported first.
  if (pending) return { ok: false as const, message: 'Lưu hoặc xử lý phần đang sửa trước khi đăng nhập Google. Bạn có thể xuất file sao lưu trong menu tài khoản.' };
  try {
    const result = await client.auth.signInWithOAuth({ provider: 'google', options: {
      redirectTo, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' },
    } });
    if (result.error || !result.data.url) return { ok: false as const, message: 'Chưa mở được đăng nhập Google. Bạn vẫn có thể dùng Guest và thử lại sau.' };
    return { ok: true as const, url: result.data.url };
  } catch { return { ok: false as const, message: 'Chưa kết nối được. Kiểm tra mạng rồi thử lại.' }; }
}

export function googleCallbackMessage(fragment: string) {
  const params = new URLSearchParams(fragment.replace(/^#/, ''));
  if (!params.has('error')) return '';
  return params.get('error') === 'access_denied'
    ? 'Đăng nhập Google chưa hoàn tất. Bạn có thể thử lại hoặc tiếp tục dùng Guest.'
    : 'Chưa hoàn tất đăng nhập. Hãy mở Sign in để thử lại.';
}
