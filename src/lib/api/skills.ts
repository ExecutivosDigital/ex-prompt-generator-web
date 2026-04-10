import { api } from './client';
import type { UserSkill } from '../../types/skill';

export async function generateSkills(quizResponseId: string) {
  return api.post<UserSkill>('/skills/generate', { quizResponseId });
}

export async function getSkills() {
  return api.get<UserSkill[]>('/skills');
}

export async function getLatestSkill() {
  return api.get<UserSkill>('/skills/latest');
}
