export interface HermesMessage {
  message: string
}

export interface HermesResponse {
  response: string
}

export class HermesService {
  private apiUrl: string | undefined
  private apiKey: string | undefined
  private model: string | undefined

  constructor() {
    this.apiUrl = process.env.HERMES_API_URL
    this.apiKey = process.env.HERMES_API_KEY
    this.model = process.env.HERMES_MODEL
  }

  async chat(message: string): Promise<HermesResponse> {
    if (!this.apiUrl) {
      return {
        response: "Hermes API URL not configured. Please configure in Settings.",
      }
    }

    if (!this.apiKey) {
      return {
        response: "Hermes API key not configured. API key is not hardcoded - please set HERMES_API_KEY in environment.",
      }
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model || undefined,
          messages: [{ role: "user", content: message }],
        }),
      })

      if (!response.ok) {
        throw new Error(`Hermes API error: ${response.statusText}`)
      }

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || data.response || "No response"
      return { response: reply }
    } catch (error: any) {
      return {
        response: `Error connecting to Hermes: ${error.message}`,
      }
    }
  }
}
