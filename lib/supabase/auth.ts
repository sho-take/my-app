import { supabase } from "@/utils/supabase/client";

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`, // 🔥 認証後にリダイレクト
    },
  });

  if (error) {
    console.error("Google認証に失敗:", error.message);
  }
}
