"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTasks, Task } from "@/lib/tasks";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    loadTasks();
  }, []);

  // 今後のタスクを取得（最初の3件）
  const upcomingTasks = tasks.slice(0, 3);

  if (tasks.length === 0) {
    return <p>タスクを読み込み中...</p>;
  }

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
