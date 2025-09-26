export type Order = {
  orderId: string;
  jamId: string; // contoh: "BB-22-1300"
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
  createdAt: string; // ISO
};

const KEY = "bhisa.orders";

/** Selalu kembalikan array. Migrasi otomatis kalau data lama masih map. */
export function readOrdersArray(): Order[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (!raw) return [];

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (Array.isArray(parsed)) return parsed as Order[];

  if (parsed && typeof parsed === "object") {
    if (parsed.orders && typeof parsed.orders === "object") {
      const arr = Object.values(parsed.orders) as Order[];
      try {
        localStorage.setItem(KEY, JSON.stringify(arr));
      } catch (e) {
        console.log(e);
      }
      return arr;
    }
    if (parsed.orderId) {
      const arr = [parsed as Order];
      try {
        localStorage.setItem(KEY, JSON.stringify(arr));
      } catch (e) {
        console.log(e);
      }
      return arr;
    }
    const arr = Object.values(parsed) as Order[];
    try {
      localStorage.setItem(KEY, JSON.stringify(arr));
    } catch (e) {
      console.log(e);
    }
    return arr;
  }

  return [];
}

export function getOrderById(id: string) {
  return readOrdersArray().find((o) => o.orderId === id);
}
export function getOrderByJamId(jamId: string) {
  return readOrdersArray().find((o) => o.jamId === jamId);
}
