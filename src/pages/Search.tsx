// src/pages/SearchPage.tsx
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  buildSearchParams,
  parseQuery,
} from "../features/search/utils/queryParams";
import { loadCtx, saveCtx } from "../features/search/utils/storage";
import SearchArea, {
  type Query as FormQuery,
} from "../components/form/searchArea";
import FilterSidebar from "../features/search/components/FilterSidebar";
import {
  findDepartures,
  loadLastQuery,
  loadResults,
  saveResults,
} from "../features/search/utils/searchShuttles";
import ResultsList from "../features/search/components/CardShuttle";
import { useSearchResultsStore } from "../features/search/stores/searhResultStore";
import { minDelay } from "../features/search/utils/minDelay";
import ResultsSkeleton from "../features/search/components/resultSkeleton";
import Wrapper from "../components/Wrapper";
import { BackButton } from "../components/BackButton";
import { SummaryDrawer } from "../components/SummaryDrawer";

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setResults, rows, setLoading, isLoading } = useSearchResultsStore();

  // Initial form values: dari URL > ctx (storage) > defaults
  const initialQuery = useMemo<Partial<FormQuery>>(() => {
    const fromUrl = parseQuery(params);
    const hasUrl = !!(fromUrl.asal || fromUrl.tujuan || fromUrl.tanggal);
    if (hasUrl) return fromUrl;
    const ctx = loadCtx();
    return ctx?.q ?? {};
  }, [params]);

  const syncKey = useMemo(() => JSON.stringify(initialQuery), [initialQuery]);

  // OPTIONAL: jika hot reload dan results hilang, rebuild dari last query
  useEffect(() => {
    if (rows.length) return;
    const cached = loadResults();
    if (cached?.rows?.length) {
      setResults(cached.rows, cached.updatedAt);
      return;
    }
    // optional: rebuild dari lastQuery jika results belum ada
    const q = loadLastQuery();
    if (q && q.asal && q.tujuan && q.tanggal) {
      findDepartures(q)
        .then((rows) => {
          setResults(rows, new Date().toISOString());
          saveResults(q, rows);
        })
        .catch(() => {});
    }
  }, [rows.length, setResults]);

  return (
    <Wrapper title="Pencarian Shuttle" description="pencarian">
      <div className="sticky top-0 lg:relative bg-white lg:block py-2 flex justify-between">
        <BackButton />
        <SummaryDrawer>
          <FilterSidebar />
        </SummaryDrawer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 min-h-screen">
        <aside className="lg:col-span-3 hidden lg:block">
          <FilterSidebar />
        </aside>

        <section className="lg:col-span-9">
          <header className="mb-3">
            <SearchArea
              initialQuery={{
                asal: initialQuery.asal ?? "",
                tujuan: initialQuery.tujuan ?? "",
                tanggal:
                  initialQuery.tanggal ?? new Date().toISOString().slice(0, 10),
                kursi: initialQuery.kursi ?? 1,
              }}
              syncKey={syncKey}
              onSubmit={async (q) => {
                // simpan lagi supaya hot reload berikutnya tetap ada
                saveCtx(q, "searchArea");

                setLoading(true);
                try {
                  const rows = await minDelay(findDepartures(q), 3000);
                  setResults(rows, new Date().toISOString());
                  saveResults(q, rows);

                  const sp = buildSearchParams(q, "searchArea");
                  navigate({
                    pathname: "/search",
                    search: `?${sp.toString()}`,
                  });
                } finally {
                  setLoading(false);
                }
              }}
            />
          </header>

          <div className="space-y-3">
            {isLoading ? <ResultsSkeleton /> : <ResultsList />}
          </div>
        </section>

        {/* … render hasil pencarian berdasarkan params / state … */}
      </div>
    </Wrapper>
  );
}
