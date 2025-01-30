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
import { fetchTasks, Task, updateTask } from "@/lib/tasks";
import { supabase } from "@/utils/supabase/client";
import { EditTaskPopup } from "./edit-task-popup";
import { Button } from "@/components/ui/button"; // ✅ ボタンを追加

export function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false); // ✅ 完了タスクの表示/非表示切り替え

  useEffect(() => {
    const loadUserAndTasks = async () => {
      try {
        console.log("ユーザー情報を取得中...");

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

      await updateTask(updatedTask);
    } catch (error) {
      console.error("タスクの更新に失敗しました:", error);
    }
  };

  if (!userId) return <p>ログインしてください</p>;
  if (tasks.length === 0) return <p>タスクがありません</p>;

  // ✅ タスクを未完了と完了で分類
  const incompleteTasks = tasks.filter((task) => task.status !== "完了");
  const completedTasks = tasks.filter((task) => task.status === "完了");

  return (
    <>
    {/* 🔹 未完了のタスク */}
<h2 className="text-lg font-bold mb-2">未完了のタスク</h2>
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-1/3">タスク名</TableHead>
      <TableHead className="w-1/3">締切日</TableHead>
      <TableHead className="w-1/3">ステータス</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {incompleteTasks.map((task) => (
      <TableRow
        key={task.id}
        className="cursor-pointer hover:bg-gray-100"
        onClick={() => setSelectedTask(task)}
      >
        <TableCell className="w-1/3 font-medium">{task.name}</TableCell>
        <TableCell className="w-1/3">{task.deadline}</TableCell>
        <TableCell className="w-1/3">
          <Badge
            variant={task.status === "進行中" ? "default" : "destructive"}
            className={
              task.status === "進行中"
                ? "bg-yellow-500 text-white"
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

{/* 🔹 完了したタスク（折りたたみ） */}
<div className="mt-6">
  <Button onClick={() => setShowCompleted(!showCompleted)} variant="outline">
    {showCompleted ? "完了したタスクを隠す" : "完了したタスクを表示"}
  </Button>
</div>

{showCompleted && (
  <>
    <h2 className="text-lg font-bold mt-4">完了したタスク</h2>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">タスク名</TableHead>
          <TableHead className="w-1/3">締切日</TableHead>
          <TableHead className="w-1/3">ステータス</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completedTasks.map((task) => (
          <TableRow
            key={task.id}
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedTask(task)}
          >
            <TableCell className="w-1/3 font-medium">{task.name}</TableCell>
            <TableCell className="w-1/3">{task.deadline}</TableCell>
            <TableCell className="w-1/3">
              <Badge className="bg-green-500 text-white">完了</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
)}

      {selectedTask && (
        <EditTaskPopup
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleTaskUpdate}
        />
      )}
    </>
  );
}
