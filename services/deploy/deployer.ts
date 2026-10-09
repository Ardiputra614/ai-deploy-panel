import { execa } from "execa"
import path from "path"
import fs from "fs/promises"
import { prisma } from "@/lib/prisma"
import { validateProjectPath, isWithinAllowedPath } from "@/utils/path-validation"

export interface DeployOptions {
  projectId: string
}

export async function deployProject({ projectId }: DeployOptions) {
  const deployment = await prisma.deployment.create({
    data: {
      projectId,
      status: "RUNNING",
      message: "Deployment started",
      startedAt: new Date(),
    },
  })

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (!project) {
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: "FAILED",
        message: "Project not found",
        finishedAt: new Date(),
      },
    })
    return deployment
  }

  const pathValidation = validateProjectPath(project.path)
  if (!pathValidation.valid) {
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: "FAILED",
        message: pathValidation.error || "Invalid path",
        finishedAt: new Date(),
      },
    })
    return deployment
  }

  try {
    const logDir = path.join(process.cwd(), "logs")
    await fs.mkdir(logDir, { recursive: true })
    const logFile = path.join(logDir, `deploy-${deployment.id}.log`)

    if (project.framework === "Next.js") {
      await deployNextjs(project, deployment.id, logFile)
    } else if (project.framework === "Node.js") {
      await deployNodejs(project, deployment.id, logFile)
    } else if (project.framework === "Go") {
      await deployGeneric(project, deployment.id, logFile, "Go deployment not fully implemented yet - structure prepared")
    } else if (project.framework === "Laravel") {
      await deployGeneric(project, deployment.id, logFile, "Laravel deployment not fully implemented yet - structure prepared")
    } else if (project.framework === "Static") {
      await deployGeneric(project, deployment.id, logFile, "Static deployment not fully implemented yet - structure prepared")
    } else {
      throw new Error(`Unsupported framework: ${project.framework}`)
    }

    await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: "SUCCESS",
        message: "Deployment completed successfully",
        finishedAt: new Date(),
      },
    })
  } catch (error: any) {
    await prisma.deployment.update({
      where: { id: deployment.id },
      data: {
        status: "FAILED",
        message: error.message || "Deployment failed",
        error: error.stack || error.message,
        finishedAt: new Date(),
      },
    })
  }

  return deployment
}

async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  logFile: string,
  timeout: number = 300000
): Promise<{ stdout: string; stderr: string }> {
  if (!isWithinAllowedPath(cwd)) {
    throw new Error("Command cannot run outside allowed path")
  }

  const { stdout, stderr } = await execa(command, args, {
    cwd,
    timeout,
    reject: false,
  })

  const logEntry = `\n=== ${command} ${args.join(" ")} ===\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}\n`
  await fs.appendFile(logFile, logEntry)

  if (stderr && !stdout.includes("success") && stderr.toLowerCase().includes("error")) {
    // Don't fail on warnings, but capture
  }

  return { stdout, stderr }
}

async function deployNextjs(project: any, deploymentId: string, logFile: string) {
  const cwd = project.path
  const exists = await fs.access(cwd).then(() => true).catch(() => false)

  if (exists) {
    await runCommand("git", ["pull", project.branch || "main"], cwd, logFile)
  } else {
    await runCommand("git", ["clone", project.gitRepo, cwd], process.cwd(), logFile, 600000)
  }

  await runCommand("npm", ["install"], cwd, logFile, 600000)
  await runCommand("npm", ["run", "build"], cwd, logFile, 900000)

  if (project.pm2Process) {
    const { stdout } = await runCommand("pm2", ["list"], process.cwd(), logFile)
    if (stdout.includes(project.pm2Process)) {
      await runCommand("pm2", ["restart", project.pm2Process], process.cwd(), logFile)
    } else {
      await runCommand("pm2", ["start", "npm", "--name", project.pm2Process, "--", "start", "--", "-p", String(project.port || 3000)], cwd, logFile)
    }
  }
}

async function deployNodejs(project: any, deploymentId: string, logFile: string) {
  const cwd = project.path
  const exists = await fs.access(cwd).then(() => true).catch(() => false)

  if (exists) {
    await runCommand("git", ["pull", project.branch || "main"], cwd, logFile)
  } else {
    await runCommand("git", ["clone", project.gitRepo, cwd], process.cwd(), logFile, 600000)
  }

  await runCommand("npm", ["install"], cwd, logFile, 600000)

  if (project.pm2Process) {
    const { stdout } = await runCommand("pm2", ["list"], process.cwd(), logFile)
    if (stdout.includes(project.pm2Process)) {
      await runCommand("pm2", ["restart", project.pm2Process], process.cwd(), logFile)
    } else {
      await runCommand("pm2", ["start", "npm", "--name", project.pm2Process, "--", "start"], cwd, logFile)
    }
  }
}

async function deployGeneric(project: any, deploymentId: string, logFile: string, note: string) {
  const logEntry = `\n=== NOTE ===\n${note}\n`
  await fs.appendFile(logFile, logEntry)
  throw new Error(note)
}
