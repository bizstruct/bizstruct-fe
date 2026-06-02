import type { ReactNode } from "react"
import { homeStyles as s } from "./styles"

export function PageRoot({ children }: { children: ReactNode }) {
  return <div className={s.root}>{children}</div>
}

export function Hero({ children }: { children: ReactNode }) {
  return <div className={s.hero}>{children}</div>
}

export function HeroTitle({ children }: { children: ReactNode }) {
  return <h1 className={s.heroTitle}>{children}</h1>
}

export function HeroSubtitle({ children }: { children: ReactNode }) {
  return <p className={s.heroSubtitle}>{children}</p>
}
