import { ArrowRight } from 'lucide-react';

import { SpaceCard } from '@/components/explorar/SpaceCard';
import type { PublicSpace } from '@/lib/public-spaces';

export function SpaceList({ spaces }: { spaces: PublicSpace[] }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-[#222D28]">12 espacios en Madrid</h2>
          <p className="mt-1 text-sm text-[#727970]">18 abr · 09:00–18:00 · 4 personas</p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-[10px] border border-[#DEDED5] bg-white px-3 py-2 text-sm font-medium text-[#222D28] shadow-sm transition hover:border-[#C9C9BF]">
          Recomendados
          <ArrowRight className="h-4 w-4 rotate-90" />
        </button>
      </div>

      <div className="space-y-5">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-[#727970]">Mostrando 3 de 12 espacios</div>
        <button className="rounded-[10px] border border-[#245642] bg-white px-4 py-2.5 text-sm font-semibold text-[#245642] transition hover:bg-[#F6F8F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245642] focus-visible:ring-offset-2">
          Ver más espacios
        </button>
      </div>
    </div>
  );
}
