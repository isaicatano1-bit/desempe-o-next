export const DEFAULT_RESERVATION_HOLD_MINUTES = 10;

export function getReservationHoldDurationMinutes(value?: number): number {
  const raw = value ?? Number(process.env.RESERVATION_HOLD_DURATION_MINUTES ?? DEFAULT_RESERVATION_HOLD_MINUTES);

  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_RESERVATION_HOLD_MINUTES;
  }

  return Math.min(Math.max(Math.round(raw), 1), 1440);
}
