/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/reserve/store/reservationStore.ts
import { create } from "zustand";
import type { FlatDeparture } from "../../search/utils/types";

export type Contact = { nama: string; email: string; whatsapp: string };
export type Passenger = { seat: string; nama: string; phone: string };
export type CouponInfo = {
  code?: string;
  discountPct?: number;
  error?: string;
};
export type Seat = { id: string; taken: boolean };

type State = {
  dep?: FlatDeparture;
  seats: Seat[];
  selectedSeats: string[];
  passengers: Passenger[];
  contact: Contact;
  coupon: CouponInfo;
  termsAccepted: boolean;
  deadline?: number;
  basePrice: number;

  totalBefore: number;
  discount: number;
  totalAfter: number;
  errors: string[];
};

type Actions = {
  hydrate(): void;
  initFromDeparture(dep: FlatDeparture): void;
  toggleSeat(seatId: string): void;
  setPassengerName(seatId: string, nama: string): void;
  setPassengerPhone(seatId: string, phone: string): void;
  setContact<K extends keyof Contact>(k: K, v: Contact[K]): void;
  setTerms(v: boolean): void;
  applyCoupon(code: string): void;
  removeCoupon(): void;
  recompute(): void;
  validateAll(): boolean;
  placeOrder(): { ok: boolean; orderId?: string; message?: string };
  clear(): void;
};

const PERSIST_KEY = "bhisa.reserve.current";

