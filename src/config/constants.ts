export const APP_NAME = 'EXECUTIVOS'
export const APP_DESCRIPTION = 'Gerador de Prompts Profissionais com IA'

export const OPENROUTER_CONFIG = {
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  primaryModel: import.meta.env.VITE_AI_MODEL_PRIMARY || 'anthropic/claude-3.5-sonnet',
  fallbackModel: import.meta.env.VITE_AI_MODEL_FALLBACK || 'openai/gpt-4o-mini',
}

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
}

export const PROMPT_CATEGORIES = {
  produtividade: { label: 'Produtividade', icon: 'Zap', color: '#F5C518' },
  comunicacao: { label: 'Comunicacao', icon: 'MessageSquare', color: '#FFD84D' },
  analise_dados: { label: 'Analise de Dados', icon: 'BarChart3', color: '#D4A800' },
  automacao: { label: 'Automacao', icon: 'Settings', color: '#FFCC00' },
  tomada_decisao: { label: 'Tomada de Decisao', icon: 'Scale', color: '#E5B800' },
} as const

export const QUIZ_CONFIG = {
  minQuestions: 5,
  maxQuestions: 29,
  totalSlides: 29,
}
