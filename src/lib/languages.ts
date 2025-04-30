export interface Language {
  language: string;
  country?: string;
  code: string;
  map?: string;
}

export const languages: Language[] = [
  { language: "Afrikaans", country: "ZA", code: "af" },
  { language: "አማርኛ", country: "ET", code: "am" },
  { language: "العربية", code: "ar" },
  { language: "English", code: "en", map: "en" },
  { language: "Español", code: "es", map: "es" },
  { language: "Français", country: "FR", code: "fr" },
  { language: "Deutsch", country: "DE", code: "de" },
  { language: "Italiano", country: "IT", code: "it" },
  { language: "Português", code: "pt", map: "pt" },
  { language: "Русский", country: "RU", code: "ru" },
  { language: "日本語", country: "JP", code: "ja" },
  { language: "한국어", country: "KR", code: "ko" },
  { language: "中文", code: "zh" },
  // Add more languages as needed
];

export function convertLanguage(lang: Language): string {
  return `${lang.code ? `${lang.code}-` : ''}${lang.country || ''}`;
}

export function getBrowserLanguage(): string {
  const keys = ['languages', 'language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
  
  for (const key of keys) {
    const lang = navigator[key as keyof Navigator];
    if (lang) {
      if (Array.isArray(lang)) {
        for (const l of lang) {
          if (l) return l;
        }
      } else if (typeof lang === 'string') {
        return lang;
      }
    }
  }
  
  return 'en-US';
}

export function getLanguageOptions(): { value: string; label: string }[] {
  const userLanguage = getBrowserLanguage();
  const options: { value: string; label: string }[] = [];
  
  // Add user's language first if found
  const userLangMatch = languages.find(l => convertLanguage(l) === userLanguage);
  if (userLangMatch) {
    options.push({
      value: convertLanguage(userLangMatch),
      label: `${userLangMatch.language}${userLangMatch.country ? ` (${userLangMatch.country})` : ''}`
    });
  }
  
  // Add other languages
  languages.forEach(lang => {
    if (lang !== userLangMatch && !lang.map) {
      options.push({
        value: convertLanguage(lang),
        label: `${lang.language}${lang.country ? ` (${lang.country})` : ''}`
      });
    }
  });
  
  return options;
} 