function emailOk(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function waOk(v: string) {
  return /^(\+?\d){10,}$/.test(v.replace(/\s|-/g, ""));
}
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function genSeatMap(depId: string, sisaKursi: number): Seat[] {
  const cols = ["A", "B", "C", "D"];
  const rows = [1, 2, 3, 4];
  const total = cols.length * rows.length; // 16
  const takenCount = Math.max(0, total - sisaKursi);
  const all = cols.flatMap((c) => rows.map((r) => `${c}${r}`));
  const takenSet = new Set<string>();
  let rnd = hashStr(depId);
  const next = () => {
    rnd ^= rnd << 13;
    rnd ^= rnd >>> 17;
    rnd ^= rnd << 5;
    return (rnd >>> 0) / 0xffffffff;
  };
  while (takenSet.size < takenCount && takenSet.size < total)
    takenSet.add(all[Math.floor(next() * total)]);
  return all.map((id) => ({ id, taken: takenSet.has(id) }));
}

function computeTotals(base: number, selected: string[], coupon?: CouponInfo) {
  const totalBefore = base * selected.length;
  const discount = coupon?.discountPct
    ? Math.round(totalBefore * (coupon.discountPct / 100))
    : 0;
  const totalAfter = Math.max(0, totalBefore - discount);
  return { totalBefore, discount, totalAfter };
}

function savePersist(s: State) {
  const {
    dep,
    seats,
    selectedSeats,
    passengers,
    contact,
    coupon,
    termsAccepted,
    deadline,
    basePrice,
  } = s;
  localStorage.setItem(
    PERSIST_KEY,
    JSON.stringify({
      dep,
      seats,
      selectedSeats,
      passengers,
      contact,
      coupon,
      termsAccepted,
      deadline,
      basePrice,
    })
  );
}
function loadPersist(): Partial<State> | null {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useReservationStore = create<State & Actions>((set, get) => ({
  dep: undefined,
  seats: [],
  selectedSeats: [],
  passengers: [],
  contact: { nama: "", email: "", whatsapp: "" },
  coupon: {},
  termsAccepted: false,
  deadline: undefined,
  basePrice: 0,
  totalBefore: 0,
  discount: 0,
  totalAfter: 0,
  errors: [],

  hydrate() {
    const data = loadPersist();
    if (!data?.dep) return;
    const {
      dep,
      seats,
      selectedSeats,
      passengers,
      contact,
      coupon,
      termsAccepted,
      deadline,
      basePrice,
    } = data as any;
    const totals = computeTotals(basePrice, selectedSeats, coupon);
    set({
      dep,
      seats,
      selectedSeats,
      passengers,
      contact,
      coupon,
      termsAccepted,
      deadline,
      basePrice,
      totalBefore: totals.totalBefore,
      discount: totals.discount,
      totalAfter: totals.totalAfter,
      errors: [],
    });
  },

  initFromDeparture(dep) {
    const seats = genSeatMap(dep.id, dep.sisaKursi);
    const deadline = Date.now() + 15 * 60 * 1000;
    const basePrice = dep.harga;
    const selectedSeats: string[] = [];
    const passengers: Passenger[] = [];
    const totals = computeTotals(basePrice, selectedSeats, undefined);
    const state: State = {
      dep,
      seats,
      selectedSeats,
      passengers,
      contact: { nama: "", email: "", whatsapp: "" },
      coupon: {},
      termsAccepted: false,
      deadline,
      basePrice,
      totalBefore: totals.totalBefore,
      discount: totals.discount,
      totalAfter: totals.totalAfter,
      errors: [],
    };
    set(state);
    savePersist(state);
  },

  toggleSeat(seatId) {
    const s = get();
    const seat = s.seats.find((x) => x.id === seatId);
    if (!seat || seat.taken) return;
    let selected = s.selectedSeats.slice();
    if (selected.includes(seatId))
      selected = selected.filter((x) => x !== seatId);
    else selected.push(seatId);

    const passengers: Passenger[] = selected.map((seat) => {
      const found = s.passengers.find((p) => p.seat === seat);
      return {
        seat,
        nama: found?.nama ?? s.contact.nama ?? "",
        phone: found?.phone ?? s.contact.whatsapp ?? "",
      };
    });

    const totals = computeTotals(s.basePrice, selected, s.coupon);
    const next = {
      ...s,
      selectedSeats: selected,
      passengers,
      totalBefore: totals.totalBefore,
      discount: totals.discount,
      totalAfter: totals.totalAfter,
      errors: [],
    };
    set(next);
    savePersist(next);
  },

  setPassengerName(seatId, nama) {
    const s = get();
    const passengers = s.passengers.map((p) =>
      p.seat === seatId ? { ...p, nama } : p
    );
    const next = { ...s, passengers };
    set(next);
    savePersist(next);
  },
  setPassengerPhone(seatId, phone) {
    const s = get();
    const passengers = s.passengers.map((p) =>
      p.seat === seatId ? { ...p, phone } : p
    );
    const next = { ...s, passengers };
    set(next);
    savePersist(next);
  },

  setContact(k, v) {
    const s = get();
    const contact = { ...s.contact, [k]: v };
    const next = { ...s, contact };
    set(next);
    savePersist(next);
  },
  setTerms(v) {
    const s = get();
    const next = { ...s, termsAccepted: v };
    set(next);
    savePersist(next);
  },

  applyCoupon(code) {
    const s = get();
    const codeUp = code.trim().toUpperCase();
    if (!codeUp) {
      const next = { ...s, coupon: {}, errors: [] };
      set(next);
      savePersist(next);
      get().recompute();
      return;
    }
    const table: Record<string, number> = { DISC10: 10, HEMAT20: 20 };
    if (!table[codeUp]) {
      const next = {
        ...s,
        coupon: { code: codeUp, error: "Kupon tidak valid" },
      };
      set(next);
      savePersist(next);
      get().recompute();
      return;
    }
    const coupon = { code: codeUp, discountPct: table[codeUp] };
    const totals = computeTotals(s.basePrice, s.selectedSeats, coupon);
    const next = {
      ...s,
      coupon,
      totalBefore: totals.totalBefore,
      discount: totals.discount,
      totalAfter: totals.totalAfter,
      errors: [],
    };
    set(next);
    savePersist(next);
  },
  removeCoupon() {
    const s = get();
    const coupon = {};
    const totals = computeTotals(s.basePrice, s.selectedSeats, coupon as any);
    const next = {
      ...s,
      coupon: {},
      totalBefore: totals.totalBefore,
      discount: totals.discount,
      totalAfter: totals.totalAfter,
    };
    set(next);
    savePersist(next);
  },

  recompute() {
    const s = get();
    const t = computeTotals(s.basePrice, s.selectedSeats, s.coupon);
    set({
      totalBefore: t.totalBefore,
      discount: t.discount,
      totalAfter: t.totalAfter,
    });
  },

  validateAll() {
    const s = get();
    const errs: string[] = [];
    if (!s.dep) errs.push("Data perjalanan tidak ditemukan.");
    if (!s.selectedSeats.length) errs.push("Pilih minimal satu kursi.");
    for (const p of s.passengers) {
      if (!p.nama.trim()) {
        errs.push(`Nama penumpang untuk kursi ${p.seat} wajib diisi.`);
        break;
      }
      if (!waOk(p.phone)) {
        errs.push(`Nomor WA penumpang kursi ${p.seat} tidak valid.`);
        break;
      }
    }
    if (!s.contact.nama.trim()) errs.push("Nama pemesan wajib diisi.");
    if (!emailOk(s.contact.email)) errs.push("Email tidak valid.");
    if (!waOk(s.contact.whatsapp)) errs.push("Nomor WhatsApp tidak valid.");
    if (!s.termsAccepted) errs.push("Anda harus menyetujui S&K.");
    if (s.deadline && Date.now() > s.deadline)
      errs.push("Waktu pemesanan habis.");
    set({ ...s, errors: errs });
    return errs.length === 0;
  },

  placeOrder() {
    const s = get();
    if (!get().validateAll())
      return { ok: false, message: "Periksa data Anda." };

    const conflict = s.selectedSeats.find(
      (id) => s.seats.find((x) => x.id === id)?.taken
    );
    if (conflict)
      return {
        ok: false,
        message: `Kursi ${conflict} sudah terisi. Pilih kursi lain.`,
      };

    const orderId = `ORD-${Date.now()}`;
    const order = {
      orderId,
      jamId: s.dep?.id,
      route: `${s.dep?.origin} → ${s.dep?.destination}`,
      tanggal: s.dep?.tanggal,
      total: s.totalAfter,
      qty: s.selectedSeats.length,
      status: "unpaid" as const,
      contact: s.contact,
      passengers: s.passengers,
      seats: s.selectedSeats,
      operator: s.dep?.operator,
      hargaPerSeat: s.basePrice,
      coupon: s.coupon,
      createdAt: new Date().toISOString(),
    };

    try {
      // versi array
      const raw = localStorage.getItem("bhisa.orders");
      let arr: any[] = [];
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          arr = Array.isArray(parsed)
            ? parsed
            : parsed && typeof parsed === "object"
            ? Object.values(parsed) // migrasi map → array
            : [];
        } catch {
          arr = [];
        }
      }
      arr.push(order);
      localStorage.setItem("bhisa.orders", JSON.stringify(arr));
    } catch (e) {
      console.log(e);
    }

    return { ok: true, orderId };
  },

  clear() {
    set({
      dep: undefined,
      seats: [],
      selectedSeats: [],
      passengers: [],
      contact: { nama: "", email: "", whatsapp: "" },
      coupon: {},
      termsAccepted: false,
      deadline: undefined,
      basePrice: 0,
      totalBefore: 0,
      discount: 0,
      totalAfter: 0,
      errors: [],
    });
    try {
      localStorage.removeItem(PERSIST_KEY);
    } catch (e: unknown) {
      console.log(e as Error);
    }
  },
}));
