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

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("コメントの取得に失敗しました:", error.message);
      } else if (data && Array.isArray(data)) {
        setComments(data as Comment[]);
      } else {
        console.error("コメントデータが無効です:", data);
      }
    };

    fetchComments();

    const subscription = supabase
      .channel("comments-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => [...prev, payload.new as Comment]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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
