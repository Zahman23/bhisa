export type Query = {
  asal: string;
  tujuan: string;
  tanggal: string; // yyyy-mm-dd
  kursi: number;
};
export type Source = "shuttle" | "searchArea" | "popular";

export function buildSearchParams(q: Query, source?: Source) {
  const sp = new URLSearchParams({
    asal: q.asal,
    tujuan: q.tujuan,
    tanggal: q.tanggal,
    kursi: String(q.kursi ?? 1),
    source: source ?? "searchArea",
    submitted: "1",
  });
  return sp;
}

export function parseQuery(params: URLSearchParams): Partial<Query> {
  const kursiNum = Number(params.get("kursi") ?? "1");
  return {
    asal: params.get("asal") ?? "",
    tujuan: params.get("tujuan") ?? "",
    tanggal: params.get("tanggal") ?? "",
    kursi: Number.isNaN(kursiNum) ? 1 : kursiNum,
  };
}

export const todayISO = () => new Date().toISOString().slice(0, 10);
