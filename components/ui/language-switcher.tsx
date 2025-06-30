"use client"

import { useTranslation } from '@/lib/useTranslation'
import { Button } from './button'

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, supportedLanguages, getLanguageName, isClient } = useTranslation()

  if (!isClient) {
    return null // 服务端渲染时不显示
  }

  return (
    <div className="flex gap-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
      {supportedLanguages.map((language) => (
        <Button
          key={language}
          variant={currentLanguage === language ? "default" : "ghost"}
          size="sm"
          onClick={() => changeLanguage(language)}
          className={`min-w-[60px] h-8 text-xs font-medium transition-all duration-200 ${
            currentLanguage === language 
              ? "bg-white text-blue-600 shadow-md hover:bg-white/90" 
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
        >
          {getLanguageName(language)}
        </Button>
      ))}
    </div>
  )
} 