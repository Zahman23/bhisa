// src/features/search/utils/minDelay.ts
export async function minDelay<T>(p: Promise<T>, ms = 3000): Promise<T> {
  const [result] = await Promise.all([
    p,
    new Promise((r) => setTimeout(r, ms)),
  ]);
  return result;
}
