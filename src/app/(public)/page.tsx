import type { Metadata } from 'next';

import { HomeExperience } from '@/components/public/HomeExperience';

export const metadata: Metadata = {
  title: 'CoSpace · Reserva espacios de coworking por horas',
  description: 'Un buen lugar para trabajar. Solo las horas que necesitas.',
  openGraph: {
    title: 'CoSpace · Reserva espacios de coworking por horas',
    description: 'Un buen lugar para trabajar. Solo las horas que necesitas.',
    url: 'https://cospace.example.com',
    siteName: 'CoSpace',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeExperience />;
}
