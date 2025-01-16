"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトに失敗しました:", error.message);
      return;
    }
    console.log("ログアウト成功");

    // クライアント側のセッション情報を削除
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // ログインページにリダイレクト
    router.push("/login");
  };

  return handleLogout;
}
