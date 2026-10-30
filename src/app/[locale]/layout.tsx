import type { Metadata } from "next"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { Geist_Mono, Inter } from "next/font/google"
import { AppShell } from "@/components/common/app-shell"
import { routing } from "@/i18n/routing"
import "@/styles/globals.css"

// Runs before paint so the page never flashes light: Nocturne unless the user chose the light theme.
const THEME_SCRIPT = `try{if(localStorage.getItem("bizstruct-theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`

// Inter has a Cyrillic subset; the interface is Ukrainian first.
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

type LocaleLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params
  const metadataLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale
  const t = await getTranslations({
    locale: metadataLocale,
    namespace: "Metadata",
  })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function RootLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppShell>{children}</AppShell>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
