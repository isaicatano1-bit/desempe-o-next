import Link from 'next/link';

const quickStats = [
  { label: 'Espacios activos', value: '12', hint: 'Disponibles para reservas' },
  { label: 'Reservas hoy', value: '38', hint: 'Confirmadas y en espera' },
  { label: 'Ingresos del día', value: '€1.240', hint: 'Facturación estimada' },
];

export default function AdminPage() {
  return (
    <main className="space-y-8">
      <section className="rounded-[20px] border border-[#DEDED5] bg-white p-8 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Administración</div>
        <h1 className="mt-3 text-[2.25rem] font-semibold tracking-[-0.06em] text-[#222D28]">Panel de administración</h1>
        <p className="mt-3 max-w-2xl text-base text-[#727970]">
          Gestiona la disponibilidad y la operación del espacio con una vista centralizada de reservas y equipos.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat) => (
          <div key={stat.label} className="rounded-[18px] border border-[#DEDED5] bg-white p-5 shadow-[0_8px_18px_rgba(18,29,24,0.03)]">
            <div className="text-sm text-[#727970]">{stat.label}</div>
            <div className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-[#222D28]">{stat.value}</div>
            <div className="mt-2 text-sm text-[#727970]">{stat.hint}</div>
          </div>
        ))}
      </section>

      <section className="rounded-[20px] border border-[#DEDED5] bg-white p-6 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.04em] text-[#222D28]">Operación</h2>
            <p className="mt-1 text-sm text-[#727970]">Controla el catálogo y la disponibilidad de espacios.</p>
          </div>

          <Link
            href="/admin/spaces"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#245642] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d473a]"
          >
            Gestionar espacios
          </Link>
        </div>
      </section>
    </main>
  );
}
