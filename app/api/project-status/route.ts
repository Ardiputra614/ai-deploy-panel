import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const count = await prisma.project.count()
    const last = await prisma.deployment.findFirst({
      orderBy: { startedAt: "desc" },
      include: { project: true },
    })
    return NextResponse.json({
      count,
      lastDeployment: last ? `${last.project.name} - ${last.status} (${new Date(last.startedAt).toLocaleString()})` : null,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
