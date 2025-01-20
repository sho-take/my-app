"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.error("認証セッションの取得に失敗しました:", error?.message);
        router.push("/login");
      } else {
        router.push("/");
      }
    };

    checkSession();
  }, [router]);

  return <p>認証処理中...</p>;
};

export default AuthCallback;
