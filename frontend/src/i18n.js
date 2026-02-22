import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Load translation resources
import enCommon from './locales/en/common.json'
import ruCommon from './locales/ru/common.json'

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      ru: { common: ruCommon },
    },
    lng: savedLang || 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  })

// Persist language changes
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('lang', lng)
  } catch {}
})
