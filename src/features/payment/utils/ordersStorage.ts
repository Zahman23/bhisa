export type Order = {
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
  createdAt: string; // ISO
};

const ORDERS_KEY = "bhisa.orders";

/** Baca dari localStorage dan kembalikan SELALU dalam bentuk array.
 *  Jika format lama (map id→order), otomatis dimigrasikan ke array dan ditulis balik.
 */
export function readOrdersArray(): Order[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(ORDERS_KEY);
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

  // Sudah array
  if (Array.isArray(parsed)) return parsed as Order[];

  // Single order object tersimpan mentah (edge)
  if (parsed && parsed.orderId) {
    const arr = [parsed as Order];
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(arr));
    } catch (e: unknown) {
      console.log(e as Error);
    }
    return arr;
  }

  // Map lama: { "ORD-xxx": {..}, "ORD-yyy": {..} } atau nested { orders: {...} }
  const mapObj =
    parsed?.orders && typeof parsed.orders === "object"
      ? parsed.orders
      : parsed && typeof parsed === "object"
      ? parsed
      : null;

  if (mapObj) {
    const arr = Object.values(mapObj) as Order[];
    // tulis balik sebagai array (migrasi)
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(arr));
    } catch (e: unknown) {
      console.log(e as Error);
    }
    return arr;
  }

  return [];
}

export function writeOrdersArray(list: Order[]) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  } catch (e: unknown) {
    console.log(e as Error);
  }
}

export function getOrderById(id: string): Order | undefined {
  const list = readOrdersArray();
  return list.find((o) => o.orderId === id);
}

export function appendOrder(o: Order) {
  const list = readOrdersArray();
  list.push(o);
  writeOrdersArray(list);
}

export function saveOrder(o: Order) {
  const list = readOrdersArray();
  const idx = list.findIndex((x) => x.orderId === o.orderId);
  if (idx >= 0) list[idx] = o;
  else list.push(o);
  writeOrdersArray(list);
}

export function getLatestOrder(): Order | undefined {
  const list = readOrdersArray();
  if (!list.length) return undefined;
  return list.reduce((a, b) =>
    new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? a : b
  );
}
