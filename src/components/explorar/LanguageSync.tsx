'use client';

import { useEffect } from 'react';

import { applyBrowserTranslations, type BrowserLocale } from '@/i18n/browser-translations';
import { LANGUAGE_EVENT } from './LanguageToggle';

export function LanguageSync() {
  useEffect(() => {
    const stored = window.localStorage.getItem('cospace-language');
    applyBrowserTranslations(stored === 'en' ? 'en' : 'es');

    const sync = (event: Event) => {
      const locale = (event as CustomEvent<BrowserLocale>).detail;
      if (locale === 'en' || locale === 'es') applyBrowserTranslations(locale);
    };

    window.addEventListener(LANGUAGE_EVENT, sync);
    return () => window.removeEventListener(LANGUAGE_EVENT, sync);
  }, []);

  return null;
}
