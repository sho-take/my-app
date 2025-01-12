import { supabase } from "@/lib/supabaseClient";

export type Comment = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
};

// コメントを取得
export async function fetchComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("timestamp", { ascending: true });

  if (error) {
    console.error("コメントの取得に失敗しました:", error.message);
    return [];
  }
  return data || [];
}

// コメントを追加
export async function addComment(comment: Omit<Comment, "id">): Promise<void> {
  const { error } = await supabase.from("comments").insert([comment]);

  if (error) {
    console.error("コメントの追加に失敗しました:", error.message);
  }
}
