
export type LicenceState = 'valid' | 'expiring' | 'expired';

export const LICENCE_WARNING_DAYS = 30; // "expiring soon" window

/** Local midnight today, so day counts don't drift with the time of day. */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseIsoDate(iso: string): Date | null {
  const [y, m, d] = (iso ?? '').split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

export function licenceStatus(validity: string, today: Date): { state: LicenceState; label: string } {
  const expiry = parseIsoDate(validity);
  if (!expiry) return { state: 'valid', label: '' };

  const days = Math.round((expiry.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return { state: 'expired', label: 'Expired' };
  if (days > LICENCE_WARNING_DAYS) return { state: 'valid', label: '' };

  const label = days === 0 ? 'Expires today' : days === 1 ? '1 day left' : `${days} days left`;
  return { state: 'expiring', label };
}