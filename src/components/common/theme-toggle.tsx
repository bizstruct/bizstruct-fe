"use client"

import { Moon, Sun } from "lucide-react"
import { useSyncExternalStore } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export const THEME_KEY = "bizstruct-theme"

// The root element's class is the single source of truth; the inline script in the layout sets it before paint.
const subscribe = (notify: () => void) => {
  const observer = new MutationObserver(notify)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}
const isDark = () => document.documentElement.classList.contains("dark")

/** Nocturne (dark) is the default; the choice is remembered in localStorage. */
export function ThemeToggle() {
  const t = useTranslations("Sidebar")
  const dark = useSyncExternalStore(subscribe, isDark, () => true)

  function toggle() {
    const next = !isDark()
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light")
    } catch {
      // private mode: the choice just lasts for this page
    }
  }

  return (
    <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600" onClick={toggle}>
      {dark ? <Sun /> : <Moon />} {dark ? t("lightTheme") : t("darkTheme")}
    </Button>
  )
}
