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
import { fetchTasks, Task } from "@/lib/tasks";
import { EditTaskPopup } from "./edit-task-popup";
import { supabase } from "@/utils/supabase/client"; // ✅ Supabase クライアントをインポート

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

    // ✅ Supabase のリアルタイムリスナーを設定
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
            setTasks((prev) => prev.filter((task) => task.id !== payload.old.id)); // ✅ 削除されたタスクをリストから除外
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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
          onSave={(updatedTask) => {
            const index = tasks.findIndex((t) => t.id === updatedTask.id);
            if (index !== -1) {
              const updatedTasks = [...tasks];
              updatedTasks[index] = updatedTask;
              setTasks(updatedTasks);
            }
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
}
