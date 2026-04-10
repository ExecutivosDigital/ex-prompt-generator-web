import { api } from './client';
import type { GeneratedPrompt } from '../../types/prompt';

interface GenerateResult {
  totalPrompts: number;
  batchId: string;
  prompts: GeneratedPrompt[];
}

interface CategorySummary {
  category: string;
  count: number;
}

export async function generatePrompts(quizResponseId: string) {
  return api.post<GenerateResult>('/prompts/generate', { quizResponseId });
}

export async function getPrompts(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return api.get<GeneratedPrompt[]>(`/prompts${query}`);
}

export async function getPromptById(id: string) {
  return api.get<GeneratedPrompt>(`/prompts/${id}`);
}

export async function getCategorySummary() {
  return api.get<CategorySummary[]>('/prompts/categories/summary');
}

export async function createCustomPrompt(request: string) {
  return api.post<GeneratedPrompt>('/prompts/custom', { request });
}
