import { MapPin } from 'lucide-react';

import { NextMeetingCard } from '@/components/explorar/NextMeetingCard';

export function MapPanel() {
  return (
    <aside className="w-full lg:sticky lg:top-6 lg:self-start">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[1.6rem] font-semibold tracking-[-0.05em] text-[#222D28]">Zona de búsqueda</h2>
      </div>

      <div className="relative overflow-hidden rounded-[20px] border border-[#DEDED5] bg-[#EBEDE4] shadow-[0_12px_30px_rgba(39,48,40,0.08)]">
        <div className="relative h-[390px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(121,147,105,0.12),transparent_26%),radial-gradient(circle_at_73%_60%,rgba(121,147,105,0.18),transparent_24%),linear-gradient(90deg,#F3F5EE_0%,#EBEDE4_100%)]" />

          <div className="absolute inset-0 opacity-90">
            <div className="absolute left-[8%] top-[18%] h-32 w-[54%] rounded-[40%] bg-[#D8E0CC]" />
            <div className="absolute left-[44%] top-[7%] h-[62%] w-[30%] rounded-[50%] bg-[#D8E0CC]" />
            <div className="absolute bottom-[18%] left-[12%] h-[28%] w-[40%] rounded-[44%] bg-[#D8E0CC]" />
            <div className="absolute right-[12%] top-[22%] h-[28%] w-[22%] rounded-[40%] bg-[#D8E0CC]" />

            <div className="absolute left-3 right-3 top-0 bottom-0">
              <div className="absolute left-[18%] top-[8%] h-[70%] w-1 rounded-full bg-white/90" />
              <div className="absolute left-[38%] top-[4%] h-[80%] w-1 rounded-full bg-white/90" />
              <div className="absolute left-[62%] top-[6%] h-[76%] w-1 rounded-full bg-white/90" />
              <div className="absolute left-[14%] top-[44%] h-1 w-[70%] rounded-full bg-white/90" />
              <div className="absolute left-[18%] top-[62%] h-1 w-[58%] rounded-full bg-white/90" />
              <div className="absolute left-[48%] top-[28%] h-1 w-[34%] rounded-full bg-white/90" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-[#D5D9CF] bg-white/80 px-2 py-1.5 text-xs text-[#727970] backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-[#245642]" />
            Mapa orientativo
          </div>
        </div>
      </div>

      <NextMeetingCard />
    </aside>
  );
}
