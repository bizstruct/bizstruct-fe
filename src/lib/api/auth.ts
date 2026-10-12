import { request, type ApiResult } from "./http"

export const login = (email: string, password: string): Promise<ApiResult<{ ok: true }>> =>
  request("/api/auth/login", { method: "POST", json: { email, password } })

export const register = (email: string, password: string, fullName?: string): Promise<ApiResult<{ ok: true }>> =>
  request("/api/auth/register", { method: "POST", json: { email, password, fullName } })

export const logout = (): Promise<ApiResult<{ ok: true }>> => request("/api/auth/logout", { method: "POST" })
