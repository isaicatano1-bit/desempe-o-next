'use client';

import { useEffect, useMemo, useState } from 'react';

const statusLabels: Record<string, string> = {
  CONFIRMED: 'Confirmada',
  IN_PROCESS: 'En proceso',
  CANCELLED: 'Cancelada',
};

type ReservationUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

type ReservationSpace = {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
};

type ReservationItem = {
  id: string;
  userId: string;
  spaceId: string;
  startAt: string;
  endAt: string;
  totalPrice: number | string;
  status: 'CONFIRMED' | 'IN_PROCESS' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  user?: ReservationUser;
  space?: ReservationSpace;
};

type ReservationFormState = {
  status: 'CONFIRMED' | 'IN_PROCESS' | 'CANCELLED';
  startAt: string;
  endAt: string;
};

const emptyReservationForm: ReservationFormState = {
  status: 'CONFIRMED',
  startAt: '',
  endAt: '',
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReservationFormState>(emptyReservationForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchReservations = async (): Promise<void> => {
    try {
      const response = await fetch('/api/v1/reservations?pageSize=100', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      const payload = await response.json().catch(() => ({ data: { items: [] } }));

      if (!response.ok) {
        throw new Error(payload.message ?? 'No se pudieron cargar las reservas.');
      }

      const items = Array.isArray(payload?.data?.items) ? payload.data.items : [];
      setReservations(items as ReservationItem[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar las reservas.');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchReservations();
  }, []);

  const totalRevenue = useMemo(
    () => reservations.reduce((sum, reservation) => sum + Number(reservation.totalPrice || 0), 0),
    [reservations],
  );

  const startEdit = (reservation: ReservationItem): void => {
    setEditingId(reservation.id);
    setForm({
      status: reservation.status,
      startAt: new Date(reservation.startAt).toISOString().slice(0, 16),
      endAt: new Date(reservation.endAt).toISOString().slice(0, 16),
    });
    setError(null);
    setNotice(null);
  };

  const resetEditor = (): void => {
    setEditingId(null);
    setForm(emptyReservationForm);
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!editingId) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`/api/v1/reservations/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          status: form.status,
          startAt: new Date(form.startAt).toISOString(),
          endAt: new Date(form.endAt).toISOString(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message ?? 'No se pudo actualizar la reserva.');
      }

      setNotice('Reserva actualizada correctamente.');
      resetEditor();
      await fetchReservations();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'No se pudo actualizar la reserva.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/v1/reservations/${id}/cancel`, {
        method: 'POST',
        credentials: 'same-origin',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message ?? 'No se pudo cancelar la reserva.');
      }

      setNotice('Reserva cancelada correctamente.');
      await fetchReservations();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'No se pudo cancelar la reserva.');
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('¿Seguro que quieres eliminar esta reserva?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/reservations/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message ?? 'No se pudo eliminar la reserva.');
      }

      setNotice('Reserva eliminada correctamente.');
      await fetchReservations();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar la reserva.');
    }
  };

  return (
    <main className="space-y-6">
      <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Operación</div>
            <h1 className="mt-2 text-[2.15rem] font-semibold tracking-[-0.06em] text-[#222D28]">Reservas</h1>
          </div>

          <div className="rounded-[14px] border border-[#DEDED5] bg-[#F7F6F2] px-4 py-3 text-sm text-[#222D28]">
            Facturación total: <span className="font-semibold">€{Number(totalRevenue).toFixed(2)}</span>
          </div>
        </div>
      </section>

      {editingId ? (
        <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.04em] text-[#222D28]">Editar reserva</h2>
            <button
              type="button"
              onClick={resetEditor}
              className="rounded-[10px] border border-[#DEDED5] bg-[#F7F6F2] px-3 py-2 text-sm font-medium text-[#222D28]"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleUpdate} className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#222D28]">Estado</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ReservationFormState['status'] }))}
                className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#222D28]">Inicio</span>
              <input
                type="datetime-local"
                value={form.startAt}
                onChange={(event) => setForm((current) => ({ ...current, startAt: event.target.value }))}
                className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#222D28]">Fin</span>
              <input
                type="datetime-local"
                value={form.endAt}
                onChange={(event) => setForm((current) => ({ ...current, endAt: event.target.value }))}
                className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
              />
            </label>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-[46px] items-center justify-center rounded-[10px] bg-[#245642] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d473a] disabled:opacity-60"
              >
                {submitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {error ? (
        <div className="rounded-[12px] border border-[#F1D4D1] bg-[#F6E4E1] px-3 py-2 text-sm text-[#A33B32]">{error}</div>
      ) : null}

      {notice ? (
        <div className="rounded-[12px] border border-[#D9E9D5] bg-[#EEF5EC] px-3 py-2 text-sm text-[#245642]">{notice}</div>
      ) : null}

      <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-[-0.04em] text-[#222D28]">Listado global</h2>
          <span className="rounded-full bg-[#EAF1E9] px-2.5 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#245642]">
            {reservations.length} reservas
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-[12px] bg-[#F0F0EC]" />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[#D2D7D0] bg-[#F7F6F2] p-8 text-center text-sm text-[#727970]">
            No hay reservas registradas.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-[#DEDED5]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-[#222D28]">
                <thead className="bg-[#F7F6F2] text-[#727970]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Usuario</th>
                    <th className="px-4 py-3 font-medium">Espacio</th>
                    <th className="px-4 py-3 font-medium">Horario</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-t border-[#DEDED5] align-top">
                      <td className="px-4 py-3">
                        <div className="font-semibold">{reservation.user?.name ?? 'Usuario'}</div>
                        <div className="mt-1 text-xs text-[#727970]">{reservation.user?.email ?? reservation.userId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{reservation.space?.name ?? 'Espacio'}</div>
                        <div className="mt-1 text-xs text-[#727970]">{reservation.space?.type ?? reservation.spaceId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{new Date(reservation.startAt).toLocaleString()}</div>
                        <div className="mt-1 text-xs text-[#727970]">hasta {new Date(reservation.endAt).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-3">€{Number(reservation.totalPrice).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            reservation.status === 'CONFIRMED'
                              ? 'bg-[#EAF1E9] text-[#245642]'
                              : reservation.status === 'IN_PROCESS'
                                ? 'bg-[#F4EFE8] text-[#7A5C39]'
                                : 'bg-[#F4E4E3] text-[#A33B32]'
                          }`}
                        >
                          {statusLabels[reservation.status] ?? reservation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(reservation)}
                            className="rounded-[8px] border border-[#DEDED5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#222D28] hover:bg-[#F7F6F2]"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancel(reservation.id)}
                            className="rounded-[8px] border border-[#D7E7D1] bg-[#EAF1E9] px-2.5 py-1.5 text-xs font-medium text-[#245642] hover:bg-[#DFECD9]"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(reservation.id)}
                            className="rounded-[8px] border border-[#E7D1CF] bg-[#F6E4E1] px-2.5 py-1.5 text-xs font-medium text-[#A33B32] hover:bg-[#F2D7D4]"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
