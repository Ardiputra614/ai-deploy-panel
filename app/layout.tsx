import type { Metadata } from "next"
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"

export const metadata: Metadata = {
  title: "AI Deploy Panel",
  description: "Personal Admin Panel for VPS Deployment Management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
