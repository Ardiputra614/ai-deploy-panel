import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateProjectPath } from "@/utils/path-validation"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(projects)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, path, gitRepo, branch, framework, port, domain, pm2Process } = body

    if (!name || !path || !gitRepo || !framework) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const pathValidation = validateProjectPath(path)
    if (!pathValidation.valid) {
      return NextResponse.json({ error: pathValidation.error }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        path,
        gitRepo,
        branch: branch || "main",
        framework,
        port: port || null,
        domain: domain || null,
        pm2Process: pm2Process || null,
      },
    })
    return NextResponse.json(project)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
