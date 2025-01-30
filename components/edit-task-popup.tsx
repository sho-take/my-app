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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Task, deleteTask } from "@/lib/tasks"; //`deleteTask` をインポート

interface EditTaskPopupProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export function EditTaskPopup({ task, isOpen, onClose, onSave }: EditTaskPopupProps) {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  //削除処理
  const handleDelete = async () => {
    if (confirm("このタスクを削除しますか？")) {
      await deleteTask(task.id); // Supabase から削除
      onClose(); // モーダルを閉じる
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タスクを編集</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskName">タスク名</Label>
            <Input
              id="taskName"
              value={editedTask.name}
              onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="deadline">締切日</Label>
            <Input
              id="deadline"
              type="date"
              value={editedTask.deadline}
              onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="status">ステータス</Label>
            <Select
              value={editedTask.status}
              onValueChange={(value) => setEditedTask({ ...editedTask, status: value as Task["status"] })}
            >
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
        </div>
        <DialogFooter className="flex justify-between">
          {/* 🆕 削除ボタン（左側） */}
          <Button variant="destructive" onClick={handleDelete}>
            削除
          </Button>
          {/* 「キャンセル」「保存」ボタン（右側） */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
