"use client"

import { useState } from 'react'
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { TaskList } from "@/components/task-list"
import { ProgressTimeline } from "@/components/progress-timeline"
import { CommentList } from "@/components/comment-list"
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
        {(sidebarOpen || window.innerWidth >= 1024) && <Sidebar />}
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
  )
}

