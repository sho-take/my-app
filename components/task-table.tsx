"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchTasks, Task, updateTask } from "@/lib/tasks"; // ✅ `updateTask` を追加
import { supabase } from "@/utils/supabase/client";
import { EditTaskPopup } from "./edit-task-popup";

export function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadUserAndTasks = async () => {
      try {
        console.log("ユーザー情報を取得中...");

        // ✅ API 経由でユーザー情報を取得
        const res = await fetch("/api/user");
        const user = await res.json();
        console.log("取得したユーザー:", user);

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

    // ✅ Supabase のリアルタイムリスナーを追加
    const subscription = supabase
      .channel("tasks-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          console.log("タスクの変更が検出されました:", payload);

          if (payload.eventType === "INSERT") {
            setTasks((prev) => [...prev, payload.new as Task]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((task) => (task.id === payload.new.id ? (payload.new as Task) : task))
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((task) => task.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // ✅ ステータス変更処理 (Supabase にも反映)
  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks(updatedTasks);

      await updateTask(updatedTask); // ✅ Supabase にも更新を適用
    } catch (error) {
      console.error("タスクの更新に失敗しました:", error);
    }
  };

  if (!userId) return <p>ログインしてください</p>;
  if (tasks.length === 0) return <p>Loading tasks...</p>;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タスク名</TableHead>
            <TableHead>締切日</TableHead>
            <TableHead>ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedTask(task)}
            >
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell>
                <Badge
                  variant={task.status === "進行中" ? "default" : task.status === "完了" ? "secondary" : "destructive"}
                  className={
                    task.status === "進行中"
                      ? "bg-yellow-500 text-white"
                      : task.status === "完了"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }
                >
                  {task.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {selectedTask && (
        <EditTaskPopup
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleTaskUpdate} // ✅ 編集時に Supabase に即時反映
        />
      )}
    </>
  );
}
