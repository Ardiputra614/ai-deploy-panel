"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface Deployment {
  id: string
  status: string
  message: string | null
  error: string | null
  startedAt: string
  finishedAt: string | null
  project: {
    name: string
  }
}

export function DeploymentsList() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")

  const fetchDeployments = async () => {
    try {
      const res = await fetch("/api/deployments")
      const data = await res.json()
      setDeployments(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchDeployments()
    const interval = setInterval(fetchDeployments, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleDeploy = async () => {
    if (!projectId) return
    setLoading(true)
    try {
      await fetch(`/api/projects/${projectId}/deploy`, { method: "POST" })
      setTimeout(fetchDeployments, 1000)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    if (status === "SUCCESS") return "text-green-400"
    if (status === "FAILED") return "text-red-400"
    if (status === "RUNNING") return "text-yellow-400"
    return "text-gray-400"
  }

  return (
    <div className="space-y-6">
      {projectId && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <button
            onClick={handleDeploy}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded text-sm"
          >
            {loading ? "Deploying..." : "Deploy Project"}
          </button>
        </div>
      )}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-sm text-gray-400">Project</th>
              <th className="text-left p-3 text-sm text-gray-400">Status</th>
              <th className="text-left p-3 text-sm text-gray-400">Message</th>
              <th className="text-left p-3 text-sm text-gray-400">Started</th>
              <th className="text-left p-3 text-sm text-gray-400">Finished</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((deployment) => (
              <tr key={deployment.id} className="border-b border-gray-800 hover:bg-gray-850">
                <td className="p-3 text-sm">{deployment.project.name}</td>
                <td className={`p-3 text-sm font-medium ${getStatusColor(deployment.status)}`}>
                  {deployment.status}
                </td>
                <td className="p-3 text-sm text-gray-400">{deployment.message || "-"}</td>
                <td className="p-3 text-sm text-gray-400">
                  {new Date(deployment.startedAt).toLocaleString()}
                </td>
                <td className="p-3 text-sm text-gray-400">
                  {deployment.finishedAt ? new Date(deployment.finishedAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
            {deployments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400 text-sm">
                  No deployments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
