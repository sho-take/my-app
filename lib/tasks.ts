import { supabase } from "@/utils/supabase/client";

export type Task = {
  id: string;
  name: string;
  deadline: string;
  status: "未着手" | "進行中" | "完了";
  user_id: string; // ユーザーIDを追加
};

// 🟢 ログインユーザーのタスクだけ取得する
export async function fetchTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId); // 🔥 ユーザーIDが一致するものだけ取得

  if (error) {
    console.error("タスクの取得に失敗しました:", error.message);
    return [];
  }

  return data || [];
}

// 🟢 タスクを追加するときに `user_id` をセットする
export async function addTask(task: Omit<Task, "id">, userId: string): Promise<void> {
  const newTask = { ...task, user_id: userId }; // 🔥 user_id を追加
  const { error } = await supabase.from("tasks").insert([newTask]);
  if (error) {
    console.error("タスクの追加に失敗しました:", error.message);
  }
}


// 🟢 タスクを更新（基本変更なし）
export async function updateTask(updatedTask: Task): Promise<void> {
  const { error } = await supabase.from("tasks").update(updatedTask).eq("id", updatedTask.id);
  if (error) {
    console.error("タスクの更新に失敗しました:", error.message);
  }
}

// 🟢 タスクを削除（基本変更なし）
export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) {
    console.error("タスクの削除に失敗しました:", error.message);
  }
}
