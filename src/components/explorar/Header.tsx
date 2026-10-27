'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ChevronDown, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LANGUAGE_EVENT, LanguageToggle, type Language } from './LanguageToggle';

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

function getInitials(name: string): string {
  const [firstName, secondName] = name.trim().split(/\s+/);
  const first = firstName?.[0] ?? 'U';
  const second = secondName?.[0] ?? '';
  return `${first}${second}`.toUpperCase();
}

const labels: Record<Language, Record<string, string>> = {
  es: {
    explore: 'Explorar',
    howItWorks: 'Cómo funciona',
    help: 'Ayuda',
    login: 'Iniciar sesión',
    register: 'Crear cuenta',
    panel: 'Panel',
    logout: 'Cerrar sesión',
    hello: 'Hola',
    menu: 'Abrir menú de usuario',
  },
  en: {
    explore: 'Explore',
    howItWorks: 'How it works',
    help: 'Help',
    login: 'Log in',
    register: 'Create account',
    panel: 'Dashboard',
    logout: 'Log out',
    hello: 'Hi',
    menu: 'Open user menu',
  },
};

export function Header({ variant = 'user' }: { variant?: 'visitor' | 'user' }) {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('cospace-language') as Language | null;
    if (savedLanguage === 'en' || savedLanguage === 'es') {
      setLanguage(savedLanguage);
      window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: savedLanguage }));
    }
    document.documentElement.lang = savedLanguage ?? 'es';
    const syncLanguage = (event: Event) => {
      const nextLanguage = (event as CustomEvent<Language>).detail;
      if (nextLanguage === 'en' || nextLanguage === 'es') setLanguage(nextLanguage);
    };
    window.addEventListener(LANGUAGE_EVENT, syncLanguage);
    return () => window.removeEventListener(LANGUAGE_EVENT, syncLanguage);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async (): Promise<void> => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-store',
        });

        if (!response.ok) {
          if (isMounted) {
            setSessionUser(null);
          }
          return;
        }

        const payload = (await response.json()) as { user?: SessionUser | null };

        if (isMounted) {
          setSessionUser(payload.user ?? null);
        }
      } catch {
        if (isMounted) {
          setSessionUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const isAuthenticated = Boolean(sessionUser);
  const showVisitorActions = !isLoading && !isAuthenticated;
  const showUserMenu = !isLoading && isAuthenticated;
  const t = labels[language];

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch {
      // Ignore network failure and continue to redirect the user to the login page.
    } finally {
      setSessionUser(null);
      router.replace('/login');
    }
  };

  return (
    <header className="h-[88px] border-b border-[#DEDED5] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#245642] text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="text-[1.55rem] font-semibold tracking-[-0.04em] text-[#222D28]">CoSpace</div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#727970] md:flex">
          <Link href="/explorar" className="relative pb-2 text-[#245642] after:absolute after:-bottom-[19px] after:left-0 after:h-[2px] after:w-full after:bg-[#245642]">
            {t.explore}
          </Link>
          <Link href="/#como-funciona" className="transition hover:text-[#222D28]">{t.howItWorks}</Link>
          <Link href="/explorar" className="transition hover:text-[#222D28]">{t.help}</Link>
        </nav>

        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 animate-pulse rounded-[10px] bg-[#EFEFEA]" />
            <div className="hidden h-9 w-24 animate-pulse rounded-[10px] bg-[#EFEFEA] sm:block" />
          </div>
        ) : showVisitorActions ? (
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              href="/login"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-transparent px-4 py-2.5 text-sm font-semibold text-[#245642] transition hover:bg-[#EAF1E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245642] focus-visible:ring-offset-2"
            >
              {t.login}
            </Link>
            <Link
              href="/registro"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#245642] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d473a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245642] focus-visible:ring-offset-2"
            >
              {t.register}
            </Link>
          </div>
        ) : null}

        {showUserMenu ? (
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <span className="hidden text-sm font-medium text-[#222D28] sm:block">
              {t.hello}, {sessionUser?.name.split(' ')[0] ?? 'Usuario'}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1E9] text-sm font-semibold text-[#245642] ring-1 ring-[#D7E7D1]">
              {getInitials(sessionUser?.name ?? 'Usuario')}
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/dashboard" className="text-sm font-medium text-[#245642] hover:text-[#1d473a]">
                {t.panel}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[#DEDED5] bg-white px-2.5 py-1.5 text-sm font-medium text-[#222D28] transition hover:bg-[#F5F5F2]"
              >
                <LogOut className="h-4 w-4" />
                {t.logout}
              </button>
            </div>
            <button className="hidden rounded-full p-2 text-[#222D28] transition hover:bg-[#F5F5F2] md:inline-flex" aria-label={t.menu}>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
