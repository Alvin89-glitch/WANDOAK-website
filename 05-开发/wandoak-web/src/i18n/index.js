import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

export const LOCALES = [
  { code: 'en', short: 'EN', label: 'English', htmlLang: 'en' },
  { code: 'zh', short: '中文', label: '中文', htmlLang: 'zh-CN' },
]

const STORAGE_KEY = 'wandoak-locale'

function initialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && LOCALES.some((l) => l.code === saved)) return saved
  } catch {
    /* private mode — fall through to the browser preference */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language || '' : ''
  return nav.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: { en, zh },
})

/**
 * The Chinese face is loaded only when Chinese is actually shown. It is a
 * build-time subset of exactly the glyphs this site renders (see
 * scripts/build-cjk-font.mjs) — 383 KB across three weights instead of the
 * 1.35 MB the full split face pulls down.
 */
let cjkLoaded = false
async function ensureCjkFont(locale) {
  if (locale !== 'zh' || cjkLoaded) return
  cjkLoaded = true
  await import('@/styles/cjk.css')
}

export function applyLocale(code) {
  i18n.global.locale.value = code
  const meta = LOCALES.find((l) => l.code === code) ?? LOCALES[0]
  document.documentElement.lang = meta.htmlLang
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* non-fatal */
  }
  ensureCjkFont(code)
}
