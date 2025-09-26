import type { Order } from "../utils/ordersStorage";
import { idr } from "../../../utils/currency";

interface SummaryPaymentProps {
  order: Order;
  isPaid: boolean;
  isExpired: boolean;
  className?: string;
}

const SummaryPayment = ({
  order,
  isExpired,
  isPaid,
  className = "",
}: SummaryPaymentProps) => {
  return (
    <section className={className} aria-labelledby="summary">
      <h2 id="summary" className="text-xl font-semibold">
        Ringkasan
      </h2>
      <div className="text-sm">
        <div className="flex justify-between">
          <span>Operator</span>
          <b>{order.operator}</b>
        </div>
        <div className="flex justify-between">
          <span>Rute</span>
          <b>{order.route}</b>
        </div>
        <div className="flex justify-between">
          <span>Tanggal</span>
          <b>{order.tanggal}</b>
        </div>
        <div className="flex justify-between">
          <span>Kursi</span>
          <b>{order.seats.join(", ")}</b>
        </div>
      </div>
      <hr />
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Harga/seat</span>
          <b>{idr.format(order.hargaPerSeat)}</b>
        </div>
        <div className="flex justify-between">
          <span>Jumlah</span>
          <b>{order.qty}</b>
        </div>
        {!!order.coupon?.discountPct && (
          <div className="flex justify-between">
            <span>Diskon</span>
            <b className="text-emerald-600">-{order.coupon.discountPct}%</b>
          </div>
        )}
        <div className="flex justify-between text-lg">
          <span>Total</span>
          <b>{idr.format(order.total)}</b>
        </div>
      </div>
      <div
        className={`px-3 py-2 rounded text-sm ${
          isPaid
            ? "bg-emerald-100 text-emerald-700"
            : isExpired
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        Status:{" "}
        <b className="capitalize">
          {isPaid ? "paid" : isExpired ? "expired" : "unpaid"}
        </b>
      </div>
    </section>
  );
};

export default SummaryPayment;
