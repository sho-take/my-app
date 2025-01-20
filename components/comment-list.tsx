"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Comment } from "@/lib/comments";

export function CommentList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ ユーザーIDを API から取得
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        console.log("API へリクエスト開始...");
        const response = await fetch("/api/user");
        const data = await response.json();
        console.log("取得したユーザーデータ:", JSON.stringify(data, null, 2)); // 🔥 デバッグログ追加

        if (data?.id) {
          setUserId(data.id); // ✅ `id` に統一
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

  // ✅ userId が変更されるたびにコメントを取得
  useEffect(() => {
    if (!userId) return;

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("user_id", userId) // 🔥 ユーザーIDに紐づくコメントのみ取得
        .order("timestamp", { ascending: false })
        .limit(5);

      if (error) {
        console.error("コメントの取得に失敗しました:", error.message);
      } else {
        setComments(data || []);
      }
    };

    fetchComments();

    // ✅ リアルタイム更新
    const subscription = supabase
      .channel("comments-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments", filter: `user_id=eq.${userId}` },
        (payload) => {
          if (
            payload.new &&
            "id" in payload.new &&
            "author" in payload.new &&
            "content" in payload.new &&
            "timestamp" in payload.new &&
            "avatar" in payload.new
          ) {
            setComments((prev) => [payload.new as Comment, ...prev.slice(0, 4)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  // ✅ ロード中は「ユーザー情報を取得中...」を表示
  if (loading) return <p>ユーザー情報を取得中...</p>;

  // ✅ `userId` が `null` なら「ログインしてください」と表示
  if (!userId) return <p>ログインしてください</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>最新のコメント</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start space-x-4 p-4 border-b last:border-b-0"
            >
              <Avatar>
                <AvatarImage src={comment.avatar} alt={comment.author} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{comment.author}</h3>
                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
