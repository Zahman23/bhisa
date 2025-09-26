import type { SortKey } from "../stores/searhResultStore";
import type { FlatDeparture } from "./types";

export function applyFilterSort(
  rows: FlatDeparture[],
  opts: { maxHarga?: number; sortKey: SortKey }
): FlatDeparture[] {
  let out = rows;

  if (typeof opts.maxHarga === "number" && !Number.isNaN(opts.maxHarga)) {
    out = out.filter((r) => r.harga <= opts.maxHarga!);
  }

  if (opts.sortKey === "default") return out;

  const s = [...out];
  switch (opts.sortKey) {
    case "seats_desc":
      s.sort((a, b) => b.sisaKursi - a.sisaKursi || a.harga - b.harga);
      break;
    case "seats_asc":
      s.sort((a, b) => a.sisaKursi - b.sisaKursi || a.harga - b.harga);
      break;
    case "duration_asc":
      s.sort((a, b) => a.durasiMenit - b.durasiMenit || a.harga - b.harga);
      break;
    case "duration_desc":
      s.sort((a, b) => b.durasiMenit - a.durasiMenit || a.harga - b.harga);
      break;
    case "price_desc":
      s.sort((a, b) => b.harga - a.harga || a.durasiMenit - b.durasiMenit);
      break;
    case "price_asc":
    default:
      s.sort((a, b) => a.harga - b.harga || a.durasiMenit - b.durasiMenit);
      break;
  }
  return s;
}
