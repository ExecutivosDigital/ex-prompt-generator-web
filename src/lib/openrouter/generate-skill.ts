import { chatCompletion } from './client'
import { buildSkillSystemPrompt, buildUserPromptForSkill } from './system-prompts'
import type { QuizResponses } from '@/types'

interface SkillResult {
  skill_name: string
  skill_description: string
  strengths: string[]
  growth_areas: string[]
  recommended_focus: string[]
}

export async function generateSkill(quizAnswers: QuizResponses): Promise<SkillResult> {
  const response = await chatCompletion([
    { role: 'system', content: buildSkillSystemPrompt() },
    { role: 'user', content: buildUserPromptForSkill(quizAnswers) },
  ], { temperature: 0.7, max_tokens: 1024 })

  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Failed to parse skill response')

  const parsed = JSON.parse(jsonMatch[0]) as SkillResult

  if (!parsed.skill_name || !parsed.skill_description) {
    throw new Error('Invalid skill response structure')
  }

  return {
    skill_name: parsed.skill_name,
    skill_description: parsed.skill_description,
    strengths: parsed.strengths || [],
    growth_areas: parsed.growth_areas || [],
    recommended_focus: parsed.recommended_focus || [],
  }
}
