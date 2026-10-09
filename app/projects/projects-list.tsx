"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Project {
  id: string
  name: string
  path: string
  gitRepo: string
  branch: string
  framework: string
  port?: number
  domain?: string
  pm2Process?: string
}

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Project>>({
    name: "",
    path: "",
    gitRepo: "",
    branch: "main",
    framework: "Next.js",
    port: undefined,
    domain: "",
    pm2Process: "",
  })

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/projects")
      const data = await res.json()
      setProjects(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          port: form.port ? Number(form.port) : null,
        }),
      })
      setForm({
        name: "",
        path: "",
        gitRepo: "",
        branch: "main",
        framework: "Next.js",
        port: undefined,
        domain: "",
        pm2Process: "",
      })
      fetchProjects()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" })
      fetchProjects()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Add Project</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Path (e.g. /var/www/projects/your-app)"
            value={form.path || ""}
            onChange={(e) => setForm({ ...form, path: e.target.value })}
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Git Repository URL"
            value={form.gitRepo || ""}
            onChange={(e) => setForm({ ...form, gitRepo: e.target.value })}
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Branch"
            value={form.branch || "main"}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
          />
          <select
            value={form.framework || "Next.js"}
            onChange={(e) => setForm({ ...form, framework: e.target.value })}
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
          >
            <option value="Next.js">Next.js</option>
            <option value="Node.js">Node.js</option>
            <option value="Go">Go</option>
            <option value="Laravel">Laravel</option>
            <option value="Static">Static</option>
          </select>
          <input
            type="number"
            placeholder="Port"
            value={form.port || ""}
            onChange={(e) => setForm({ ...form, port: e.target.value ? parseInt(e.target.value) : undefined })}
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Domain"
            value={form.domain || ""}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="PM2 Process Name"
            value={form.pm2Process || ""}
            onChange={(e) => setForm({ ...form, pm2Process: e.target.value })}
            className="bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
          />
          <div className="md:col-span-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
              Add Project
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-sm text-gray-400">Name</th>
              <th className="text-left p-3 text-sm text-gray-400">Path</th>
              <th className="text-left p-3 text-sm text-gray-400">Framework</th>
              <th className="text-left p-3 text-sm text-gray-400">Branch</th>
              <th className="text-left p-3 text-sm text-gray-400">Port</th>
              <th className="text-left p-3 text-sm text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-800 hover:bg-gray-850">
                <td className="p-3 text-sm">{project.name}</td>
                <td className="p-3 text-sm text-gray-400">{project.path}</td>
                <td className="p-3 text-sm">{project.framework}</td>
                <td className="p-3 text-sm">{project.branch}</td>
                <td className="p-3 text-sm">{project.port || "-"}</td>
                <td className="p-3 text-sm space-x-2">
                  <Link href={`/deployments?project=${project.id}`} className="text-blue-400 hover:underline">
                    Deploy
                  </Link>
                  <button onClick={() => handleDelete(project.id)} className="text-red-400 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400 text-sm">
                  No projects yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
