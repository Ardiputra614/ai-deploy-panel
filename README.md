# AI Deploy Panel

Personal admin panel for managing project deployments on VPS. Built with Next.js, TypeScript, Prisma, SQLite, Tailwind CSS, and PM2.

## Features

- Dashboard with system stats, projects count, and deployment history
- Project CRUD with framework support (Next.js, Node.js, Go, Laravel, Static)
- Deployment system with whitelisted commands, timeout, and logging
- Deployment history tracking
- AI Agent chat abstraction for Hermes API
- Nginx config preview (no direct modifications in v1)
- SSL/Certbot abstraction (no direct execution without confirmation)
- Security-first design with path validation

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `DATABASE_URL` - SQLite database path (default: file:./dev.db)
- `HERMES_API_URL` - Hermes API endpoint (optional)
- `HERMES_API_KEY` - Hermes API key (optional, never hardcoded)
- `HERMES_MODEL` - Model name (optional)
- `PANEL_BASE_PATH` - Base path for panel
- `ALLOWED_ROOT` - Allowed project root (default: /var/www/projects)

## Database

```bash
# Create migration
npx prisma migrate dev --name <migration-name>

# Reset database
npx prisma migrate reset

# Prisma Studio
npx prisma studio
```

## Build & Start

```bash
# Build
npm run build

# Start production server
npm start
```

## PM2 (Production)

```bash
pm2 start npm --name ai-deploy-panel -- start -- -p 3001
pm2 save
pm2 status
```

## Adding a Project

1. Go to Projects page
2. Fill in required fields: Name, Path, Git Repository, Framework
3. Path must be within `/var/www/projects`
4. For PM2, provide process name if using PM2
5. Click Add Project

## Security

- Only whitelisted deployment commands
- Project paths validated against ALLOWED_ROOT (no path traversal)
- No arbitrary shell commands from browser
- No direct system service modifications (Nginx, firewall, SSL, DNS)
- No root shell access through browser
- No `.env` files displayed by default
- Secrets/API keys not exposed
- Operations requiring confirmation for dangerous actions
- Timeouts and error handling for all deployments
- Projects cannot be outside allowed paths
- No `rm -rf` or destructive commands

## Development Notes

- Deployment logs saved to `logs/` directory
- Next.js/Node.js deployments supported with PM2 integration
- Go, Laravel, Static marked as extensible (not fully implemented)
