"use client"

import { useState } from "react"
import { Sidebar } from "@/components/common/sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"
import { Geist, Geist_Mono } from "next/font/google"
import "@/styles/globals.css"

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <html lang="uk">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}>
        <div className="flex h-screen overflow-hidden">

          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          
          <div className="flex-1 flex flex-col h-full min-w-0 relative bg-white">
            
            {!isSidebarOpen && (
              <div className="absolute top-3 left-4 z-50">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(true)}
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 border border-slate-200 bg-white"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}