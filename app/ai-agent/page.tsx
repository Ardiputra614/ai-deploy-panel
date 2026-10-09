import { AIChat } from "./chat"

export default function AIAgentPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold">AI Agent</h2>
      <AIChat />
    </div>
  )
}
