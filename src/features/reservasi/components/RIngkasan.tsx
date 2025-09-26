import { useReservationStore } from "../stores/reservasiStore";
import { useCountdown } from "../hooks/useCountdown";
import { idr } from "../../../utils/currency";

interface RingkasanProps {
  aria: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  className?: string;
}

const Ringkasan = ({
  isSubmitting,
  onSubmit,
  aria,
  className,
}: RingkasanProps) => {
  const { dep, totalAfter, totalBefore, discount, deadline } =
    useReservationStore();
  const { expired } = useCountdown(deadline);
  return (
    <section className={className} aria-labelledby={aria}>
      <h2 id="summary" className="text-xl font-semibold">
        Ringkasan
      </h2>
      <div className="text-sm">
        <div className="flex justify-between">
          <span>Operator</span>
          <b>{dep?.operator ?? "-"}</b>
        </div>
        <div className="flex justify-between">
          <span>Rute</span>
          <b>{dep ? `${dep.origin} → ${dep.destination}` : "-"}</b>
        </div>
        <div className="flex justify-between">
          <span>Tanggal</span>
          <b>{dep?.tanggal ?? "-"}</b>
        </div>
        <div className="flex justify-between">
          <span>Waktu</span>
          <b>{dep ? `${dep.berangkat} → ${dep.tiba}` : "-"}</b>
        </div>
      </div>
      <hr />
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <b>{idr.format(totalBefore)}</b>
        </div>
        <div className="flex justify-between">
          <span>Diskon</span>
          <b className="text-emerald-600">-{idr.format(discount)}</b>
        </div>
        <div className="flex justify-between text-lg">
          <span>Total</span>
          <b>{idr.format(totalAfter)}</b>
        </div>
      </div>
      <button
        className="w-full py-2 rounded bg-brand text-black disabled:opacity-50"
        onClick={onSubmit}
        disabled={expired || isSubmitting}
        aria-disabled={expired || isSubmitting}
      >
        {isSubmitting ? "Memproses…" : "Lanjut Pembayaran"}
      </button>
      {expired && (
        <p className="text-xs text-red-600" tabIndex={-1} aria-live="assertive">
          Waktu habis. Silakan ulangi pemesanan.
        </p>
      )}
    </section>
  );
};

export default Ringkasan;
