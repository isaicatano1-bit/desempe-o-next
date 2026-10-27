'use client';

import Link from 'next/link';
import { ArrowRight, Coffee, Heart, MapPin, MonitorPlay, Star, Wifi, Wind, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { PublicSpace } from '@/lib/public-spaces';

const amenityIcons = {
  Wifi,
  Café: Coffee,
  Proyector: MonitorPlay,
  Aire: Wind,
};

type ReservationDraft = {
  startAt: string;
  endAt: string;
};

function getDefaultDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function validateReservationDraft(startAt: string, endAt: string): string | null {
  if (!startAt || !endAt) {
    return 'Selecciona la hora de inicio y fin.';
  }

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Las fechas seleccionadas no son válidas.';
  }

  const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

  if (durationHours < 1 || durationHours > 4 || !Number.isInteger(durationHours)) {
    return 'La reserva debe durar entre 1 y 4 horas completas.';
  }

  const startHour = startDate.getHours();
  const endHour = endDate.getHours();

  if (startHour < 7 || endHour > 21 || startHour >= 21 || endHour > 21) {
    return 'La reserva debe estar entre las 07:00 y las 21:00.';
  }

  const maxFutureDate = new Date();
  maxFutureDate.setDate(maxFutureDate.getDate() + 30);
  if (startDate > maxFutureDate) {
    return 'La reserva no puede ser más de 30 días en el futuro.';
  }

  return null;
}

export function SpaceCard({ space }: { space: PublicSpace }) {
  const [favorite, setFavorite] = useState(space.isFavorite ?? false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [draft, setDraft] = useState<ReservationDraft>({
    startAt: getDefaultDateTime(new Date(Date.now() + 60 * 60 * 1000)),
    endAt: getDefaultDateTime(new Date(Date.now() + 2 * 60 * 60 * 1000)),
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const statusClasses =
    space.status === 'Disponible ahora'
      ? 'bg-[#EAF1E9] text-[#245642]'
      : 'bg-[#F1E8D9] text-[#826031]';

  const bookingMin = useMemo(() => getDefaultDateTime(new Date()), []);

  const handleBookingSubmit = async (): Promise<void> => {
    const validationError = validateReservationDraft(draft.startAt, draft.endAt);
    if (validationError) {
      setFeedback({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/v1/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          spaceId: space.id,
          startAt: new Date(draft.startAt).toISOString(),
          endAt: new Date(draft.endAt).toISOString(),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        errors?: Record<string, string[]>;
      };

      if (!response.ok) {
        const errorMessage = payload.message ?? 'No se pudo crear la reserva.';
        throw new Error(errorMessage);
      }

      setFeedback({ type: 'success', message: 'Reserva creada correctamente.' });
      setTimeout(() => {
        setIsBookingOpen(false);
        setFeedback(null);
      }, 1200);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo crear la reserva.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <article className="group flex overflow-hidden rounded-[16px] border border-[#DEDED5] bg-white p-2 shadow-[0_10px_24px_rgba(22,31,26,0.04)] transition-all duration-200 hover:shadow-[0_18px_36px_rgba(36,86,66,0.08)]">
        <div className="relative h-[195px] w-[255px] overflow-hidden rounded-[14px] bg-[#E9E7DF]">
          <img src={space.image} alt={space.name} className="h-full w-full object-cover" />

          <div className="absolute left-3 top-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses}`}>
              {space.status}
            </span>
          </div>

          <button
            type="button"
            aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            onClick={() => setFavorite((current) => !current)}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[#245642] shadow-sm backdrop-blur-sm transition hover:scale-105"
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-[#245642] text-[#245642]' : 'text-[#245642]'}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between px-4 py-3">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[1.9rem] font-semibold tracking-[-0.05em] text-[#222D28]">{space.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-[#727970]">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-[#F2B64C] text-[#F2B64C]" />
                    {space.rating}
                  </span>
                  <span>({space.reviews} reseñas)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-[#727970]">
              <MapPin className="h-4 w-4 text-[#245642]" />
              <span>{space.neighborhood}</span>
              <span>·</span>
              <span>{space.address}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#727970]">
              <span>{space.type}</span>
              <span>·</span>
              <span>{space.capacity} personas</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {space.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity as keyof typeof amenityIcons] ?? Wifi;
                return (
                  <span key={amenity} className="inline-flex items-center gap-1.5 rounded-full border border-[#DEDED5] bg-[#F7F7F4] px-2.5 py-1 text-xs text-[#4E554F]">
                    <Icon className="h-3.5 w-3.5 text-[#245642]" />
                    {amenity}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <div className="text-[2rem] font-semibold tracking-[-0.06em] text-[#222D28]">{space.price} € <span className="text-base font-medium text-[#727970]">/ hora</span></div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/espacios/${space.id}`}
                className="inline-flex items-center justify-center rounded-[10px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm font-semibold text-[#222D28] transition hover:bg-[#F7F6F2]"
              >
                Ver detalle
              </Link>
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#245642] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d473a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245642] focus-visible:ring-offset-2"
              >
                Reservar
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {isBookingOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121d1a]/45 p-4">
          <div className="w-full max-w-xl rounded-[22px] border border-[#DEDED5] bg-white p-6 shadow-[0_30px_80px_rgba(22,31,26,0.18)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Reserva</div>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-[#222D28]">{space.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#DEDED5] bg-[#F7F6F2] text-[#222D28]"
                aria-label="Cerrar formulario de reserva"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#222D28]">Inicio</span>
                <input
                  type="datetime-local"
                  min={bookingMin}
                  value={draft.startAt}
                  onChange={(event) => setDraft((current) => ({ ...current, startAt: event.target.value }))}
                  className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#222D28]">Fin</span>
                <input
                  type="datetime-local"
                  min={draft.startAt || bookingMin}
                  value={draft.endAt}
                  onChange={(event) => setDraft((current) => ({ ...current, endAt: event.target.value }))}
                  className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
                />
              </label>
            </div>

            <div className="mt-4 rounded-[12px] border border-[#DEDED5] bg-[#F7F6F2] p-3 text-sm text-[#727970]">
              Reglas: 1-4 horas, horario 07:00-21:00, máx. 30 días, sin solapamientos y máximo 3 reservas futuras.
            </div>

            {feedback ? (
              <div
                className={`mt-4 rounded-[12px] border px-3 py-2 text-sm ${
                  feedback.type === 'success'
                    ? 'border-[#CFE6D2] bg-[#EDF7EE] text-[#245642]'
                    : 'border-[#F1D4D1] bg-[#F6E4E1] text-[#A33B32]'
                }`}
              >
                {feedback.message}
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsBookingOpen(false)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] border border-[#DEDED5] bg-white px-4 py-2.5 text-sm font-semibold text-[#222D28]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleBookingSubmit();
                }}
                disabled={loading}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#245642] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d473a] disabled:opacity-70"
              >
                {loading ? 'Reservando...' : 'Confirmar reserva'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
