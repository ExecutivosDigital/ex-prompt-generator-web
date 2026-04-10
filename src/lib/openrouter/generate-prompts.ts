import { chatCompletion } from './client'
import { buildPromptsSystemPrompt, buildUserPromptForPrompts } from './system-prompts'
import type { QuizResponses, PromptCategory } from '@/types'

interface GeneratedPromptRaw {
  category: PromptCategory
  situation: string
  prompt_text: string
  variations: { context: string; prompt: string }[]
  golden_tip: string
  estimated_time_saved: string
}

interface PromptsResult {
  business_context: string
  prompts: GeneratedPromptRaw[]
}

export async function generatePrompts(
  quizAnswers: QuizResponses,
  skillName: string
): Promise<PromptsResult> {
  const response = await chatCompletion([
    { role: 'system', content: buildPromptsSystemPrompt() },
    { role: 'user', content: buildUserPromptForPrompts(quizAnswers, skillName) },
  ], { temperature: 0.7, max_tokens: 16000 })

  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse prompts response')

  const parsed = JSON.parse(jsonMatch[0]) as PromptsResult

  if (!parsed.prompts || !Array.isArray(parsed.prompts) || parsed.prompts.length === 0) {
    throw new Error('Invalid prompts response structure')
  }

  const validCategories: PromptCategory[] = ['produtividade', 'comunicacao', 'analise_dados', 'automacao', 'tomada_decisao']

  parsed.prompts = parsed.prompts.filter(p =>
    validCategories.includes(p.category) && p.situation && p.prompt_text
  )

  return {
    business_context: parsed.business_context || '',
    prompts: parsed.prompts,
  }
}
