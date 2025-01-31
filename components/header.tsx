"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 🔹 ログイン中のユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("ユーザー情報の取得に失敗:", error.message);
      } else {
        setUserEmail(user?.email || "ゲスト");
      }
    };

    fetchUser();
  }, []);

  // 🔹 ログアウト処理
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("ログアウトに失敗しました:", error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <header className="bg-blue-600 text-white p-4 pl-72 flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-xl font-bold whitespace-nowrap">
        タスク管理ツールへようこそ
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold">
          こんにちは、{userEmail} さん
        </span>
        <Button
          variant="secondary"
          size="sm"
          className="bg-blue-700 text-white hover:bg-blue-800"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> ログアウト
        </Button>
      </div>
    </header>
  );
}
