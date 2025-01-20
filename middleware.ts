import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const isCallbackPage = request.nextUrl.pathname.startsWith('/auth/callback'); // 🔥 `/auth/callback` を除外
  const isLoginPage = request.nextUrl.pathname === '/login';

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieString = `${name}=${value}; ${serializeCookieOptions(options ?? {})}`;
            response.headers.append('Set-Cookie', cookieString);
          });
        },
      },
    }
  );

  // ✅ `/auth/callback` の場合、セッションチェックをスキップ
  if (isCallbackPage) {
    return response;
  }

  // ✅ セッションを取得
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) {
    console.error("⚠️ セッションの取得に失敗:", error.message);
  } else {
    console.log("✅ セッション取得成功:", session);
  }

  // 🔥 未ログインなら `/login` へリダイレクト
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

// ✅ クッキーオプションを適切に設定するヘルパー関数
function serializeCookieOptions(options: Record<string, unknown>) {
  const parts = [];
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join('; ');
}

// ✅ `/auth/callback` を除外
export const config = {
  matcher: ['/', '/dashboard', '/login', '/auth/callback'], // 🔥 `/auth/callback` を適用対象に追加
};
