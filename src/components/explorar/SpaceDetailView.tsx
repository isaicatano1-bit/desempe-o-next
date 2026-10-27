'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, MapPin, ShieldCheck, Star, Users, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

import { LANGUAGE_EVENT, type Language } from './LanguageToggle';

type SpaceDetails = {
  name: string;
  image: string;
  status: string;
  rating: number;
  reviews: number;
  type: string;
  city: string;
  address: string;
  neighborhood: string;
  capacity: number;
  price: number;
  amenities: string[];
};

const copy = {
  es: {
    back: 'Volver al catálogo', unavailable: 'No hay ningún espacio disponible con ese identificador en la base de datos.',
    reviews: 'reseñas', people: 'Hasta', peopleSuffix: 'personas', instant: 'Disponible por horas con reserva instantánea',
    perHour: '/ hora', included: 'Incluye Wi‑Fi, limpieza y acceso a la zona coworking.', book: 'Reservar ahora', availability: 'Ver disponibilidad',
  },
  en: {
    back: 'Back to spaces', unavailable: 'No space with this ID is currently available in the database.',
    reviews: 'reviews', people: 'Up to', peopleSuffix: 'people', instant: 'Available by the hour with instant booking',
    perHour: '/ hour', included: 'Includes Wi-Fi, cleaning, and access to the coworking area.', book: 'Book now', availability: 'Check availability',
  },
} satisfies Record<Language, Record<string, string>>;

function localize(value: string, language: Language): string {
  if (language === 'es') return value;
  const translations: Record<string, string> = {
    Disponible: 'Available', Activo: 'Active', Inactivo: 'Inactive',
    'Disponible ahora': 'Available now', 'No disponible': 'Unavailable',
    'Sala de reuniones': 'Meeting room', 'Escritorio dedicado': 'Dedicated desk',
    'Oficina privada': 'Private office', Escritorio: 'Desk', 'Cabina telefónica': 'Phone booth',
    'Sala de reunión': 'Meeting room', Espacio: 'Space', Madrid: 'Madrid',
    'Zona general': 'General area', 'Consulta la ubicación exacta en la ficha del espacio': 'See the space details for the exact location',
    'Ubicación disponible': 'Location available', Wifi: 'Wi-Fi', Café: 'Coffee', Aire: 'Air conditioning',
    Proyector: 'Projector', 'Wi-Fi': 'Wi-Fi',
  };
  return translations[value] ?? value;
}

export function SpaceDetailView({ space }: { space: SpaceDetails | null }) {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const saved = window.localStorage.getItem('cospace-language');
    if (saved === 'en' || saved === 'es') setLanguage(saved);
    const syncLanguage = (event: Event) => {
      const nextLanguage = (event as CustomEvent<Language>).detail;
      if (nextLanguage === 'en' || nextLanguage === 'es') setLanguage(nextLanguage);
    };
    window.addEventListener(LANGUAGE_EVENT, syncLanguage);
    return () => window.removeEventListener(LANGUAGE_EVENT, syncLanguage);
  }, []);

  const t = copy[language];
  const backLink = (
    <Link href="/espacios" className="inline-flex items-center gap-2 rounded-[10px] border border-[#DEDED5] bg-white px-3 py-2 text-sm font-medium text-[#222D28] shadow-sm hover:bg-[#F5F5F2]">
      <ArrowLeft className="h-4 w-4" />{t.back}
    </Link>
  );

  if (!space) {
    return (
      <main className="min-h-screen bg-[#F7F6F2] text-[#222D28]">
        <div className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8">
          {backLink}
          <div className="mt-6 rounded-[20px] border border-dashed border-[#DEDED5] bg-white p-12 text-center text-[#727970]">{t.unavailable}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#222D28]">
      <div className="mx-auto max-w-[1240px] px-5 py-8 lg:px-8">
        {backLink}
        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#DEDED5] bg-white shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative h-[360px] lg:h-full">
              <Image src={space.image} alt={space.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
            </div>
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-[#EAF1E9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#245642]">{localize(space.status, language)}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DEDED5] bg-[#F7F6F2] px-2.5 py-1 text-sm text-[#222D28]"><Star className="h-4 w-4 fill-[#F2B64C] text-[#F2B64C]" />{space.rating} · {space.reviews} {t.reviews}</span>
              </div>
              <h1 className="mt-5 text-[2.5rem] font-semibold tracking-[-0.06em] text-[#222D28]">{space.name}</h1>
              <p className="mt-3 text-sm text-[#727970]">{localize(space.type, language)} · {localize(space.city, language)}</p>
              <div className="mt-5 space-y-4 text-sm text-[#727970]">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#245642]" />{space.address}, {space.neighborhood}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-[#245642]" />{t.people} {space.capacity} {t.peopleSuffix}</div>
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#245642]" />{t.instant}</div>
              </div>
              <div className="mt-6 rounded-[16px] border border-[#DEDED5] bg-[#F7F6F2] p-4">
                <div className="text-[2rem] font-semibold tracking-[-0.06em] text-[#222D28]">{space.price} € <span className="text-base font-medium text-[#727970]">{t.perHour}</span></div>
                <div className="mt-2 text-sm text-[#727970]">{t.included}</div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {space.amenities.map((amenity) => <span key={amenity} className="inline-flex items-center gap-1.5 rounded-full border border-[#DEDED5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#222D28]"><Wifi className="h-3.5 w-3.5 text-[#245642]" />{localize(amenity, language)}</span>)}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={`/explorar?tipo=${encodeURIComponent(space.type)}`} className="inline-flex min-h-[46px] items-center justify-center rounded-[10px] bg-[#245642] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d473a]">{t.book}</Link>
                <button type="button" className="inline-flex min-h-[46px] items-center justify-center rounded-[10px] border border-[#DEDED5] bg-white px-4 py-3 text-sm font-semibold text-[#222D28] transition hover:bg-[#F7F6F2]"><ShieldCheck className="mr-2 h-4 w-4 text-[#245642]" />{t.availability}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
