import { Layout } from "@/components/layout"
import { TaskTable } from "@/components/task-table"
import { AddTaskForm } from "@/components/add-task-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TasksPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>タス一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>新しいタスクを追加</CardTitle>
          </CardHeader>
          <CardContent>
            <AddTaskForm />
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

