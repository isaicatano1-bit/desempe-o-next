'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Coffee,
  MapPin,
  MonitorUp,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { SearchBar } from '@/components/explorar/SearchBar';
import { SpaceCard } from '@/components/explorar/SpaceCard';
import { getPublicSpaces, type PublicSpace } from '@/lib/public-spaces';

const spaceTypes = [
  { name: 'Puesto individual', href: '/explorar?tipo=Puesto%20individual', icon: BriefcaseBusiness },
  { name: 'Escritorio dedicado', href: '/explorar?tipo=Escritorio%20dedicado', icon: Building2 },
  { name: 'Sala de reuniones', href: '/explorar?tipo=Sala%20de%20reuniones', icon: Users },
  { name: 'Oficina privada', href: '/explorar?tipo=Oficina%20privada', icon: ShieldCheck },
  { name: 'Cabina telefónica', href: '/explorar?tipo=Cabina%20telef%C3%B3nica', icon: MonitorUp },
];

const steps = [
  {
    number: '1',
    title: 'Elige el espacio y las horas',
    description: 'Busca por ciudad, horario y tipo de espacio que mejor encaje.',
    icon: MapPin,
  },
  {
    number: '2',
    title: 'Reserva en segundos',
    description: 'Confirma la disponibilidad y bloquea tu horario en pocos clics.',
    icon: Clock3,
  },
  {
    number: '3',
    title: 'Llega y trabaja',
    description: 'Disfruta de la sala, el Wi‑Fi y la atmósfera que te ayuda a crear.',
    icon: Sparkles,
  },
];

const benefits = [
  { title: 'Paga solo lo que usas', description: 'Bloques por horas, sin permanencia ni tratos largos.', icon: CheckCircle2 },
  { title: 'Bloques de 30 minutos', description: 'Ajusta la reserva a la duración exacta de tu sesión.', icon: Clock3 },
  { title: 'Wifi, café y más incluidos', description: 'Todo lo necesario para trabajar de forma cómoda y sin fricciones.', icon: Wifi },
  { title: 'Cancela fácilmente', description: 'Modifica o anula la reserva con la flexibilidad que necesitas.', icon: Coffee },
];

const cities = [
  {
    name: 'Madrid',
    image:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
    href: '/explorar?ciudad=Madrid',
  },
  {
    name: 'Barcelona',
    image:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
    href: '/explorar?ciudad=Barcelona',
  },
  {
    name: 'Valencia',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    href: '/explorar?ciudad=Valencia',
  },
];

