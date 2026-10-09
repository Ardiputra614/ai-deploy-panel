"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Projects", href: "/projects" },
  { name: "Deployments", href: "/deployments" },
  { name: "Domains", href: "/domains" },
  { name: "Services", href: "/services" },
  { name: "AI Agent", href: "/ai-agent" },
  { name: "Settings", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-gray-800 bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">AI Deploy Panel</h1>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === item.href
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
