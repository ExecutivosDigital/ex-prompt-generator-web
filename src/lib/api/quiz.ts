import { api } from './client';

interface QuizResponse {
  id: string;
  userId: string;
  responses: Record<string, unknown>;
  painPoints: string[];
  timeSpentSeconds: number | null;
  createdAt: string;
}

export async function submitQuiz(
  responses: Record<string, unknown>,
  painPoints: string[],
  timeSpentSeconds?: number,
) {
  return api.post<QuizResponse>('/quiz/responses', {
    responses,
    painPoints,
    timeSpentSeconds,
  });
}

export async function getQuizResponses() {
  return api.get<QuizResponse[]>('/quiz/responses');
}

export async function getQuizResponseById(id: string) {
  return api.get<QuizResponse>(`/quiz/responses/${id}`);
}
