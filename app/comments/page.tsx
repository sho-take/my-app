"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
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
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndComments = async () => {
      try {
        // 🔥 API からユーザー情報を取得
        const res = await fetch("/api/user");
        const user = await res.json();
        console.log("取得したユーザー:", user);

        if (user?.id) {
          setUserId(user.id);
          // 🔥 ユーザーIDが取得できたらコメントを取得
          const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("user_id", user.id) // 🔥 ユーザーIDに紐づくコメントだけ取得
            .order("timestamp", { ascending: true });

          if (error) {
            console.error("コメントの取得に失敗:", error.message);
          } else {
            setComments(data || []);
          }
        }
      } catch (error) {
        console.error("ユーザー情報取得エラー:", error);
      } finally {
        setLoading(false); // 🔥 ロード完了
      }
    };

    fetchUserAndComments();
  }, []);

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>コメント一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>ユーザー情報を取得中...</p>
          ) : !userId ? (
            <p>ログインしてください</p>
          ) : comments.length === 0 ? (
            <p>コメントがありません</p>
          ) : (
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
          )}
        </CardContent>
      </Card>
      {/* 🔥 コメント追加フォームはそのまま */}
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
