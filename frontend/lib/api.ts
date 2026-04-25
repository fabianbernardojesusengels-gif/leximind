import Cookies from 'js-cookie'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = Cookies.get('leximind_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Network error' }))
    throw new Error(err.detail || 'API error')
  }
  return res.json()
}

export const api = {
  // Auth
  register: (data: { username: string; password: string; email?: string }) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { username: string; password: string }) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  me: () => apiFetch('/auth/me'),

  // Words
  getDailyWords: (limit = 5) => apiFetch(`/words/daily?limit=${limit}`),
  getWord: (slug: string) => apiFetch(`/words/${slug}`),
  listWords: (params?: { category?: string; difficulty?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString()
    return apiFetch(`/words?${q}`)
  },
  getAllSlugs: () => apiFetch('/words/slugs'),

  // Progress
  updateProgress: (word_id: number, status: 'known' | 'learning' | 'unknown') =>
    apiFetch('/progress/update', { method: 'POST', body: JSON.stringify({ word_id, status }) }),
  getStats: () => apiFetch('/progress/stats'),

  // AI
  explainWord: (word: string, context?: string, level?: string) =>
    apiFetch('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ word, context, level }),
    }),
}

export function saveToken(token: string) {
  Cookies.set('leximind_token', token, { expires: 7 })
}

export function clearToken() {
  Cookies.remove('leximind_token')
}

export function getToken() {
  return Cookies.get('leximind_token')
}
