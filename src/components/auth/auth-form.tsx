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

  const inputClass = "h-12 rounded-xl border-slate-200 bg-white px-4 text-[15px] shadow-lg shadow-black/5 focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-500/10"

  return (
    <div className="nocturne-grid flex min-h-full w-full items-center justify-center px-4 py-16">
      <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards flex w-full max-w-sm flex-col gap-6 duration-500">
        {/* The headline stays for screen readers and the tab title; the placeholders do the labelling visually. */}
        <h1 className="sr-only">{isRegister ? t("registerTitle") : t("loginTitle")}</h1>
        <form onSubmit={submit} className="space-y-3">
          <label htmlFor="email" className="sr-only">{t("email")}</label>
          <Input id="email" name="email" type="email" placeholder={t("email")} autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          {isRegister ? (
            <>
              <label htmlFor="fullName" className="sr-only">{t("fullName")}</label>
              <Input id="fullName" name="fullName" placeholder={t("fullName")} autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
            </>
          ) : null}
          <label htmlFor="password" className="sr-only">{t("password")}</label>
          <Input id="password" name="password" type="password" placeholder={t("password")} autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 8 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          {isRegister ? <p className="px-1 text-xs text-slate-500">{t("passwordHint")}</p> : null}
          {error ? <p role="alert" className="px-1 text-sm text-red-700">{error}</p> : null}
          <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-[15px] font-medium bg-indigo-600 text-[#fff] hover:bg-indigo-700 dark:bg-indigo-400 dark:text-[#12141c] dark:hover:bg-indigo-300" disabled={busy}>{isRegister ? t("signUp") : t("signIn")}</Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          {isRegister ? t("haveAccount") : t("noAccount")}{" "}
          <Link href={isRegister ? "/login" : "/register"} className="font-medium text-indigo-700 hover:underline">{isRegister ? t("signIn") : t("signUp")}</Link>
        </p>
      </div>
    </div>
  )
}
