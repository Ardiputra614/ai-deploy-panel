export interface NginxConfig {
  domain: string
  port: number
  root?: string
  ssl?: boolean
}

export class NginxService {
  generateConfig(config: NginxConfig): string {
    const { domain, port, root, ssl } = config

    const configTemplate = `# Nginx configuration preview (not applied)
server {
    listen 80;
    server_name ${domain};

    location / {
        proxy_pass http://127.0.0.1:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
${root ? `    root ${root};` : ""}
}
`

    return configTemplate
  }

  previewConfig(config: NginxConfig): string {
    return this.generateConfig(config)
  }
}
