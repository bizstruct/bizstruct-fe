"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login, register } from "@/lib/api/auth"
import type { ApiResult } from "@/lib/api/http"
import { Link, useRouter } from "@/i18n/routing"

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const t = useTranslations("Auth")
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const isRegister = mode === "register"

  function messageFor(result: Extract<ApiResult<unknown>, { ok: false }>): string {
    if (result.kind === "unauthorized") return t("errors.invalid")
    if (result.kind === "conflict") return t("errors.exists")
    if (result.kind === "validation") return t("errors.validation")
    if (result.kind === "network") return t("errors.unreachable")
    return t("errors.generic")
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const result = isRegister ? await register(email.trim(), password, fullName.trim() || undefined) : await login(email.trim(), password)
    setBusy(false)
    if (result.ok) return router.replace("/")
    setError(messageFor(result))
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{isRegister ? t("registerTitle") : t("loginTitle")}</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-800">{t("email")}</label>
          <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {isRegister ? (
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-medium text-slate-800">{t("fullName")}</label>
            <Input id="fullName" name="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
        ) : null}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-800">{t("password")}</label>
          <Input id="password" name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} />
          {isRegister ? <p className="text-xs text-slate-500">{t("passwordHint")}</p> : null}
        </div>
        {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{isRegister ? t("signUp") : t("signIn")}</Button>
      </form>
      <p className="text-sm text-slate-500">
        {isRegister ? t("haveAccount") : t("noAccount")}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-medium text-indigo-700 hover:underline">{isRegister ? t("signIn") : t("signUp")}</Link>
      </p>
    </div>
  )
}
