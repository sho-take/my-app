"use client";

import { useState, useEffect } from "react";
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

export function TaskTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    loadTasks();
  }, []);

  if (tasks.length === 0) {
    return <p>Loading tasks...</p>;
  }

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
