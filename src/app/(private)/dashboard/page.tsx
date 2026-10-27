'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ReservationStatusFilter = 'ALL' | 'ACTIVE' | 'PAST' | 'CANCELLED';

type ReservationItem = {
  id: string;
  status: 'CONFIRMED' | 'IN_PROCESS' | 'CANCELLED';
  startAt: string;
  endAt: string;
  totalPrice: number | string;
  space?: {
    id: string;
    name: string;
    type: string;
    capacity?: number;
    price?: number | string;
  } | null;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

function formatRange(startAt: Date, endAt: Date): string {
  return `${new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(startAt)} – ${new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(endAt)}`;
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [filter, setFilter] = useState<ReservationStatusFilter>('ACTIVE');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callbackMessage, setCallbackMessage] = useState<string | null>(null);

  const loadReservations = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/v1/reservations/me', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      const payload = (await response.json().catch(() => ({ data: { items: [] } }))) as {
        message?: string;
        data?: { items?: ReservationItem[] };
      };

      if (!response.ok) {
        throw new Error(payload.message ?? 'No se pudieron cargar tus reservas.');
      }

      setReservations(payload.data?.items ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar tus reservas.');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReservations();
  }, []);

  const filteredReservations = useMemo(() => {
    const now = new Date();

    switch (filter) {
      case 'ALL':
        return reservations;
      case 'ACTIVE':
        return reservations.filter((reservation) => reservation.status !== 'CANCELLED' && new Date(reservation.endAt).getTime() >= now.getTime());
      case 'PAST':
        return reservations.filter((reservation) => reservation.status !== 'CANCELLED' && new Date(reservation.endAt).getTime() < now.getTime());
      case 'CANCELLED':
        return reservations.filter((reservation) => reservation.status === 'CANCELLED');
      default:
        return reservations;
    }
  }, [filter, reservations]);

  const totalSpend = reservations.reduce((sum, reservation) => sum + Number(reservation.totalPrice || 0), 0);
  const upcomingCount = reservations.filter((reservation) => reservation.status !== 'CANCELLED').length;
  const nextReservations = [...reservations]
    .filter((reservation) => reservation.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, 5);

  const nextReservation = nextReservations[0];

  const handleCancel = async (reservationId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/v1/reservations/${reservationId}/cancel`, {
        method: 'POST',
        credentials: 'same-origin',
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? 'No se pudo cancelar la reserva.');
      }

      setCallbackMessage('Reserva cancelada correctamente.');
      await loadReservations();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'No se pudo cancelar la reserva.');
    }
  };

  return (
    <main className="space-y-6">
      <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Panel</div>
            <h1 className="mt-2 text-[2.3rem] font-semibold tracking-[-0.06em] text-[#222D28]">Mi dashboard</h1>
          </div>

          <Link href="/explorar" className="inline-flex items-center justify-center rounded-[10px] bg-[#245642] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d473a]">
            Reservar otro espacio
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[18px] border border-[#DEDED5] bg-white p-5 shadow-[0_8px_18px_rgba(18,29,24,0.03)]">
          <div className="text-sm text-[#727970]">Reservas activas</div>
          <div className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-[#222D28]">{upcomingCount}</div>
          <div className="mt-2 text-sm text-[#727970]">Totales registradas para tu cuenta</div>
        </div>

        <div className="rounded-[18px] border border-[#DEDED5] bg-white p-5 shadow-[0_8px_18px_rgba(18,29,24,0.03)]">
          <div className="text-sm text-[#727970]">Gasto total</div>
          <div className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-[#222D28]">€{totalSpend.toFixed(2)}</div>
          <div className="mt-2 text-sm text-[#727970]">En tus reservas actuales</div>
        </div>

        <div className="rounded-[18px] border border-[#DEDED5] bg-white p-5 shadow-[0_8px_18px_rgba(18,29,24,0.03)]">
          <div className="text-sm text-[#727970]">Próxima reserva</div>
          <div className="mt-3 text-[1.3rem] font-semibold tracking-[-0.04em] text-[#222D28]">
            {nextReservation && nextReservation.space ? nextReservation.space.name : 'Sin reservas'}
          </div>
          <div className="mt-2 text-sm text-[#727970]">
            {nextReservation ? formatDate(new Date(nextReservation.startAt)) : 'No tienes reservas en curso'}
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Mis reservas</div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#222D28]">Historial y próximas</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['ALL', 'ACTIVE', 'PAST', 'CANCELLED'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-[10px] px-3 py-2 text-sm font-semibold transition ${
                  filter === value
                    ? 'bg-[#245642] text-white'
                    : 'border border-[#DEDED5] bg-white text-[#222D28] hover:bg-[#F5F5F2]'
                }`}
              >
                {value === 'ALL' ? 'Todas' : value === 'ACTIVE' ? 'Activas' : value === 'PAST' ? 'Pasadas' : 'Canceladas'}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-[12px] border border-[#F1D4D1] bg-[#F6E4E1] px-3 py-2 text-sm text-[#A33B32]">
            {error}
          </div>
        ) : null}

        {callbackMessage ? (
          <div className="mb-4 rounded-[12px] border border-[#CFE6D2] bg-[#EDF7EE] px-3 py-2 text-sm text-[#245642]">
            {callbackMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[16px] border border-dashed border-[#DEDED5] bg-[#F7F6F2] p-6 text-center text-[#727970]">
            Cargando reservas...
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[#DEDED5] bg-[#F7F6F2] p-6 text-center text-[#727970]">
            No hay reservas para este filtro.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReservations.map((reservation) => {
              const startDate = new Date(reservation.startAt);
              const endDate = new Date(reservation.endAt);
              const isCancellable = reservation.status !== 'CANCELLED' && startDate.getTime() - Date.now() > 2 * 60 * 60 * 1000;

              return (
                <div key={reservation.id} className="flex flex-col gap-4 rounded-[16px] border border-[#DEDED5] bg-[#F7F6F2] p-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-[-0.04em] text-[#222D28]">{reservation.space?.name ?? 'Espacio'}</h3>
                      <span className="rounded-full bg-[#EAF1E9] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#245642]">
                        {reservation.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#727970]">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#245642]" />{formatDate(startDate)}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#245642]" />{reservation.space?.type ?? 'Espacio'}</span>
                    </div>
                    <div className="text-sm text-[#727970]">Horario: {formatRange(startDate, endDate)}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.12em] text-[#727970]">Importe</div>
                      <div className="text-xl font-semibold tracking-[-0.04em] text-[#222D28]">€{Number(reservation.totalPrice || 0).toFixed(2)}</div>
                    </div>
                    {isCancellable ? (
                      <button
                        type="button"
                        onClick={() => {
                          void handleCancel(reservation.id);
                        }}
                        className="inline-flex items-center justify-center rounded-[10px] border border-[#D9B7B4] bg-[#F7E5E3] px-3 py-2 text-sm font-semibold text-[#A33B32] transition hover:bg-[#F3D9D5]"
                      >
                        Cancelar reserva
                      </button>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-[10px] border border-[#DEDED5] bg-white px-3 py-2 text-sm font-medium text-[#727970]">
                        No cancelable
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Cuenta</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-[14px] border border-[#DEDED5] bg-[#F7F6F2] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1E9] text-[#245642]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-[#222D28]">Protección de cuenta</div>
                <div className="text-sm text-[#727970]">Tus reservas se gestionan con control de acceso real</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-[14px] border border-[#DEDED5] bg-[#F7F6F2] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1E9] text-[#245642]">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold text-[#222D28]">Métodos de pago</div>
                <div className="text-sm text-[#727970]">Configuración gestionada por tu cuenta</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
