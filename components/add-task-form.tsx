"use client";

import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Omit<Task, "id"> = {
      name: taskName,
      deadline,
      status: status as "未着手" | "進行中" | "完了",
    };

    await addTask(newTask);
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
      <Button type="submit">タスクを追加</Button>
    </form>
  );
}
