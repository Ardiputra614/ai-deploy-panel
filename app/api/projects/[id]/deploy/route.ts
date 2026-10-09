import { NextRequest, NextResponse } from "next/server"
import { deployProject } from "@/services/deploy/deployer"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deployment = await deployProject({ projectId: params.id })
    return NextResponse.json(deployment)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
