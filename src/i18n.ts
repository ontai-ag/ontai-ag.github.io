import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  // Загрузка переводов с сервера (например, из папки public/locales)
  .use(HttpApi)
  // Определение языка пользователя
  .use(LanguageDetector)
  // Передача экземпляра i18n в react-i18next
  .use(initReactI18next)
  // Инициализация i18next
  .init({
    supportedLngs: ['en', 'ru', 'kk', 'zh', 'hi', 'es', 'fr', 'ar'],
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Включаем логирование только в режиме разработки
    detection: {
      // Порядок и методы определения языка
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'], // Где кешировать определенный язык
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Путь к файлам переводов
    },
    react: {
      useSuspense: false, // Отключаем Suspense, чтобы избежать проблем с рендерингом
    },
  });

export default i18n;