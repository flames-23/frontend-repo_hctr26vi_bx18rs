export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export const authHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json', ...authHeader() } })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPost(path, body, isForm=false) {
  const headers = isForm ? { ...authHeader() } : { 'Content-Type': 'application/json', ...authHeader() }
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: isForm ? body : JSON.stringify(body) })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
