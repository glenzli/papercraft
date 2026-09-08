import type { Locale } from './types'

export function getUrlLocale(search: string): Locale | undefined {
  const lang = new URLSearchParams(search).get('lang')
  return lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-CN' : undefined
}

export function resolveLocale(search: string, saved: string | null): Locale {
  return getUrlLocale(search) ?? (saved === 'en-US' ? 'en-US' : 'zh-CN')
}

export function urlWithLocale(href: string, locale: Locale): string {
  const url = new URL(href)
  url.searchParams.set('lang', locale === 'en-US' ? 'en' : 'zh')
  return url.href
}
