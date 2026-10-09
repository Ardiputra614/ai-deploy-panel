import { DeploymentsList } from "./deployments-list"
import { Suspense } from "react"

export default function DeploymentsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Deployments</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <DeploymentsList />
      </Suspense>
    </div>
  )
}
