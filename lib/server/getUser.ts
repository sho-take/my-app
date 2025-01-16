import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"; // 🚨 クライアントコンポーネントでは使えない！

export async function getUser() {
  const cookieStore = await cookies(); // 🚨 クライアントでは `next/headers` は使えない

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value || null;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string) {
          cookieStore.delete(name);
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("ユーザー情報の取得に失敗:", error.message);
    return null;
  }

  return data.user;
}
