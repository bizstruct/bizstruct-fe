"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { PanelLeft } from "lucide-react"
import { Sidebar } from "@/components/common/sidebar"
import { Button } from "@/components/ui/button"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const t = useTranslations("AppShell")

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-white">
        {!isSidebarOpen && (
          <div className="absolute top-3 left-4 z-50">
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
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
