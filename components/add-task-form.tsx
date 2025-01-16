"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTask, Task } from "@/lib/tasks";

export function AddTaskForm({ onTaskAdded }: { onTaskAdded?: () => void }) {
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("未着手");
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); // ✅ ローディング状態を追加

  // 🔥 API経由で `user_id` を取得
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        console.log("取得したユーザー情報:", data);

        if (data?.id) {
          setUserId(data.id); // ✅ `data.id` を `userId` にセット
        } else {
          console.warn("⚠️ ユーザーIDが取得できませんでした", data);
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗:", error);
      } finally {
        setLoadingUser(false); // ✅ ローディング完了
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.error("⚠️ ユーザーIDが取得できていません");
      return;
    }

    const newTask: Omit<Task, "id"> & { user_id: string } = {
      name: taskName,
      deadline,
      status: status as "未着手" | "進行中" | "完了",
      user_id: userId, // ✅ ユーザーIDをセット
    };

    await addTask(newTask, userId);
    setTaskName("");
    setDeadline("");
    setStatus("未着手");

    if (onTaskAdded) {
      onTaskAdded(); // タスク追加後の処理
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="taskName">タスク名</Label>
        <Input
          id="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="deadline">締切日</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">ステータス</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="ステータスを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="未着手">未着手</SelectItem>
            <SelectItem value="進行中">進行中</SelectItem>
            <SelectItem value="完了">完了</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loadingUser || !userId}>
        {loadingUser ? "ユーザー情報を取得中..." : "タスクを追加"}
      </Button>
    </form>
  );
}
