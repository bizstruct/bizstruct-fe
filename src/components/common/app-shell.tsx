"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { PanelLeft } from "lucide-react"
import { Sidebar } from "@/components/common/sidebar"
import { Button } from "@/components/ui/button"
import { setUnauthorizedHandler } from "@/lib/api/http"
import { PUBLIC_PAGES } from "@/lib/route-guard"
import { usePathname, useRouter } from "@/i18n/routing"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const t = useTranslations("AppShell")
  const pathname = usePathname()
  const router = useRouter()

  // A 401 that survived the BFF's refresh means the session is gone: go to the login page.
  useEffect(() => {
    setUnauthorizedHandler(() => router.replace("/login"))
    return () => setUnauthorizedHandler(null)
  }, [router])

  if ((PUBLIC_PAGES as readonly string[]).includes(pathname)) {
    return <div className="h-screen w-full overflow-y-auto bg-white">{children}</div>
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-white">
        <div
          className={`absolute top-3 left-4 z-50 transition-opacity duration-200 ${
            isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            aria-label={t("openSidebar")}
            className="h-8 w-8 text-slate-500 hover:text-slate-900 border border-slate-200 bg-white"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
