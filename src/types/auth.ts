export interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  email: string | null
  avatar_url: string | null
  phone: string | null
  business_type: string | null
  business_niche: string | null
  revenue_range: string | null
  team_size: string | null
  ai_experience: string | null
  communication_tone: string | null
  work_routine: string | null
  tech_comfort: string | null
  data_frequency: string | null
  onboarding_completed: boolean
  quiz_completed: boolean
  prompts_generated: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}
