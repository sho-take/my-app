import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Supabase の認証トークンを取得
  const accessToken = request.cookies.get('sb-access-token');

  console.log("Middleware - Session情報:", {
    hasSession: !!accessToken,
    accessToken: accessToken?.value || "なし",
  });

  // 未ログインなら /login にリダイレクト
  if (request.nextUrl.pathname === '/' && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // ミドルウェアを適用するルート
};
