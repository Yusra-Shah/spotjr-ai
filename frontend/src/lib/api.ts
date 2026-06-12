// SpotJr API client — all fetch calls go through here
// Falls back gracefully if backend is unreachable

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('spotjr_token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RiskScore {
  score: number
  level: string
  reason: string
  factors: string[]
}

export interface DetectionEvent {
  case_id: string
  camera_id: string
  timestamp: string
  confidence: number
  zone: string
  bbox: number[]
}

export interface CaseCreate {
  child_description: string
  age_estimate: number
  clothing_upper: string
  clothing_lower: string
  last_seen_zone: string
  last_seen_time: string
  parent_contact: string
}

export interface CaseResponse {
  case_id: string
  status: string
  risk_score: RiskScore
  timeline: DetectionEvent[]
  prediction: Record<string, unknown>
  guard_dispatched: boolean
}

export type Case = CaseResponse & { created_at?: string }

// ── Cases ─────────────────────────────────────────────────────────────────────

export async function createCase(data: CaseCreate): Promise<CaseResponse> {
  const res = await fetch(`${BASE_URL}/api/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  const result = await handleResponse<CaseResponse>(res)
  console.log('[api] createCase →', result.case_id)
  return result
}

export async function getCases(): Promise<Case[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/cases`, {
      headers: { ...authHeaders() },
    })
    return handleResponse<Case[]>(res)
  } catch (err) {
    console.error('[api] getCases failed — using empty list:', err)
    return []
  }
}

export async function getCase(id: string): Promise<Case> {
  const res = await fetch(`${BASE_URL}/api/cases/${id}`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Case>(res)
}

export async function markCaseFound(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/cases/${id}/found`, {
    method: 'PUT',
    headers: { ...authHeaders() },
  })
  await handleResponse<unknown>(res)
  console.log('[api] markCaseFound →', id)
}

export async function dispatchGuard(
  caseId: string,
  guardId: string,
  zone: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/cases/${caseId}/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ guard_id: guardId, target_zone: zone }),
  })
  await handleResponse<unknown>(res)
  console.log('[api] dispatchGuard →', guardId, zone)
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(
  username: string,
  password: string,
): Promise<{ token: string; role: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await handleResponse<{ access_token: string; role: string }>(res)
  if (typeof window !== 'undefined') {
    localStorage.setItem('spotjr_token', data.access_token)
    localStorage.setItem('spotjr_role', data.role)
  }
  console.log('[api] login OK — role:', data.role)
  return { token: data.access_token, role: data.role }
}

// ── WebSocket ─────────────────────────────────────────────────────────────────

export function createCaseWebSocket(
  caseId: string,
  onEvent: (event: unknown) => void,
): WebSocket {
  const wsBase = BASE_URL.replace(/^https/, 'wss').replace(/^http/, 'ws')
  const ws = new WebSocket(`${wsBase}/ws/${caseId}`)
  ws.onmessage = (e) => {
    try {
      onEvent(JSON.parse(e.data))
    } catch (err) {
      console.error('[ws] parse error:', err)
    }
  }
  ws.onerror = (e) => console.error('[ws] error:', e)
  return ws
}
