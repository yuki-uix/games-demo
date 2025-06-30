"use client"

import { PatchworkGame } from "@/components/game/PatchworkGame"
import { LanguageProvider } from "@/lib/useTranslation"

export default function Home() {
  return (
    <LanguageProvider>
      <PatchworkGame />
    </LanguageProvider>
  )
}
