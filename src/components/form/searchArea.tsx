// src/features/search/components/SearchArea.tsx
import { useEffect, useState } from "react";

const AREAS = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Cimahi",
  "Sumedang",
  "Garut",
  "Subang",
  "Karawang",
  "Purwakarta",
];
const notPastDate = (d: string) =>
  !!d && d >= new Date().toISOString().slice(0, 10);

export type Query = {
  asal: string;
  tujuan: string;
  tanggal: string;
  kursi: number;
};

export default function SearchArea({
  onSubmit,
  initialQuery,
  syncKey,
}: {
  onSubmit: (q: Query) => void;
  initialQuery?: Partial<Query>;
  /** ubah nilai ini (mis. pakai JSON.stringify(initialQuery)) untuk paksa sync ulang */
  syncKey?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [asal, setAsal] = useState(initialQuery?.asal ?? "");
  const [tujuan, setTujuan] = useState(initialQuery?.tujuan ?? "");
  const [tanggal, setTanggal] = useState(initialQuery?.tanggal ?? today);
  const [kursi, setKursi] = useState(initialQuery?.kursi ?? 1);
  const [err, setErr] = useState<string | undefined>();

  // sinkron saat initialQuery (via syncKey) berubah
  useEffect(() => {
    setAsal(initialQuery?.asal ?? "");
    setTujuan(initialQuery?.tujuan ?? "");
    setTanggal(initialQuery?.tanggal ?? today);
    setKursi(initialQuery?.kursi ?? 1);
    setErr(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey]);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!asal || !tujuan) return setErr("Asal & Tujuan wajib diisi");
    if (asal === tujuan) return setErr("Asal dan Tujuan tidak boleh sama");
    if (!notPastDate(tanggal)) return setErr("Tanggal tidak boleh kemarin");
    setErr(undefined);
    onSubmit({ asal, tujuan, tanggal, kursi });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
      <div className="md:col-span-3">
        <label className="block text-sm mb-1">Asal</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={asal}
          onChange={(e) => setAsal(e.target.value)}
        >
          <option value="">Pilih asal</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-3">
        <label className="block text-sm mb-1">Tujuan</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={tujuan}
          onChange={(e) => setTujuan(e.target.value)}
        >
          <option value="">Pilih tujuan</option>
          {AREAS.map((a) => (
            <option key={a} value={a} disabled={a === asal}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-3">
        <label className="block text-sm mb-1">Tanggal</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          min={today}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Kursi</label>
        <input
          type="number"
          min={1}
          max={6}
          className="w-full border rounded px-3 py-2"
          value={kursi}
          onChange={(e) => setKursi(parseInt(e.target.value || "1", 10))}
        />
      </div>
      <div className="md:col-span-1 flex items-end">
        <button
          className="w-full bg-brand text-black rounded px-4 py-2"
          type="submit"
        >
          Cari
        </button>
      </div>
      {err && (
        <p className="md:col-span-12 text-red-600" role="alert">
          {err}
        </p>
      )}
    </form>
  );
}
