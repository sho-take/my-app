"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/supabase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(`ログインに失敗しました: ${error.message}`);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("ログインエラー:", err);
      setError("ログイン処理中にエラーが発生しました");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>ログイン</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
        />
        <Button type="submit" style={{ width: "100%" }}>ログイン</Button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* 🔥 Google ログインボタン（デザイン維持） */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button onClick={signInWithGoogle} style={{ backgroundColor: "#4285F4", color: "white", width: "100%" }}>
          Googleでログイン
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
