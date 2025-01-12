import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle, AlertCircle } from 'lucide-react'

const notifications = [
  {
    id: 1,
    title: "新しいタスクが割り当てられました",
    description: "「プレゼンテーション準備」が新しく追加されました。",
    timestamp: "2024-05-04 11:30",
    type: "info"
  },
  {
    id: 2,
    title: "締切が近づいています",
    description: "「文献調査」の締切まであと3日です。",
    timestamp: "2024-05-05 09:00",
    type: "warning"
  },
  {
    id: 3,
    title: "コメントが追加されました",
    description: "教授Aがあなたのレポートにコメントを追加しました。",
    timestamp: "2024-05-06 14:15",
    type: "info"
  },
]

export default function NotificationsPage() {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>通知一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                {notification.type === "info" ? (
                  <Bell className="h-5 w-5 text-blue-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <span className="text-sm text-gray-500">{notification.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}

