"use client"

import { useState } from "react"

export function AIChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage = { role: "user", content: input }
    setMessages([...messages, newMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/hermes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || data.error || "No response" }])
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error sending message" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === "user" ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-400">Thinking...</p>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI agent..."
          className="flex-1 bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded text-sm">
          Send
        </button>
      </form>
    </div>
  )
}
