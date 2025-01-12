"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TaskList } from "@/components/task-list";
import { ProgressTimeline } from "@/components/progress-timeline";
import { CommentList } from "@/components/comment-list";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // 初期設定
    handleResize();

    // リサイズイベントを監視
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        {(sidebarOpen || isLargeScreen) && <Sidebar />}
        <main className="flex-1 p-8 pt-24 lg:ml-64">
          <div className="grid gap-8 md:grid-cols-2">
            <TaskList />
            <ProgressTimeline />
          </div>
          <div className="mt-8">
            <CommentList />
          </div>
        </main>
      </div>
    </div>
  );
}
