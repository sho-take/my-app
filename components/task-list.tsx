"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTasks, Task } from "@/lib/tasks"; // ✅ タスク取得APIを利用

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
  }, []);

  if (!userId) return <p>ログインしてください</p>;
  if (tasks.length === 0) return <p>タスクがありません</p>;

  // 🔥 「完了」以外のタスクを取得（フロントエンドでフィルタリング）
  const upcomingTasks = tasks.filter(task => task.status !== "完了").slice(0, 3);

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
