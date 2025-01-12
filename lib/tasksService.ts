import { supabase } from "./supabaseClient";

export type Task = {
  id: string;
  name: string;
  deadline: string;
  status: "未着手" | "進行中" | "完了";
};

// タスクを取得
export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from("tasks").select("*");
  if (error) {
    console.error("タスクの取得に失敗しました:", error.message);
    return [];
  }
  return data || [];
}

// タスクを追加
export async function addTask(task: Omit<Task, "id">): Promise<void> {
  const { error } = await supabase.from("tasks").insert([task]);
  if (error) {
    console.error("タスクの追加に失敗しました:", error.message);
  }
}

// タスクを更新
export async function updateTask(updatedTask: Task): Promise<void> {
  const { error } = await supabase.from("tasks").update(updatedTask).eq("id", updatedTask.id);
  if (error) {
    console.error("タスクの更新に失敗しました:", error.message);
  }
}

// タスクを削除
export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) {
    console.error("タスクの削除に失敗しました:", error.message);
  }
}
