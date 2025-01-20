"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client"; // ✅ Supabaseクライアント
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AddCommentForm() {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // ✅ `user_id` を追加
  const [loading, setLoading] = useState(true); // ✅ ロード状態を追加

  // ✅ API 経由で `user_id` を取得
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        console.log("API へリクエスト開始...");
        const response = await fetch("/api/user");
        const data = await response.json();
        console.log("取得したユーザーデータ:", JSON.stringify(data, null, 2));

        if (data?.id) {
          setUserId(data.id);
        } else {
          console.error("API から `id` が返ってこなかった");
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.error("ユーザーIDが取得できていません");
      return;
    }

    const timestamp = new Date().toISOString(); // ✅ 現在の日時
    const avatar = "/default-avatar.jpg"; // ✅ 仮のアバター画像

    const { error } = await supabase.from("comments").insert({
      author,
      content,
      timestamp,
      avatar,
      user_id: userId, // ✅ `user_id` をセット
    });

    if (error) {
      console.error("コメントの追加に失敗しました:", error.message);
    } else {
      console.log("コメントが追加されました");
      setAuthor("");
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ✅ ユーザー情報取得中はボタンを無効化 */}
      {loading ? (
        <p>ユーザー情報を取得中...</p>
      ) : (
        <>
          <div>
            <Label htmlFor="author">名前</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">コメント</Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={!userId}>
            送信
          </Button>
        </>
      )}
    </form>
  );
}
