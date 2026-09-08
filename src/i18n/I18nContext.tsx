import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { Locale, TranslationSchema } from './types'
import { zhCN } from './locales/zh-CN'
import { enUS } from './locales/en-US'
import { getUrlLocale, resolveLocale, urlWithLocale } from './urlLocale'

const dictionaries: Record<Locale, TranslationSchema> = {
  'zh-CN': zhCN,
  'en-US': enUS
}

interface I18nContextType {
  locale: Locale
  setLocale: (loc: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isZh: boolean
  locales: { key: Locale; label: string; flag: string }[]
}

const I18nContext = createContext<I18nContextType | null>(null)

const LOCAL_STORAGE_KEY = 'papercraft_locale'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'zh-CN'
  let saved: string | null = null
  try { saved = window.localStorage.getItem(LOCAL_STORAGE_KEY) } catch { /* Storage may be unavailable in embeds. */ }
  return resolveLocale(window.location.search, saved)
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      window.history.replaceState(window.history.state, '', urlWithLocale(window.location.href, newLocale))
      try { window.localStorage.setItem(LOCAL_STORAGE_KEY, newLocale) } catch { /* URL and UI still work without storage. */ }
    }
  }, [])

  // 监听多标签页或其他地方的语言变动
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (!getUrlLocale(window.location.search) && e.key === LOCAL_STORAGE_KEY && (e.newValue === 'zh-CN' || e.newValue === 'en-US')) {
        setLocaleState(e.newValue as Locale)
      }
    }
    const handleNavigation = () => setLocaleState(getInitialLocale())
    window.addEventListener('storage', handleStorage)
    window.addEventListener('popstate', handleNavigation)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [])

  useEffect(() => { document.documentElement.lang = locale }, [locale])

  // 核心翻译函数支持嵌套路径 (e.g. 'header.builtInTrains') 与插值参数 (e.g. { count: 3 })
  const t = useCallback((path: string, params?: Record<string, string | number>): string => {
    const dict = dictionaries[locale] || dictionaries['zh-CN']
    const keys = path.split('.')
    let current: any = dict

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        // Fallback to zh-CN dictionary if key missing in current locale
        let fallback: any = dictionaries['zh-CN']
        for (const fbKey of keys) {
          if (fallback && typeof fallback === 'object' && fbKey in fallback) {
            fallback = fallback[fbKey]
          } else {
            fallback = undefined
            break
          }
        }
        current = fallback !== undefined ? fallback : path
        break
      }
    }

    let text = typeof current === 'string' ? current : path

    if (params && typeof text === 'string') {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g')
        text = text.replace(regex, String(params[paramKey]))
      })
    }

    return text
  }, [locale])

  const contextValue = useMemo<I18nContextType>(() => ({
    locale,
    setLocale,
    t,
    isZh: locale === 'zh-CN',
    locales: [
      { key: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
      { key: 'en-US', label: 'English', flag: '🇺🇸' }
    ]
  }), [locale, setLocale, t])

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}
