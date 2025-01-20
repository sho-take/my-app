import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const code = url.searchParams.get("code"); // 🔥 Google 認証コードを取得
  

  if (!code) {
    console.error("⚠️ 認証コードが見つかりません");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // 🔥 認証コードを使ってセッションを交換（ここが重要）
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("⚠️ Google 認証後のセッション取得に失敗:", error?.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("✅ Google認証成功！ユーザー:", data.session.user);

  // 🔥 認証成功後に `/` にリダイレクト
  return NextResponse.redirect(new URL("/", request.url));
}
