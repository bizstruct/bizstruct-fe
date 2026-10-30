"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { motion } from "motion/react"
import { Sparkles } from "lucide-react"
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
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-100 px-4 py-16">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-violet-200/40 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="relative flex w-full max-w-sm flex-col gap-6 rounded-3xl border border-white/80 bg-white/90 p-8 shadow-2xl shadow-indigo-200/50 backdrop-blur">
      <div className="space-y-3">
        <span aria-hidden className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-[#fff] shadow-lg shadow-indigo-200"><Sparkles className="size-5" /></span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{isRegister ? t("registerTitle") : t("loginTitle")}</h1>
      </div>
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
        <Button type="submit" size="lg" className="h-11 w-full rounded-xl text-[#fff] bg-gradient-to-r from-indigo-500 to-violet-500 font-semibold shadow-md shadow-indigo-200 hover:from-indigo-600 hover:to-violet-600" disabled={busy}>{isRegister ? t("signUp") : t("signIn")}</Button>
      </form>
      <p className="text-sm text-slate-500">
        {isRegister ? t("haveAccount") : t("noAccount")}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-medium text-indigo-700 hover:underline">{isRegister ? t("signIn") : t("signUp")}</Link>
      </p>
      </motion.div>
    </div>
  )
}
