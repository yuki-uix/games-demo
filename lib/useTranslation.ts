"use client"

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { 
  Language, 
  TranslationKey, 
  detectLanguage, 
  t as translate, 
  getSupportedLanguages,
  languageNames 
} from './i18n'

// 本地存储键
const LANGUAGE_STORAGE_KEY = 'game-language'

// 语言上下文类型
interface LanguageContextType {
  t: (key: TranslationKey) => string
  currentLanguage: Language
  changeLanguage: (language: Language) => void
  supportedLanguages: Language[]
  getLanguageName: (language: Language) => string
  isClient: boolean
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 语言提供者组件
export function LanguageProvider({ children }: { children: ReactNode }) {
  // 初始化语言状态 - 默认英语
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')
  const [isClient, setIsClient] = useState(false)

  // 客户端初始化
  useEffect(() => {
    setIsClient(true)
    
    // 从本地存储获取语言设置
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language
    if (savedLanguage && getSupportedLanguages().includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    } else {
      // 如果没有保存的语言设置，使用浏览器检测
      const detectedLanguage = detectLanguage()
      setCurrentLanguage(detectedLanguage)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLanguage)
    }
  }, [])

  // 翻译函数
  const t = (key: TranslationKey): string => {
    // 确保在客户端渲染时使用正确的语言
    const lang = isClient ? currentLanguage : 'en'
    return translate(key, lang)
  }

  // 切换语言
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }

  // 获取支持的语言列表
  const supportedLanguages = getSupportedLanguages()

  // 获取语言名称
  const getLanguageName = (language: Language): string => {
    return languageNames[language]
  }

  const value: LanguageContextType = {
    t,
    currentLanguage,
    changeLanguage,
    supportedLanguages,
    getLanguageName,
    isClient
  }

  return React.createElement(LanguageContext.Provider, { value }, children)
}

// 使用翻译的Hook
export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
} 