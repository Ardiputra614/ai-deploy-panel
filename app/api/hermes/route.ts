import { NextRequest, NextResponse } from "next/server"
import { HermesService } from "@/services/hermes/hermes.service"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }
    const hermes = new HermesService()
    const result = await hermes.chat(message)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
