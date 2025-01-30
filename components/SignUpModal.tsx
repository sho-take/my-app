"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("登録処理中...");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`, // 認証後のリダイレクト先
        },
      });

      if (error) {
        setMessage(`登録に失敗しました: ${error.message}`);
      } else {
        setMessage("確認メールを送信しました。メールを確認してください！");
      }
    } catch (err) {
      console.error("登録エラー:", err);
      setMessage("エラーが発生しました。");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規登録</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4">
          <Input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p>{message}</p>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>キャンセル</Button>
            <Button type="submit">登録</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
