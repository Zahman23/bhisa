// src/features/payment/store/paymentStore.ts
import { create } from "zustand";

type Order = {
  orderId: string;
  jamId: string;
  route: string;
  tanggal: string;
  total: number;
  qty: number;
  status: "unpaid" | "paid" | "expired";
  contact: { nama: string; email: string; whatsapp: string };
  passengers: { seat: string; nama: string; phone: string }[];
  seats: string[];
  operator: string;
  hargaPerSeat: number;
  coupon?: { code?: string; discountPct?: number };
  createdAt: string;
};

type State = {
  order?: Order;
  method: "transfer" | "qris" | "va";
  bank: "BCA" | "BRI" | "Mandiri" | "BNI"; // untuk transfer/VA
  deadline?: number;
  isCopying: boolean;
};

type Actions = {
  hydrate(orderId: string): boolean;
  setMethod(m: State["method"]): void;
  setBank(b: State["bank"]): void;
  markPaid(): void;
  setExpired(): void;
  setCopying(v: boolean): void;
};

const ORDERS_KEY = "bhisa.orders";
const RESERVE_KEY = "bhisa.reserve.current";

function readOrders(): Record<string, Order> {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function writeOrders(obj: Record<string, Order>) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(obj));
  } catch (e: unknown) {
    console.log(e as Error);
  }
}

export const usePaymentStore = create<State & Actions>((set, get) => ({
  order: undefined,
  method: "transfer",
  bank: "BCA",
  deadline: undefined,
  isCopying: false,

  hydrate(orderId) {
    // hapus draft reservasi saat masuk payment
    try {
      localStorage.removeItem(RESERVE_KEY);
    } catch (e: unknown) {
      console.log(e as Error);
    }

    const orders = readOrders();
    const o = orders[orderId];
    if (!o) return false;

    // hitung deadline default: 30 menit sejak dibuat (atau gunakan existing jika ada)
    const createdMs = new Date(o.createdAt).getTime();
    const dl = createdMs + 30 * 60 * 1000;

    set({ order: o, deadline: dl });
    return true;
  },

  setMethod(m) {
    set({ method: m });
  },
  setBank(b) {
    set({ bank: b });
  },

  markPaid() {
    const s = get();
    if (!s.order) return;
    const orders = readOrders();
    const updated: Order = { ...s.order, status: "paid" };
    orders[s.order.orderId] = updated;
    writeOrders(orders);
    set({ order: updated });
  },

  setExpired() {
    const s = get();
    if (!s.order) return;
    const orders = readOrders();
    const updated: Order = { ...s.order, status: "expired" };
    orders[s.order.orderId] = updated;
    writeOrders(orders);
    set({ order: updated });
  },

  setCopying(v) {
    set({ isCopying: v });
  },
}));
