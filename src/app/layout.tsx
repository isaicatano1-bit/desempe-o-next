import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CoSpace',
  description: 'Coworking space reservation platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
