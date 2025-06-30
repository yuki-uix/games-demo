"use client"

import { LanguageSwitcher } from "./language-switcher"
import { useTranslation } from "@/lib/useTranslation"

export function TopToolbar() {
  const { t } = useTranslation()

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg border-b border-white/20 z-50">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-white font-bold text-lg">{t('gameTitle')}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-white/80 text-sm">
            <span>🎮 {t('player1')} vs {t('player2')}</span>
            <span>•</span>
            <span>🧩 {t('gameSubtitle')}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
} 