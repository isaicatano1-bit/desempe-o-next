import { LogOut } from 'lucide-react';
import { LanguageToggle } from '@/components/explorar/LanguageToggle';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { authCookieNames, getAuthenticatedUserFromAccessToken } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    redirect('/login?next=/admin');
  }

  const user = await getAuthenticatedUserFromAccessToken(accessToken);

  if (user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#222D28]">
      <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-[18px] border border-[#DEDED5] bg-white p-4 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#727970]">Panel</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.05em] text-[#222D28]">Administración</h1>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <form action="/api/v1/auth/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#DEDED5] bg-[#F7F6F2] px-3 py-2 text-sm font-semibold text-[#222D28] transition hover:bg-[#F0F2EE]"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
