"use client"

import { useEffect, useState } from "react"

interface Stats {
  cpu: string
  memory: string
  disk: string
  services: number
  projects: number
  lastDeployment: string | null
}

export function SystemStats() {
  const [stats, setStats] = useState<Stats>({
    cpu: "-",
    memory: "-",
    disk: "-",
    services: 0,
    projects: 0,
    lastDeployment: null,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/project-status")
        const data = await res.json()
        setStats((prev) => ({
          ...prev,
          projects: data.count || 0,
        }))
      } catch (e) {
        // ignore
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm text-gray-400">CPU Usage</h3>
        <p className="text-2xl font-semibold mt-2">{stats.cpu}</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm text-gray-400">RAM Usage</h3>
        <p className="text-2xl font-semibold mt-2">{stats.memory}</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm text-gray-400">Disk Usage</h3>
        <p className="text-2xl font-semibold mt-2">{stats.disk}</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm text-gray-400">Services</h3>
        <p className="text-2xl font-semibold mt-2">{stats.services}</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm text-gray-400">Projects</h3>
        <p className="text-2xl font-semibold mt-2">{stats.projects}</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm text-gray-400">Last Deployment</h3>
        <p className="text-lg mt-2">{stats.lastDeployment || "-"}</p>
      </div>
    </div>
  )
}
