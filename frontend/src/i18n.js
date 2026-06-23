// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // ── Fallback language ────────────────────────────────────────────────────
    fallbackLng: 'ar',

    // ── Detection options ────────────────────────────────────────────────────
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'tawjihi-language',
      caches: ['localStorage'],
    },

    // ── Load translations from /public/locales ───────────────────────────────
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // ── Load resources inline (avoids need for i18next-http-backend) ─────────
    resources: {
      ar: {
        translation: require('./locales/ar/translation.json'),
      },
      en: {
        translation: require('./locales/en/translation.json'),
      },
    },
  });

// ── Apply dir & lang on <html> whenever language changes ────────────────────
i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng);
  document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
});

// ── Apply on initial load ────────────────────────────────────────────────────
const initialLng = i18n.language?.startsWith('ar') ? 'ar' : 'en';
document.documentElement.setAttribute('lang', initialLng);
document.documentElement.setAttribute('dir', initialLng === 'ar' ? 'rtl' : 'ltr');

export default i18n;
