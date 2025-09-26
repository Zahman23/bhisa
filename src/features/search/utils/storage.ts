import type { Query, Source } from "./queryParams";

export const SEARCH_CTX_KEY = "bhisa.search.ctx";

export function saveCtx(q: Query, source: Source) {
  localStorage.setItem(SEARCH_CTX_KEY, JSON.stringify({ q, source }));
}

export function loadCtx(): { q: Query; source: Source } | null {
  try {
    const raw = localStorage.getItem(SEARCH_CTX_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
