import { Building2 } from 'lucide-react';
import { LanguageToggle } from '@/components/explorar/LanguageToggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F7F6F2] px-4 py-10 text-[#222D28] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[420px] flex-col items-center">
        <div className="mb-4 flex w-full justify-end"><LanguageToggle /></div>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#245642] text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="text-[1.9rem] font-semibold tracking-[-0.06em] text-[#222D28]">CoSpace</div>
        </div>

        {children}
      </div>
    </main>
  );
}
