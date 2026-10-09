export interface CertbotOptions {
  domain: string
  email?: string
}

export class CertbotService {
  async generateCertbotCommand(options: CertbotOptions): Promise<string> {
    const { domain, email } = options
    return `certbot --nginx -d ${domain}${email ? ` -m ${email}` : " --register-unsafely-without-email"} --agree-tos`
  }

  previewCommand(options: CertbotOptions): string {
    return `# Certbot command (not executed)
${this.generateCertbotCommand(options)}
# Execution requires explicit confirmation`
  }
}
