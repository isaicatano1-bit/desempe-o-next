import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserRound } from 'lucide-react';

import { Header } from '@/components/explorar/Header';
import { authCookieNames, getAuthenticatedUserFromAccessToken } from '@/lib/auth/session';

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    redirect('/login?next=/dashboard');
  }

  const user = await getAuthenticatedUserFromAccessToken(accessToken);

  if (user.role === 'ADMIN') {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#222D28]">
      <Header variant="user" />
      <div className="mx-auto flex max-w-[1440px] gap-6 px-5 py-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 rounded-[18px] border border-[#DEDED5] bg-white p-4 shadow-[0_10px_24px_rgba(22,31,26,0.04)] lg:block">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF1E9] text-[#245642]">
              <UserRound className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#222D28]">Mi cuenta</div>
              <div className="text-xs text-[#727970]">Perfil</div>
            </div>
          </div>

          <nav className="space-y-2 text-sm text-[#727970]">
            <Link href="/dashboard" className="block rounded-[10px] bg-[#EAF1E9] px-3 py-2 font-medium text-[#245642]">
              Mis reservas
            </Link>
            <Link href="/dashboard" className="block rounded-[10px] px-3 py-2 transition hover:bg-[#F5F5F2] hover:text-[#222D28]">
              Favoritos
            </Link>
            <Link href="/dashboard" className="block rounded-[10px] px-3 py-2 transition hover:bg-[#F5F5F2] hover:text-[#222D28]">
              Historial
            </Link>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
