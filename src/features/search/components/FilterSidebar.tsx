import { useEffect, useState } from "react";
import {
  useSearchResultsStore,
  type SortKey,
} from "../stores/searhResultStore";

const nf = new Intl.NumberFormat("id-ID");

export default function FilterSidebar() {
  const setMax = useSearchResultsStore((s) => s.setFilterMaxHarga);
  const setSortKey = useSearchResultsStore((s) => s.setSortKey);
  const currentMax = useSearchResultsStore((s) => s.filterMaxHarga);
  const currentSort = useSearchResultsStore((s) => s.sortKey);

  // masked input string yang mengandung titik ribuan
  const [masked, setMasked] = useState<string>(
    currentMax ? nf.format(currentMax) : ""
  );

  // sinkron saat state luar berubah (mis. tombol Reset)
  useEffect(() => {
    setMasked(currentMax != null ? nf.format(currentMax) : "");
  }, [currentMax]);

  // handler: ketik -> simpan number murni ke store, tampilkan masked di input
  function handleMaskedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, ""); // buang non-digit
    if (!digits) {
      setMasked("");
      setMax(undefined); // filter off
      return;
    }
    const num = parseInt(digits, 10);
    setMasked(nf.format(num)); // tampil 120.000
    setMax(Number.isNaN(num) ? undefined : num); // store angka murni
  }
  return (
    <div className="border rounded p-4 sticky top-6">
      <h2 className="font-semibold mb-3">Filter & Urutkan</h2>
      <div className="space-y-3">
        {/* Filter: Maks Harga */}
        <div className="flex flex-col">
          <label htmlFor="maxHarga" className="text-sm mb-1">
            Maks Harga (Rp)
          </label>
          <div className="space-x-2 space-y-3">
            <input
              id="maxHarga"
              type="numeric"
              min={0}
              placeholder="cth: 120000"
              className="border rounded px-3 py-2 w-48"
              value={masked}
              onChange={handleMaskedChange}
            />
            <button
              type="button"
              onClick={() => {
                setMasked("");
                setMax(undefined);
              }}
              className="px-3 py-2 rounded border"
              title="Reset"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="flex flex-col">
          <label htmlFor="sortKey" className="text-sm mb-1">
            Urutkan
          </label>
          <select
            id="sortKey"
            className="border rounded px-3 py-2"
            value={currentSort}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="default">Pilih Urutan</option>
            <optgroup label="Harga">
              <option value="price_asc">Termurah</option>
              <option value="price_desc">Termahal</option>
            </optgroup>
            <optgroup label="Durasi">
              <option value="duration_asc">Tercepat</option>
              <option value="duration_desc">Terlama</option>
            </optgroup>
            <optgroup label="Sisa Kursi">
              <option value="seats_desc">Terbanyak</option>
              <option value="seats_asc">Tersedikit</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}
