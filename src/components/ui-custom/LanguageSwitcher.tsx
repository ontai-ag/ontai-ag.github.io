import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'kk', name: 'Қазақша' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'ru', name: 'Русский' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = event.target.value;
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center">
      {/* Label removed as requested */}
      <select
        id="language-select"
        value={i18n.language}
        onChange={changeLanguage}
        className="block w-auto pl-2 pr-7 py-1 text-xs border-transparent focus:outline-none focus:ring-0 focus:border-transparent rounded-md bg-transparent dark:bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;