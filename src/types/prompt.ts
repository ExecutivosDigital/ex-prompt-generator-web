export type PromptCategory = string

export interface PromptVariation {
  context: string
  prompt: string
}

export interface GeneratedPrompt {
  id: string
  user_id: string
  quiz_response_id: string | null
  category: PromptCategory
  prompt_index: number
  situation: string
  prompt_text: string
  variations: PromptVariation[]
  golden_tip: string | null
  estimated_time_saved: string | null
  ai_model: string
  generation_batch_id: string | null
  created_at: string
}

export interface PromptCategoryInfo {
  key: PromptCategory
  label: string
  icon: string
  color: string
  description: string
}
