import { ArrowRight, MapPin } from 'lucide-react';
import { cookies } from 'next/headers';

import { reservationService } from '@/features/reservations/services/reservation.service';
import { authCookieNames, getAuthenticatedUserFromAccessToken } from '@/lib/auth/session';

function formatReservationWindow(startAt: Date, endAt: Date): string {
  const format = (value: Date) =>
    new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(value);

  return `${format(startAt)} – ${format(endAt)}`;
}

export async function NextMeetingCard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    return (
      <div className="mt-4 rounded-[16px] border border-[#DEDED5] bg-white p-4 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#727970]">Tu próxima reserva</div>
        <p className="mt-3 text-sm text-[#727970]">Inicia sesión para ver tu próxima reserva.</p>
      </div>
    );
  }

  try {
    const user = await getAuthenticatedUserFromAccessToken(accessToken);
    const result = await reservationService.listForUser(user.id, {
      page: 1,
      pageSize: 1,
      status: undefined,
    });

    const meeting = result.items[0];

    if (!meeting || !meeting.space) {
      return (
        <div className="mt-4 rounded-[16px] border border-[#DEDED5] bg-white p-4 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#727970]">Tu próxima reserva</div>
          <p className="mt-3 text-sm text-[#727970]">Todavía no tienes reservas activas.</p>
        </div>
      );
    }

    return (
      <div className="mt-4 rounded-[16px] border border-[#DEDED5] bg-white p-4 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#727970]">Tu próxima reserva</div>
          <span className="rounded-full bg-[#EAF1E9] px-2 py-1 text-[10px] font-semibold text-[#245642]">Activa</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[1.35rem] font-semibold tracking-[-0.05em] text-[#222D28]">{meeting.space.name}</div>
            <div className="mt-1 flex items-center gap-2 text-sm text-[#727970]">
              <MapPin className="h-4 w-4 text-[#245642]" />
              <span>{meeting.space.type}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.1em] text-[#727970]">Horario</div>
            <div className="mt-1 text-sm font-semibold text-[#222D28]">
              {formatReservationWindow(meeting.startAt, meeting.endAt)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#F0F0EA] pt-3 text-sm text-[#727970]">
          <span>{meeting.status}</span>
          <a href="/dashboard" className="inline-flex items-center gap-1 font-medium text-[#245642]">
            Ver detalle
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="mt-4 rounded-[16px] border border-[#DEDED5] bg-white p-4 shadow-[0_10px_24px_rgba(22,31,26,0.04)]">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#727970]">Tu próxima reserva</div>
        <p className="mt-3 text-sm text-[#727970]">No se pudo cargar tu próxima reserva.</p>
      </div>
    );
  }
}
