"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTasks, Task } from "@/lib/tasks";
import { supabase } from "@/utils/supabase/client"; // ✅ Supabase クライアントをインポート

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserAndTasks = async () => {
      try {
        console.log("ユーザー情報を取得中...");

        // ✅ API 経由でユーザー情報を取得
        const res = await fetch("/api/user");
        const user = await res.json();
        console.log("取得したユーザー:", JSON.stringify(user, null, 2));

        if (user?.id) {
          setUserId(user.id);
          const userTasks = await fetchTasks(user.id);
          setTasks(userTasks);
        }
      } catch (error) {
        console.error("タスクロードエラー:", error);
      }
    };

    loadUserAndTasks();

    // ✅ Supabase リアルタイムリスナーを追加
    const subscription = supabase
      .channel("tasks-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          console.log("タスクの変更が検出されました:", payload);

          if (payload.eventType === "INSERT") {
            setTasks((prev) => [...prev, payload.new as Task]); // ✅ 新しいタスクを追加
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((task) => (task.id === payload.new.id ? (payload.new as Task) : task))
            ); // ✅ 既存のタスクを更新
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((task) => task.id !== payload.old.id)); // ✅ 削除されたタスクを除外
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (!userId) return <p>ユーザー情報を取得中</p>;
  if (tasks.length === 0) return <p>タスクがありません</p>;

  // 今後のタスクを取得（最初の3件）
  const upcomingTasks = tasks.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>今後のタスク</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {upcomingTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <h3 className="font-bold">{task.name}</h3>
                  <p className="text-sm text-gray-500">締切: {task.deadline}</p>
                </div>
                <Badge
                  variant="default"
                  className={
                    task.status === "進行中"
                      ? "bg-yellow-500 text-white"
                      : task.status === "未着手"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }
                >
                  {task.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
