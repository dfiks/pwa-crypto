import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import translations from '@/i18n/translations'

export const useI18nStore = defineStore('i18n', () => {
  const currentLocale = ref(localStorage.getItem('locale') || 'en')

  const setLocale = (locale: string) => {
    currentLocale.value = locale
    localStorage.setItem('locale', locale)
  }

  const t = (key: string) => {
    const keys = key.split('.')
    let value = translations[currentLocale.value]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key
      }
    }
    
    return value || key
  }

  const locale = computed(() => currentLocale.value)

  return {
    t,
    setLocale,
    locale
  }
})