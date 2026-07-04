import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Your translation files
import en from './en.json';
import hi from './hi.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: hi },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});
export default i18n;
