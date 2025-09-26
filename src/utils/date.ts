export const todayISO = () => new Date().toISOString().slice(0, 10);

export function notPastDate(yyyyMmDd: string) {
  if (!yyyyMmDd) return false;
  const today = todayISO();
  return yyyyMmDd >= today;
}
