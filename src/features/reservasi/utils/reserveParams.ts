import type { FlatDeparture } from "../../search/utils/types";

export function buildReserveParams(dep: FlatDeparture) {
  const sp = new URLSearchParams({
    id: dep.id,
    operator: dep.operator,
    origin: dep.origin,
    destination: dep.destination,
    tanggal: dep.tanggal,
  });
  return sp;
}

export function parseReserveParams(params: URLSearchParams, depId: string) {
  // Kembalikan FlatDeparture minimal (tanpa validasi berat)
  // const num = (k: string) => {
  //   const n = parseInt(params.get(k) || "", 10);
  //   return Number.isNaN(n) ? undefined : n;
  // };
  const str = (k: string) => params.get(k) || "";

  const required = ["operator", "origin", "destination", "tanggal"];
  const missing = required.find((k) => !params.get(k));
  if (missing) return null;

  return {
    id: depId,
    operator: str("operator"),
    origin: str("origin"),
    destination: str("destination"),
    tanggal: str("tanggal"),
  } as unknown as FlatDeparture;
}
