"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client"; // ✅ Supabaseクライアント
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddCommentForm } from "@/components/add-comment-form";

type Comment = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
  user_id: string; // ✅ ユーザーIDを追加
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ API経由で `user_id` を取得
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

  // ✅ `userId` を取得したらコメントを取得
  useEffect(() => {
    if (!userId) return;

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("user_id", userId) // 🔥 ユーザーIDに紐づくコメントのみ取得
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("コメントの取得に失敗しました:", error.message);
      } else if (data && Array.isArray(data)) {
        setComments(data as Comment[]);
      } else {
        console.error("コメントデータが無効です:", data);
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
          if (payload.eventType === "INSERT") {
            setComments((prev) => [payload.new as Comment, ...prev]);
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
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>コメント一覧</CardTitle>
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>新しいコメントを追加</CardTitle>
        </CardHeader>
        <CardContent>
          <AddCommentForm />
        </CardContent>
      </Card>
    </Layout>
  );
}
