// src/features/search/components/ResultsList.tsx

import { useNavigate } from "react-router-dom";
import { idr } from "../../../utils/currency";
import { useProcessedResults } from "../hooks/useProcessedResult";
import { useReservationStore } from "../../reservasi/stores/reservasiStore";
import { buildReserveParams } from "../../reservasi/utils/reserveParams";

export default function ResultsList() {
  const rows = useProcessedResults();
  const navigate = useNavigate();
  const initFromDeparture = useReservationStore((s) => s.initFromDeparture);

  if (!rows.length) return <p>Tidak ada keberangkatan yang cocok.</p>;

  return (
    <>
      {rows.map((it) => {
        const sp = buildReserveParams(it);
        return (
          <article
            key={it.id}
            className="border rounded p-4 grid grid-cols-12 gap-4"
            aria-label={`Shuttle ${it.operator} ${it.berangkat}`}
          >
            <div className="col-span-6">
              <h3 className="font-semibold">{it.operator}</h3>
              <p className="text-sm text-gray-600">
                {it.origin} → {it.destination}
              </p>
              <p className="mt-1">
                {it.berangkat} – {it.tiba} • {Math.round(it.durasiMenit / 60)}j
                {it.durasiMenit % 60 > 0 ? ` ${it.durasiMenit % 60}m` : ""}
              </p>
              <p className="text-sm text-gray-600">
                {it.pickup} → {it.dropoff}
              </p>
            </div>
            <div className="col-span-3 flex items-center">
              Sisa: {it.sisaKursi}
            </div>
            <div className="col-span-3 flex flex-col items-end justify-between">
              <div className="text-xl font-bold">{idr.format(it.harga)}</div>
              <button
                disabled={it.sisaKursi <= 0}
                onClick={() => {
                  // 1) isi store agar UI instan
                  initFromDeparture(it);
                  // 2) navigate dengan params lengkap
                  navigate({
                    pathname: `/reserve`,
                    search: `?${sp.toString()}`,
                  });
                }}
                className="mt-2 bg-brand text-black rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pilih
              </button>
            </div>
          </article>
        );
      })}
    </>
  );
}