export function HomeExperience() {
  const [featuredSpaces, setFeaturedSpaces] = useState<PublicSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [selectedType, setSelectedType] = useState(spaceTypes[0]);

  useEffect(() => {
    let active = true;

    async function fetchSpaces() {
      try {
        const spaces = await getPublicSpaces(3);
        if (active) {
          setFeaturedSpaces(spaces);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchSpaces();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#222D28]">
      <section className="mx-auto max-w-[1440px] px-5 pb-6 pt-6 lg:px-8 lg:pt-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DEDED5] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#245642] shadow-sm">
              <Clock3 className="h-3.5 w-3.5" />
              Por horas. Sin permanencia.
            </div>

            <h1 className="max-w-[520px] text-[2.8rem] font-semibold leading-[1.05] tracking-[-0.07em] text-[#222D28] sm:text-[4rem]">
              Haz espacio para tus ideas.
            </h1>
            <p className="mt-4 max-w-[520px] text-lg text-[#727970]">
              Un buen lugar para trabajar. Solo las horas que necesitas.
            </p>

            <div className="mt-6">
              <SearchBar />
            </div>

            <p className="mt-4 text-sm text-[#727970]">
              Tu espacio, solo el tiempo que necesitas. Reserva por horas, en bloques de 30 minutos.
            </p>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[16px] border border-[#DEDED5] bg-white shadow-[0_18px_36px_rgba(36,86,66,0.08)]">
              <div className="relative h-[420px] w-full overflow-hidden sm:h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
                  alt="Sala de coworking luminosa con mesas y plantas"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="absolute left-4 top-4 rounded-full border border-[#D7E7D1] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#245642] shadow-sm backdrop-blur-sm">
              Disponible ahora
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Tipos</div>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[#222D28]">Elige tu formato ideal</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {spaceTypes.map(({ name, href, icon: Icon }) => {
            const selected = selectedType.name === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedType({ name, href, icon: Icon })}
                className={`group rounded-[16px] border p-4 text-left shadow-[0_10px_24px_rgba(22,31,26,0.04)] transition duration-200 ${
                  selected ? 'border-[#245642] bg-[#EAF1E9] text-[#245642]' : 'border-[#DEDED5] bg-white text-[#222D28] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(36,86,66,0.08)]'
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${selected ? 'bg-[#245642] text-white' : 'bg-[#EAF1E9] text-[#245642]'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-base font-semibold tracking-[-0.04em]">{name}</div>
                <div className="mt-2 text-xs text-[#727970]">{selected ? 'Seleccionado' : 'Ver disponibilidad'}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[20px] border border-[#DEDED5] bg-white p-5 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Selección actual</div>
              <h3 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.05em] text-[#222D28]">{selectedType.name}</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#727970]">
                Ideal para reuniones rápidas, sesiones de trabajo profundo o encuentros con clientes, con disponibilidad por horas y equipamiento listo para usar.
              </p>
            </div>

            <Link
              href={selectedType.href}
              className="inline-flex items-center justify-center rounded-[10px] bg-[#245642] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d473a]"
            >
              Explorar {selectedType.name}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Recomendado</div>
            <h2 className="mt-2 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#222D28]">
              Espacios para empezar hoy
            </h2>
          </div>
          <Link href="/explorar" className="inline-flex items-center gap-2 text-sm font-semibold text-[#245642] hover:text-[#1d473a]">
            Ver todos los espacios
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-[16px] border border-dashed border-[#DEDED5] bg-white p-8 text-center text-[#727970]">
            Cargando espacios disponibles...
          </div>
        ) : featuredSpaces.length ? (
          <div className="space-y-5">
            {featuredSpaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-dashed border-[#DEDED5] bg-white p-8 text-center text-[#727970]">
            No hay espacios disponibles en este momento.
          </div>
        )}
      </section>

      <section id="como-funciona" className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="mb-6 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Cómo funciona</div>
          <h2 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#222D28]">Reserva en tres pasos</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <div key={number} className="rounded-[16px] border border-[#DEDED5] bg-white p-5 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1E9] text-[#245642]">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[2rem] font-semibold tracking-[-0.06em] text-[#245642]">{number}</span>
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#222D28]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#727970]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="mb-6 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Beneficios</div>
          <h2 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#222D28]">Todo para trabajar mejor</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-[16px] border border-[#DEDED5] bg-white p-5 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#EAF1E9] text-[#245642]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.04em] text-[#222D28]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#727970]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Sedes</div>
            <h2 className="mt-2 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#222D28]">Descubre ciudades cercanas</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cities.map(({ name, image, href }) => {
            const selected = selectedCity.name === name;

            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedCity(cities.find((city) => city.name === name) ?? cities[0])}
                className={`group overflow-hidden rounded-[16px] border text-left shadow-[0_10px_24px_rgba(22,31,26,0.04)] transition duration-200 ${selected ? 'border-[#245642] bg-[#EAF1E9]' : 'border-[#DEDED5] bg-white hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(36,86,66,0.08)]'}`}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image src={image} alt={`Sede de CoSpace en ${name}`} fill className="object-cover transition duration-200 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-lg font-semibold tracking-[-0.04em] text-[#222D28]">{name}</div>
                    <div className="mt-1 text-xs text-[#727970]">{selected ? 'Seleccionada' : 'Ver fechas disponibles'}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#245642]" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Sede seleccionada</div>
              <h3 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.05em] text-[#222D28]">{selectedCity.name}</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#727970]">
                Conectamos espacios de trabajo, concentración y reuniones en {selectedCity.name} para que puedas reservar un entorno que se adapte a la intensidad de tu jornada.
              </p>
            </div>

            <Link
              href={selectedCity.href}
              className="inline-flex items-center justify-center rounded-[10px] bg-[#245642] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d473a]"
            >
              Ver espacios en {selectedCity.name}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="rounded-[20px] bg-[#245642] px-6 py-8 text-white shadow-[0_18px_36px_rgba(36,86,66,0.16)] sm:px-8 lg:px-10 lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D8E0CC]">Siguiente reserva</div>
              <h2 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.06em] text-white">Tu próxima reunión, aquí.</h2>
            </div>

            <Link href="/explorar" className="inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-3 text-sm font-semibold text-[#245642] transition hover:bg-[#F4F7F2]">
              Ver disponibilidad
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
