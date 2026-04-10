import { OPENROUTER_CONFIG } from '@/config/constants'

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenRouterOptions {
  model?: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export async function chatCompletion(
  messages: OpenRouterMessage[],
  options: OpenRouterOptions = {}
): Promise<string> {
  const model = options.model || OPENROUTER_CONFIG.primaryModel

  const response = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'EXECUTIVOS',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 4096,
      stream: false,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

export async function* streamChatCompletion(
  messages: OpenRouterMessage[],
  options: OpenRouterOptions = {}
): AsyncGenerator<string> {
  const model = options.model || OPENROUTER_CONFIG.primaryModel

  const response = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'EXECUTIVOS',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 4096,
      stream: true,
    }),
  })

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

    for (const line of lines) {
      const json = line.replace('data: ', '')
      if (json === '[DONE]') return
      try {
        const parsed = JSON.parse(json)
        const delta = parsed.choices?.[0]?.delta?.content || ''
        if (delta) yield delta
      } catch { /* skip malformed chunks */ }
    }
  }
}
