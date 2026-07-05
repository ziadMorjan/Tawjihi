import { useTranslation } from 'react-i18next';

export function useLanguage() {
  const { t, i18n } = useTranslation();
  
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const isAr = lang === 'ar' || lang.startsWith('ar');
  const dir = isAr ? 'rtl' : 'ltr';

  const toggleLanguage = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  return { lang, isAr, dir, t, toggleLanguage };
}
