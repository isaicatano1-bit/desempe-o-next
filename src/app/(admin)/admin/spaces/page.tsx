'use client';

import { useEffect, useState } from 'react';

const typeLabels: Record<string, string> = {
  DESK: 'Escritorio',
  MEETING_ROOM: 'Sala de reuniones',
  PHONE_BOOTH: 'Cabina telefónica',
};

const emptyForm = {
  name: '',
  description: '',
  type: 'DESK',
  capacity: 1,
  hourlyPrice: 12,
  isActive: true,
};

type SpaceFormState = typeof emptyForm;

type SpaceItem = {
  id: string;
  name: string;
  description: string;
  type: 'DESK' | 'MEETING_ROOM' | 'PHONE_BOOTH';
  capacity: number;
  hourlyPrice: number | string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SpaceFormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchSpaces = async () => {
    try {
      const response = await fetch('/api/v1/spaces?includeInactive=true&pageSize=50', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      });

      const payload = await response.json().catch(() => ({ data: { items: [] } }));

      if (!response.ok) {
        throw new Error(payload.message ?? 'No se pudieron cargar los espacios.');
      }

      const items = Array.isArray(payload?.data?.items) ? payload.data.items : [];
      setSpaces(items as SpaceItem[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los espacios.');
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSpaces();
  }, []);

  const handleFieldChange = (field: keyof SpaceFormState, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    const payload = {
      ...form,
      capacity: Number(form.capacity),
      hourlyPrice: Number(form.hourlyPrice),
    };

    try {
      const url = editingId ? `/api/v1/spaces/${editingId}` : '/api/v1/spaces';
      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const details = result.errors ? Object.values(result.errors).flat().join(' ') : result.message;
        throw new Error(details || 'No se pudo guardar el espacio.');
      }

      setNotice(editingId ? 'Espacio actualizado correctamente.' : 'Espacio creado correctamente.');
      resetForm();
      await fetchSpaces();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el espacio.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (space: SpaceItem) => {
    setEditingId(space.id);
    setForm({
      name: space.name,
      description: space.description,
      type: space.type,
      capacity: Number(space.capacity),
      hourlyPrice: Number(space.hourlyPrice),
      isActive: space.isActive,
    });
    setError(null);
    setNotice(null);
  };

  const handleToggleActive = async (space: SpaceItem) => {
    try {
      const response = await fetch(`/api/v1/spaces/${space.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ isActive: !space.isActive }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message ?? 'No se pudo cambiar el estado del espacio.');
      }

      setNotice(space.isActive ? 'Espacio desactivado correctamente.' : 'Espacio activado correctamente.');
      await fetchSpaces();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'No se pudo cambiar el estado del espacio.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este espacio?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/spaces/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message ?? 'No se pudo eliminar el espacio.');
      }

      setNotice('Espacio eliminado correctamente.');
      if (editingId === id) {
        resetForm();
      }
      await fetchSpaces();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el espacio.');
    }
  };

  return (
    <main className="space-y-6">
      <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Catálogo</div>
            <h1 className="mt-2 text-[2.15rem] font-semibold tracking-[-0.06em] text-[#222D28]">Espacios</h1>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] border border-[#DEDED5] bg-[#F7F6F2] px-4 py-2.5 text-sm font-semibold text-[#222D28] transition hover:bg-[#F0F2EE]"
          >
            {editingId ? 'Cancelar edición' : 'Limpiar formulario'}
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <h2 className="text-xl font-semibold tracking-[-0.04em] text-[#222D28]">
            {editingId ? 'Editar espacio' : 'Nuevo espacio'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#222D28]">Nombre</span>
              <input
                value={form.name}
                onChange={(event) => handleFieldChange('name', event.target.value)}
                className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
                placeholder="Sala 3"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#222D28]">Descripción</span>
              <textarea
                value={form.description}
                onChange={(event) => handleFieldChange('description', event.target.value)}
                className="min-h-[100px] w-full rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
                placeholder="Espacio ideal para reuniones de 4 a 6 personas."
                required
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#222D28]">Tipo</span>
                <select
                  value={form.type}
                  onChange={(event) => handleFieldChange('type', event.target.value)}
                  className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
                >
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#222D28]">Capacidad</span>
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(event) => handleFieldChange('capacity', Number(event.target.value) || 1)}
                  className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#222D28]">Precio/hora</span>
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={form.hourlyPrice}
                  onChange={(event) => handleFieldChange('hourlyPrice', Number(event.target.value) || 0)}
                  className="w-full min-h-[44px] rounded-[12px] border border-[#DEDED5] bg-white px-3 py-2.5 text-sm text-[#222D28] focus:border-[#245642] focus:outline-none focus:ring-2 focus:ring-[#245642]/20"
                  required
                />
              </label>

              <label className="flex items-end">
                <span className="w-full rounded-[12px] border border-[#DEDED5] bg-[#F7F6F2] p-3 text-sm text-[#222D28]">
                  <span className="mb-2 block font-medium">Estado</span>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(event) => handleFieldChange('isActive', event.target.checked)}
                    />
                    Activo
                  </label>
                </span>
              </label>
            </div>

            {error ? (
              <div className="rounded-[12px] border border-[#F1D4D1] bg-[#F6E4E1] px-3 py-2 text-sm text-[#A33B32]">{error}</div>
            ) : null}

            {notice ? (
              <div className="rounded-[12px] border border-[#D9E9D5] bg-[#EEF5EC] px-3 py-2 text-sm text-[#245642]">{notice}</div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[46px] w-full items-center justify-center rounded-[10px] bg-[#245642] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d473a] disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear espacio'}
            </button>
          </form>
        </section>

        <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.04em] text-[#222D28]">Listado</h2>
            <span className="rounded-full bg-[#EAF1E9] px-2.5 py-1 text-xs font-medium uppercase tracking-[0.12em] text-[#245642]">
              {spaces.length} espacios
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-[12px] bg-[#F0F0EC]" />
              ))}
            </div>
          ) : spaces.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[#D2D7D0] bg-[#F7F6F2] p-8 text-center text-sm text-[#727970]">
              Todavía no hay espacios creados.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[14px] border border-[#DEDED5]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-[#222D28]">
                  <thead className="bg-[#F7F6F2] text-[#727970]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nombre</th>
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium">Capacidad</th>
                      <th className="px-4 py-3 font-medium">Precio</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spaces.map((space) => (
                      <tr key={space.id} className="border-t border-[#DEDED5] align-top">
                        <td className="px-4 py-3">
                          <div className="font-semibold">{space.name}</div>
                          <div className="mt-1 max-w-[220px] text-xs text-[#727970]">{space.description}</div>
                        </td>
                        <td className="px-4 py-3">{typeLabels[space.type] ?? space.type}</td>
                        <td className="px-4 py-3">{space.capacity}</td>
                        <td className="px-4 py-3">€{Number(space.hourlyPrice).toFixed(2)}/h</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${space.isActive ? 'bg-[#EAF1E9] text-[#245642]' : 'bg-[#F4EFE8] text-[#7A5C39]'}`}>
                            {space.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(space)}
                              className="rounded-[8px] border border-[#DEDED5] bg-white px-2.5 py-1.5 text-xs font-medium text-[#222D28] hover:bg-[#F7F6F2]"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(space)}
                              className="rounded-[8px] border border-[#D7E7D1] bg-[#EAF1E9] px-2.5 py-1.5 text-xs font-medium text-[#245642] hover:bg-[#DFECD9]"
                            >
                              {space.isActive ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(space.id)}
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
      </div>
    </main>
  );
}
