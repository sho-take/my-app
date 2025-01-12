"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { BarChart2, CheckSquare, Home, MessageSquare, Bell } from 'lucide-react'

const menuItems = [
  { name: "ダッシュボード", icon: Home, href: "/" },
  { name: "タスク", icon: CheckSquare, href: "/tasks" },
  { name: "進捗", icon: BarChart2, href: "/progress" },
  { name: "コメント", icon: MessageSquare, href: "/comments" },
  { name: "通知", icon: Bell, href: "/notifications" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-800 text-white w-64 h-screen fixed left-0 top-0 pt-16">
      <ul className="space-y-2 p-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={`flex items-center space-x-4 p-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

