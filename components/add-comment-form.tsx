"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AddCommentForm() {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toISOString(); // 現在の日時
    const avatar = "/default-avatar.jpg"; // 仮のアバター画像

    const { error } = await supabase.from("comments").insert({
      author,
      content,
      timestamp,
      avatar,
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
      <Button type="submit">送信</Button>
    </form>
  );
}
