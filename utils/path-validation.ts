import path from "path"

const ALLOWED_ROOT = process.env.ALLOWED_ROOT || "/var/www/projects"

export function validateProjectPath(projectPath: string): { valid: boolean; error?: string } {
  if (!projectPath) {
    return { valid: false, error: "Path is required" }
  }

  const resolvedPath = path.resolve(projectPath)
  const resolvedRoot = path.resolve(ALLOWED_ROOT)

  if (!resolvedPath.startsWith(resolvedRoot + path.sep) && resolvedPath !== resolvedRoot) {
    if (!resolvedPath.startsWith(resolvedRoot)) {
      return {
        valid: false,
        error: `Path must be within ${ALLOWED_ROOT}`,
      }
    }
  }

  if (projectPath.includes("..")) {
    return {
      valid: false,
      error: "Path traversal not allowed",
    }
  }

  return { valid: true }
}

export function isWithinAllowedPath(filePath: string): boolean {
  const resolvedPath = path.resolve(filePath)
  const resolvedRoot = path.resolve(ALLOWED_ROOT)
  return resolvedPath.startsWith(resolvedRoot)
}
