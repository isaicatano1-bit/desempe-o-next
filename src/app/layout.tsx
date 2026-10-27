import './globals.css';
import type { Metadata } from 'next';
import { LanguageSync } from '@/components/explorar/LanguageSync';

export const metadata: Metadata = {
  title: 'CoSpace',
  description: 'Coworking space reservation platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <LanguageSync />
        {children}
      </body>
    </html>
  );
}
