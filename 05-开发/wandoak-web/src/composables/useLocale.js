import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALES, applyLocale } from '@/i18n'

export function useLocale() {
  const { locale } = useI18n()
  const current = computed(() => LOCALES.find((l) => l.code === locale.value) ?? LOCALES[0])
  const other = computed(() => LOCALES.find((l) => l.code !== locale.value) ?? LOCALES[1])
  return { locale, current, other, locales: LOCALES, set: applyLocale }
}
