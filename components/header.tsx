import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 pl-72 flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-xl font-bold whitespace-nowrap">ゼミ進捗管理ツールへようこそ</h1>
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold">こんにちは、ユーザーさん</span>
        <Button variant="secondary" size="sm" className="bg-blue-700 text-white hover:bg-blue-800">
          <LogOut className="mr-2 h-4 w-4" /> ログアウト
        </Button>
      </div>
    </header>
  )
}

