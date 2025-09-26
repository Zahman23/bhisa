import { useMemo } from "react";

import { applyFilterSort } from "../utils/sortFilter";
import { useSearchResultsStore } from "../stores/searhResultStore";

export function useProcessedResults() {
  const { rows, filterMaxHarga: maxHarga, sortKey } = useSearchResultsStore();

  return useMemo(
    () => applyFilterSort(rows, { maxHarga, sortKey }),
    [rows, maxHarga, sortKey]
  );
}
