'use client';

import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export type Language = 'es' | 'en';
export const LANGUAGE_EVENT = 'cospace-language-change';

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const saved = window.localStorage.getItem('cospace-language');
    if (saved === 'en' || saved === 'es') setLanguage(saved);
  }, []);

  const toggle = () => {
    const nextLanguage = language === 'es' ? 'en' : 'es';
    setLanguage(nextLanguage);
    window.localStorage.setItem('cospace-language', nextLanguage);
    document.documentElement.lang = nextLanguage;
    window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: nextLanguage }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-[10px] border border-[#DEDED5] bg-[#F7F6F2] px-2.5 py-2 text-xs font-semibold text-[#222D28]"
      aria-label={language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}
    >
      <Globe className="h-3.5 w-3.5 text-[#245642]" />
      {language.toUpperCase()}
    </button>
  );
}
