import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const deployments = await prisma.deployment.findMany({
      include: { project: true },
      orderBy: { startedAt: "desc" },
      take: 50,
    })
    return NextResponse.json(deployments)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
