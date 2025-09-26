import { create } from "zustand";
import type { FlatDeparture } from "../utils/types";

export type SortKey =
  | "default"
  | "price_asc" // termurah
  | "price_desc" // termahal
  | "duration_asc" // tercepat
  | "duration_desc" // terlambat/terlama
  | "seats_desc" // sisa kursi terbanyak
  | "seats_asc"; // sisa kursi tersedikit

type State = {
  rows: FlatDeparture[];
  updatedAt?: string;
  isLoading: boolean;
  filterMaxHarga?: number;
  sortKey: SortKey;
};

type Actions = {
  setResults(rows: FlatDeparture[], updatedAt?: string): void;
  setLoading(v: boolean): void;
  clear(): void;
  setFilterMaxHarga(v?: number): void;
  setSortKey(k: SortKey): void;
};

export const useSearchResultsStore = create<State & Actions>((set) => ({
  rows: [],
  updatedAt: undefined,
  isLoading: false,
  filterMaxHarga: undefined,
  sortKey: "default",

  setResults: (rows, updatedAt) => set({ rows, updatedAt }),
  setLoading: (v) => set({ isLoading: v }),
  clear: () => set({ rows: [], updatedAt: undefined }),

  setFilterMaxHarga: (v) =>
    set({
      filterMaxHarga: typeof v === "number" && !Number.isNaN(v) ? v : undefined,
    }),

  setSortKey: (k) => set({ sortKey: k }),
}));
