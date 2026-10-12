import * as React from "react"

import { cn } from "@/lib/utils"

const field =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input data-slot="input" className={cn(field, "h-9", className)} {...props} />
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(field, "min-h-28 resize-y", className)} {...props} />
}

export { Input, Textarea }
