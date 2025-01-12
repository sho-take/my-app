import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const tasks = [
  { name: "文献調査", progress: 60 },
  { name: "データ分析", progress: 30 },
  { name: "レポート作成", progress: 0 },
  { name: "プレゼンテーション準備", progress: 10 },
]

export default function ProgressPage() {
  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>進捗状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{task.name}</span>
                  <span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}

