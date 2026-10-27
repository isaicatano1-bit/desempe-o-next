import Link from 'next/link';

import { Footer } from '@/components/explorar/Footer';
import { Header } from '@/components/explorar/Header';
import { SearchBar } from '@/components/explorar/SearchBar';
import { SpaceCard } from '@/components/explorar/SpaceCard';
import { getPublicSpaces } from '@/lib/public-spaces';

export default async function PublicSpacesPage() {
  const spaces = await getPublicSpaces();

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#222D28]">
      <Header variant="visitor" />
      <SearchBar />

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Catálogo</div>
            <h1 className="mt-2 text-[2.5rem] font-semibold tracking-[-0.06em] text-[#222D28]">Explorar espacios</h1>
          </div>

          <div className="rounded-[12px] border border-[#DEDED5] bg-white px-4 py-3 text-sm text-[#727970] shadow-sm">
            <span className="font-semibold text-[#222D28]">{spaces.length}</span> espacios en Madrid
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {['Sala de reuniones', 'Escritorio dedicado', 'Oficina privada'].map((type) => (
            <Link
              key={type}
              href={`/explorar?tipo=${encodeURIComponent(type)}`}
              className="rounded-[16px] border border-[#DEDED5] bg-white p-4 shadow-[0_10px_24px_rgba(22,31,26,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(36,86,66,0.08)]"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#727970]">Formato</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#222D28]">{type}</div>
            </Link>
          ))}
        </div>

        {spaces.length ? (
          <div className="space-y-5">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-dashed border-[#DEDED5] bg-white p-8 text-center text-[#727970]">
            No hay espacios disponibles en la base de datos.
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
