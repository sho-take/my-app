"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        setError(`ログインに失敗しました: ${error.message}`);
      } else {
        // クッキー確認
        console.log("クッキー情報:", document.cookie);
  
        // セッション確認してリダイレクト
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/"); // ルートページに遷移
        } else {
          setError("セッションが正しく設定されていません");
        }
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
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ログイン
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
