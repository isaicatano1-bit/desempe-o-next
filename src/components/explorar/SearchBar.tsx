'use client';

import { Search, MapPin, CalendarDays, Clock3, Users, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const defaultFields = [
  { label: 'Ciudad o sede', value: 'Madrid', icon: MapPin },
  { label: 'Fecha', value: '18 abr 2026', icon: CalendarDays },
  { label: 'Inicio', value: '09:00', icon: Clock3 },
  { label: 'Fin', value: '18:00', icon: Clock3 },
  { label: 'Tipo de espacio', value: 'Sala de reuniones', icon: SlidersHorizontal },
  { label: 'Personas', value: '4 personas', icon: Users },
];

export type SearchQueryValues = {
  ciudad: string;
  fecha: string;
  inicio: string;
  fin: string;
  tipo: string;
  personas: string;
};

export function SearchBar({
  defaultValues = {
    ciudad: 'Madrid',
    fecha: '18 abr 2026',
    inicio: '09:00',
    fin: '18:00',
    tipo: 'Sala de reuniones',
    personas: '4 personas',
  },
}: {
  defaultValues?: SearchQueryValues;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<SearchQueryValues>(defaultValues);

  const fields = useMemo(
    () => [
      { label: 'Ciudad o sede', key: 'ciudad', value: values.ciudad, icon: MapPin },
      { label: 'Fecha', key: 'fecha', value: values.fecha, icon: CalendarDays },
      { label: 'Inicio', key: 'inicio', value: values.inicio, icon: Clock3 },
      { label: 'Fin', key: 'fin', value: values.fin, icon: Clock3 },
      { label: 'Tipo de espacio', key: 'tipo', value: values.tipo, icon: SlidersHorizontal },
      { label: 'Personas', key: 'personas', value: values.personas, icon: Users },
    ],
    [values],
  );

  const submitSearch = () => {
    const params = new URLSearchParams();
    if (values.ciudad) params.set('ciudad', values.ciudad);
    if (values.fecha) params.set('fecha', values.fecha);
    if (values.inicio) params.set('inicio', values.inicio);
    if (values.fin) params.set('fin', values.fin);
    if (values.tipo) params.set('tipo', values.tipo);
    if (values.personas) params.set('personas', values.personas);

    router.push(`/explorar?${params.toString()}`);
  };

  return (
    <section className="border-b border-[#DEDED5] bg-white">
      <div className="mx-auto max-w-[1440px] px-5 pb-4 pt-4 lg:px-8">
        <div className="hidden gap-3 xl:grid xl:grid-cols-[1.1fr_1fr_0.8fr_0.8fr_1.2fr_0.9fr_auto]">
          {fields.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-[12px] border border-[#DEDED5] bg-[#F8F7F4] px-3 py-2.5">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#727970]">
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-[#222D28]">{value}</div>
            </div>
          ))}

          <button
            type="button"
            onClick={submitSearch}
            className="inline-flex items-center justify-center rounded-[10px] bg-[#245642] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d473a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245642] focus-visible:ring-offset-2"
          >
            Buscar
          </button>
        </div>

        <div className="xl:hidden">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex w-full items-center justify-between rounded-[12px] border border-[#DEDED5] bg-[#F8F7F4] px-4 py-3 text-left"
          >
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#727970]">Buscar</div>
              <div className="mt-1 text-sm font-semibold text-[#222D28]">{values.ciudad} · {values.fecha} · {values.inicio}–{values.fin}</div>
            </div>
            <Search className="h-4 w-4 text-[#245642]" />
          </button>

          {open && (
            <div className="mt-3 space-y-2 rounded-[16px] border border-[#DEDED5] bg-white p-3 shadow-sm">
              {fields.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between rounded-[12px] border border-[#DEDED5] bg-[#F8F7F4] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#727970]" />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-[#727970]">{label}</div>
                      <div className="text-sm font-semibold text-[#222D28]">{value}</div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-[#727970]" />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  submitSearch();
                }}
                className="mt-2 inline-flex w-full items-center justify-center rounded-[10px] bg-[#245642] px-4 py-3 text-sm font-semibold text-white"
              >
                Buscar
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-[#727970]">
          Tu espacio, solo el tiempo que necesitas. Reserva por horas, en bloques de 30 minutos.
        </p>
      </div>
    </section>
  );
}
