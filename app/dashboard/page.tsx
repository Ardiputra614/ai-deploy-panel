import { SystemStats } from "./stats"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <SystemStats />
    </div>
  )
}
