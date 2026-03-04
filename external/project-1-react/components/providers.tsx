"use client"

import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { TutorialProvider } from "@/components/tutorials/tutorial-provider"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <TutorialProvider>
        {children}
        <ScrollToTopButton />
        <Toaster />
      </TutorialProvider>
    </TooltipProvider>
  )
}

