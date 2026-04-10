import { api, getToken } from './client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface ChatConversation {
  id: string;
  title: string;
  messageCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export async function createConversation(title?: string) {
  return api.post<ChatConversation>('/chat/conversations', { title });
}

export async function listConversations() {
  return api.get<ChatConversation[]>('/chat/conversations');
}

export async function deleteConversation(id: string) {
  return api.delete<{ deleted: boolean }>(`/chat/conversations/${id}`);
}

export async function getMessages(conversationId: string) {
  return api.get<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`);
}

export async function* streamMessage(
  conversationId: string,
  content: string,
): AsyncGenerator<string> {
  const token = getToken();

  const res = await fetch(
    `${API_URL}/chat/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content }),
    },
  );

  if (!res.ok) {
    throw new Error(`Erro ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        if (parsed.content) yield parsed.content;
        if (parsed.error) throw new Error(parsed.error);
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }
}
