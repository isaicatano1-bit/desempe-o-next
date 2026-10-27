import { Clock3 } from 'lucide-react';

import { Footer } from '@/components/explorar/Footer';
import { Header } from '@/components/explorar/Header';
import { MapPanel } from '@/components/explorar/MapPanel';
import { SearchBar } from '@/components/explorar/SearchBar';
import { SpaceList } from '@/components/explorar/SpaceList';
import { getPublicSpaces } from '@/lib/public-spaces';

type ExplorarPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExplorarPage({ searchParams }: ExplorarPageProps) {
  const params = (await searchParams) ?? {};
  const type = typeof params.tipo === 'string' ? params.tipo : undefined;
  const capacity = typeof params.personas === 'string' ? Number(params.personas) : undefined;

  const spaces = await getPublicSpaces({
    type,
    capacity: Number.isFinite(capacity) ? capacity : undefined,
    limit: 12,
  });

  return (
    <main className="min-h-screen bg-[#F7F6F2] text-[#222D28]">
      <Header />
      <SearchBar />

      <section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[3rem] font-semibold tracking-[-0.07em] text-[#222D28] sm:text-[3.5rem]">Haz espacio para tus ideas.</h1>
            <p className="mt-2 max-w-xl text-base text-[#727970]">
              Encuentra tu entorno ideal para concentrarte, reunirte o crear sin fricción.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-[12px] border border-[#DEDED5] bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1E9] text-[#245642]">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#727970]">Disponibilidad</div>
              <div className="text-base font-semibold text-[#222D28]">Por horas. Sin permanencia.</div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.6fr_0.95fr]">
          <div className="min-w-0">
            <SpaceList spaces={spaces} />
          </div>

          <div>
            <MapPanel />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
