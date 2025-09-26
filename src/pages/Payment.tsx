import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getLatestOrder,
  getOrderById,
  saveOrder,
  type Order,
} from "../features/payment/utils/ordersStorage";
import Skeleton from "../components/global/Skeleton";

import {
  BANK_ACCOUNTS,
  BANKS,
  QR_PAYLOAD,
} from "../features/payment/utils/listBank";
import { useCountdown } from "../features/reservasi/hooks/useCountdown";
import CopyField from "../features/payment/components/CopyField";
import Accordion from "../features/payment/components/Accordion";
import { BackButton } from "../components/BackButton";
import Container from "../components/container";
import SummaryPayment from "../features/payment/components/SummaryPayment";
import { SummaryDrawer } from "../components/SummaryDrawer";

/* helpers */

/* data rekening/VA */

/* small atoms */

/* page */
export default function PaymentPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  // 1) Ambil orderId dari QUERY (BUKAN params)
  const orderId = sp.get("orderId") ?? ""; // ⬅️ ini sumber kebenaran

  // 2) Loading + load dari localStorage via useEffect
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    try {
      localStorage.removeItem("bhisa.reserve.current");
    } catch (e: unknown) {
      console.log(e as Error);
    }

    Promise.resolve().then(() => {
      if (canceled) return;
      // utama: cari by orderId dari query
      let o = orderId ? getOrderById(orderId) : undefined;

      // fallback opsional: pakai order terbaru kalau orderId tidak dikirim
      if (!o) o = getLatestOrder();

      setOrder(o);
      setLoading(false);
    });

    return () => {
      canceled = true;
    };
  }, [orderId]);

  // init tab dari query params (display only)
  const initialMethod =
    (sp.get("method") as "transfer" | "qris" | "va") || "transfer";
  const initialBank = (sp.get("bank") as (typeof BANKS)[number]) || "BCA";
  const [method, setMethod] = useState<"transfer" | "qris" | "va">(
    initialMethod
  );
  const [bank, setBank] = useState<(typeof BANKS)[number]>(initialBank);

  // countdown: 30 menit sejak createdAt
  const deadline = useMemo(
    () =>
      order ? new Date(order.createdAt).getTime() + 30 * 60 * 1000 : undefined,
    [order]
  );
  const { expired, mm, ss } = useCountdown(deadline);
  const srRef = useRef<HTMLDivElement>(null);

  const containerCls = "mx-auto w-full max-w-[1280px] px-6 md:px-8";

  /* skeletons */
  const SummarySkeleton = () => (
    <div className="border rounded p-4 space-y-3">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <hr />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
    </div>
  );
  const PanelSkeleton = () => (
    <div className="border rounded p-4 space-y-4">
      <Skeleton className="h-6 w-56" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-32 w-full" />
    </div>
  );

  // loading state
  if (!loading && !order) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b">
          <div className={containerCls}>
            <div className="h-14 flex items-center justify-between">
              <div className="text-lg font-semibold">Bhisa Shuttle</div>
              <div className="text-sm text-gray-600 hidden md:block">
                Pembayaran
              </div>
            </div>
          </div>
        </header>
        <main className={containerCls}>
          <div className="grid grid-cols-12 gap-6 py-6">
            <section className="col-span-12 lg:col-span-8 space-y-6">
              <div className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <Skeleton className="h-7 w-64" />
                  <Skeleton className="h-4 w-72 mt-2" />
                </div>
                <Skeleton className="h-10 w-28" />
              </div>
              <PanelSkeleton />
            </section>
            <aside className="col-span-12 lg:col-span-4">
              <SummarySkeleton />
            </aside>
          </div>
        </main>
      </div>
    );
  }

  // empty state jika order tidak ada
  if (!order) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-12">
        <div className="border rounded p-6 text-center space-y-3">
          <h1 className="text-2xl font-semibold">Tagihan tidak ditemukan</h1>
          <p className="text-gray-600">
            Order #{orderId} tidak tersedia. Silakan cari jadwal lagi.
          </p>
          <button
            className="px-4 py-2 rounded border"
            onClick={() => nav("/search")}
          >
            Kembali ke Pencarian
          </button>
        </div>
      </div>
    );
  }

  // status
  const isPaid = order.status === "paid";
  const isExpired = order.status === "expired" || expired;

  // mark paid/expired (update localStorage & state)
  function markPaid() {
    if (!order) return;
    const next = { ...order, status: "paid" as const };
    saveOrder(next);
    setOrder(next);
    srRef.current?.focus();
  }
  function markExpired() {
    if (!order) return;
    if (order.status === "expired") return;
    const next = { ...order, status: "expired" as const };
    saveOrder(next);
    setOrder(next);
    srRef.current?.focus();
  }
  if (expired && !isPaid && order.status !== "expired") {
    // optional: tandai expired saat ter-render habis waktu
    markExpired();
  }

  // panel info
  const acct = BANK_ACCOUNTS[bank];
  const panel =
    method === "transfer"
      ? {
          title: `Transfer Bank ${bank}`,
          number: acct.transfer,
          holder: acct.name,
        }
      : method === "va"
      ? { title: `Virtual Account ${bank}`, number: acct.va, holder: acct.name }
      : { title: "QRIS", number: QR_PAYLOAD, holder: "QRIS Nasional" };

  const tutorial =
    method === "transfer"
      ? [
          {
            id: "t1",
            title: `${bank} Mobile`,
            content: (
              <>
                1. Buka app {bank}.<br />
                2. Transfer ke rekening.
                <br />
                3. Masukkan nomor & nominal.
                <br />
                4. Konfirmasi.
              </>
            ),
          },
          {
            id: "t2",
            title: "ATM",
            content: (
              <>
                1. Masukkan kartu & PIN.
                <br />
                2. Pilih Transfer.
                <br />
                3. Masukkan nomor rekening.
                <br />
                4. Bayar.
              </>
            ),
          },
        ]
      : method === "va"
      ? [
          {
            id: "v1",
            title: `${bank} Mobile`,
            content: (
              <>
                1. Menu Pembayaran → VA.
                <br />
                2. Isi nomor VA.
                <br />
                3. Konfirmasi & bayar.
              </>
            ),
          },
          {
            id: "v2",
            title: "Internet Banking",
            content: (
              <>
                1. Login IB.
                <br />
                2. Menu VA.
                <br />
                3. Masukkan VA & bayar.
              </>
            ),
          },
        ]
      : [
          {
            id: "q1",
            title: "Cara Bayar via QRIS",
            content: (
              <>
                1. Buka e-wallet/bank.
                <br />
                2. Scan QR.
                <br />
                3. Pastikan nominal & penerima benar.
                <br />
                4. Bayar.
              </>
            ),
          },
        ];

  return (
    <Container title="Bhisa Shuttle" description="Pembayaran">
      <div className="sticky top-0 lg:relative bg-white lg:block py-2 flex justify-between">
        <BackButton />
        <SummaryDrawer>
          <SummaryPayment
            order={order}
            isExpired={isExpired}
            isPaid={isPaid}
            className="space-y-3"
          />
        </SummaryDrawer>
      </div>
      <div className="grid grid-cols-12 gap-6 py-6">
        {/* LEFT */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          {/* Banner + countdown */}
          <section aria-labelledby="tagihan">
            <div className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 id="tagihan" className="text-2xl font-semibold">
                  Tagihan #{order.orderId}
                </h1>
                <p className="text-sm">
                  {order.operator} — {order.route} • {order.tanggal} •{" "}
                  {order.qty} kursi
                </p>
              </div>
              <div
                ref={srRef}
                tabIndex={-1}
                className={`text-center px-3 py-2 rounded ${
                  isExpired
                    ? "bg-red-100 text-red-700"
                    : isPaid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
                aria-live="polite"
              >
                <div className="text-xs">
                  {isPaid
                    ? "Sudah dibayar"
                    : isExpired
                    ? "Waktu habis"
                    : "Selesaikan dalam"}
                </div>
                {!isPaid && !isExpired && (
                  <div className="font-mono text-xl">
                    {mm}:{ss}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Metode */}
          <section
            aria-labelledby="metode"
            className="border rounded p-4 space-y-4"
          >
            <h2 id="metode" className="text-xl font-semibold">
              Metode Pembayaran
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {(["transfer", "qris", "va"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`px-3 py-2 rounded border ${
                    method === m ? "bg-gray-900 text-white border-gray-900" : ""
                  }`}
                  onClick={() => setMethod(m)}
                  disabled={isPaid}
                  aria-pressed={method === m}
                >
                  {m === "transfer"
                    ? "Transfer Bank"
                    : m === "qris"
                    ? "QRIS"
                    : "Virtual Account"}
                </button>
              ))}
            </div>

            {/* Bank selector */}
            {(method === "transfer" || method === "va") && (
              <div className="flex flex-wrap gap-2">
                {BANKS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`px-3 py-2 rounded border ${
                      bank === b ? "bg-gray-100 border-gray-900" : ""
                    }`}
                    onClick={() => setBank(b)}
                    disabled={isPaid}
                    aria-pressed={bank === b}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}

            {/* Panel aktif */}
            <div className="rounded border p-4 space-y-3">
              <div className="font-medium">{panel.title}</div>

              {method === "qris" ? (
                <div className="space-y-2">
                  <div className="aspect-square w-48 bg-gray-200 grid place-items-center rounded">
                    <span className="text-xs text-gray-600">QR Code</span>
                  </div>
                  <CopyField label="Payload QRIS" value={panel.number} />
                </div>
              ) : (
                <>
                  <CopyField
                    label={
                      method === "transfer"
                        ? "No. Rekening"
                        : "No. Virtual Account"
                    }
                    value={panel.number}
                  />
                  <div className="text-sm text-gray-600">
                    Atas nama: <b>{panel.holder}</b>
                  </div>
                </>
              )}

              {/* Tutorial khusus metode aktif */}
              <Accordion items={tutorial} />

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!isPaid && !isExpired && (
                  <button
                    className="px-4 py-2 rounded bg-brand text-black"
                    onClick={markPaid}
                  >
                    Saya sudah bayar
                  </button>
                )}
                {isPaid && (
                  <a
                    className="px-4 py-2 rounded border"
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                      `E-Ticket ${order.orderId}\n${order.route}\n${
                        order.tanggal
                      }\nKursi: ${order.seats.join(", ")}`
                    )}`}
                    download={`e-ticket-${order.orderId}.txt`}
                  >
                    Unduh e-ticket
                  </a>
                )}
                {isExpired && !isPaid && (
                  <button
                    className="px-4 py-2 rounded border"
                    onClick={() => nav("/search")}
                  >
                    Cari jadwal lain
                  </button>
                )}
              </div>
            </div>
          </section>
        </section>

        {/* RIGHT sticky summary */}
        <aside className="col-span-12 lg:col-span-4 hidden lg:block">
          <SummaryPayment
            order={order}
            isExpired={isExpired}
            isPaid={isPaid}
            className="lg:sticky lg:top-6 border rounded p-4 space-y-3"
          />
        </aside>
      </div>
    </Container>
  );
}
