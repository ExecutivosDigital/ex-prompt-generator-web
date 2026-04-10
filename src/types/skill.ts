export interface CompetencyIndicator {
  name: string
  score: number
}

export interface UserSkill {
  id: string
  user_id: string
  skill_name: string
  skill_description: string
  competency_indicators: CompetencyIndicator[]
  strengths: string[]
  growth_areas: string[]
  recommended_focus: string[]
  ai_model: string
  raw_response: unknown
  quiz_response_id: string | null
  created_at: string
}
