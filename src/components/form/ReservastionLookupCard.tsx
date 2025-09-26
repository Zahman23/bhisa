import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrderById,
  getOrderByJamId,
} from "../../features/common/storage/ordersStorage";

function isLikelyJamId(s: string) {
  // contoh pola: "BB-22-1300" (huruf2)-(2digit)-(4digit)
  return /^[A-Z]{2}-\d{2}-\d{4}$/i.test(s.trim());
}

export default function ReservationLookupCard() {
  const nav = useNavigate();
  const [tab, setTab] = useState<"reservasi" | "tiket">("reservasi");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const waHref = (() => {
    const msg = encodeURIComponent(
      tab === "reservasi"
        ? `Halo, saya mau cek reservasi dengan kode jadwal: ${
            code || "<kosong>"
          }`
        : `Halo, saya mau cek tiket dengan Order ID: ${code || "<kosong>"}`
    );
    return `https://wa.me/6281234567890?text=${msg}`;
  })();

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const c = code.trim();
    if (!c) {
      setErr("Kode wajib diisi");
      return;
    }

    setLoading(true);
    try {
      if (tab === "reservasi") {
        const byJam = getOrderByJamId(c);
        if (byJam) {
          const sp = new URLSearchParams({ orderId: byJam.orderId });
          nav({ pathname: "/payment", search: `?${sp.toString()}` });
          return;
        }
        // fallback: arahkan ke halaman reserve pakai param id (sesuai instruksi kamu)
        if (isLikelyJamId(c)) {
          const sp = new URLSearchParams({ id: c });
          nav({ pathname: "/reserve", search: `?${sp.toString()}` });
          return;
        }
        setErr("Reservasi tidak ada.");
        return;
      } else {
        const byOrder = getOrderById(c);
        if (byOrder) {
          const sp = new URLSearchParams({ orderId: byOrder.orderId });
          nav({ pathname: "/payment", search: `?${sp.toString()}` });
          return;
        }
        setErr("Tiket tidak ditemukan.");
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="cek-reservasi"
      className="border rounded p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 id="cek-reservasi" className="text-lg font-semibold">
          Cek Reservasi / Tiket
        </h2>
        <div className="inline-flex rounded border overflow-hidden">
          <button
            type="button"
            className={`px-3 py-2 text-sm ${
              tab === "reservasi" ? "bg-gray-900 text-white" : "bg-white"
            }`}
            onClick={() => {
              setTab("reservasi");
              setErr(null);
            }}
            aria-pressed={tab === "reservasi"}
          >
            Reservasi
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-sm ${
              tab === "tiket" ? "bg-gray-900 text-white" : "bg-white"
            }`}
            onClick={() => {
              setTab("tiket");
              setErr(null);
            }}
            aria-pressed={tab === "tiket"}
          >
            Tiket
          </button>
        </div>
      </div>

      <form onSubmit={onSearch} className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-8">
          <label htmlFor="lookup-code" className="block text-sm mb-1">
            {tab === "reservasi"
              ? "Kode Jadwal/Jam (contoh: BB-22-1300)"
              : "Order ID (contoh: ORD-1758847725232)"}
          </label>
          <input
            id="lookup-code"
            className={`w-full border rounded px-3 py-2 ${
              err ? "border-red-500" : ""
            }`}
            placeholder={tab === "reservasi" ? "BB-22-1300" : "ORD-..."}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-invalid={!!err}
          />
        </div>
        <div className="col-span-6 md:col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full bg-brand text-black rounded px-4 py-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Mencari..." : "Cari"}
          </button>
        </div>
        <div className="col-span-6 md:col-span-2 flex items-end">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="w-full border rounded px-4 py-2 text-center"
          >
            Chat/WhatsApp
          </a>
        </div>
        {err && (
          <p className="col-span-12 text-red-600" role="alert">
            {err}
          </p>
        )}
      </form>

      {/* Hint kecil */}
      <p className="text-xs text-gray-500">
        - “Reservasi” mencari berdasarkan <b>kode jadwal/jam</b> (
        <code>jamId</code>) di riwayat pemesanan Anda.
        <br />- “Tiket” mencari berdasarkan <b>Order ID</b> (
        <code>ORD-...</code>). Jika ketemu, Anda akan diarahkan ke halaman
        pembayaran/etiket.
      </p>
    </section>
  );
}
