import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

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

  // セッションの取得
  const { data: { session } } = await supabase.auth.getSession();

  // 未ログイン時はログインページへリダイレクト
  if (!session && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

// クッキーオプションを適切に設定するヘルパー関数
function serializeCookieOptions(options: Record<string, unknown>) {
  const parts = [];
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  return parts.join('; ');
}

export const config = {
  matcher: ['/', '/dashboard', '/login'], // ミドルウェアを適用するパス
};
