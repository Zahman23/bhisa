import type { Query, Shuttle, FlatDeparture } from "./types";

const RESULTS_KEY = "bhisa.search.results";
const QUERY_KEY = "bhisa.search.query";

export async function fetchShuttles(): Promise<Shuttle[]> {
  // file berada di public/data/shuttles.json → ter-serve di /data/shuttles.json
  const res = await fetch("/data/shuttles.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Gagal load shuttles.json: ${res.status}`);
  return res.json();
}

/** normalize string (trim & case-sensitive match) */
const norm = (s: string) => (s ?? "").trim();

/** cari departures sesuai query; sisaKursi >= kursi */
export async function findDepartures(q: Query): Promise<FlatDeparture[]> {
  const data = await fetchShuttles();
  const asal = norm(q.asal);
  const tujuan = norm(q.tujuan);
  const tanggal = norm(q.tanggal);

  const matches = data.filter(
    (s) =>
      norm(s.origin) === asal &&
      norm(s.destination) === tujuan &&
      norm(s.tanggal) === tanggal
  );

  const flat: FlatDeparture[] = [];
  for (const s of matches) {
    for (const d of s.departures) {
      if (d.sisaKursi >= (q.kursi ?? 1)) {
        flat.push({
          ...d,
          shuttleId: s.id,
          operator: s.operator,
          origin: s.origin,
          destination: s.destination,
          tanggal: s.tanggal,
        });
      }
    }
  }
  return flat;
}

/** simpan hasil ke localStorage agar bisa di-sort/filter tanpa refetch */
export function saveResults(q: Query, rows: FlatDeparture[]) {
  localStorage.setItem(QUERY_KEY, JSON.stringify(q));
  localStorage.setItem(
    RESULTS_KEY,
    JSON.stringify({
      updatedAt: new Date().toISOString(),
      count: rows.length,
      rows,
    })
  );
}

export function loadResults(): {
  updatedAt: string;
  count: number;
  rows: FlatDeparture[];
} | null {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loadLastQuery(): Query | null {
  try {
    const raw = localStorage.getItem(QUERY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function deleteResult() {
  try {
    localStorage.removeItem(QUERY_KEY);
    localStorage.removeItem(RESULTS_KEY);
  } catch (error) {
    console.log(error);
  }
}
