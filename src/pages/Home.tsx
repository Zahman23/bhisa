import SearchArea, { type Query } from "../components/form/searchArea";
import { useNavigate } from "react-router-dom";
import { saveCtx } from "../features/search/utils/storage";
import { todayISO } from "../utils/date";
import {
  buildSearchParams,
  type Source,
} from "../features/search/utils/queryParams";
import {
  deleteResult,
  findDepartures,
  saveResults,
} from "../features/search/utils/searchShuttles";
import { useSearchResultsStore } from "../features/search/stores/searhResultStore";
import { minDelay } from "../features/search/utils/minDelay";
import ReservationLookupCard from "../components/form/ReservastionLookupCard";
import Container from "../components/container";

const AREAS = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Cimahi",
  "Sumedang",
  "Garut",
  "Subang",
  "Karawang",
  "Purwakarta",
];

const Home = () => {
  const navigate = useNavigate();
  const today = todayISO();

  const { setResults, setLoading, clear } = useSearchResultsStore();

  const goWith = async (q: Query, source: Source) => {
    deleteResult();
    clear();
    // 1) simpan context
    saveCtx(q, source);
    const sp = buildSearchParams(q, source);
    navigate({ pathname: "/search", search: `?${sp.toString()}` });
  };

  // A) Shuttle
  function handleShuttle() {
    goWith({ asal: "", tujuan: "", tanggal: today, kursi: 1 }, "shuttle");
  }

  // B) Submit dari SearchArea (home)
  async function handleSearchAreaSubmit(q: Query) {
    goWith(q, "searchArea");

    setLoading(true);
    try {
      const rows = await minDelay(findDepartures(q), 3000);
      const updateAt = new Date().toISOString();
      setResults(rows, updateAt);
      saveResults(q, rows);
    } finally {
      setLoading(false);
    }
  }

  // C) Wilayah Populer
  function handlePopular(area: string) {
    goWith({ asal: area, tujuan: "", tanggal: today, kursi: 1 }, "popular");
  }

  return (
    <Container
      title="Shuttle AntarKota Cepat & Aman"
      description="Pesan kursi, bayar aman, e-ticket dikirim ke email"
    >
      <section aria-labelledby="home-title" className="my-6 min-h-screen">
        <div className="flex gap-3 mb-4">
          <button className="border rounded px-4 py-2" onClick={handleShuttle}>
            Shuttle
          </button>
        </div>

        <div className="mb-8">
          <SearchArea onSubmit={handleSearchAreaSubmit} />
        </div>

        <section aria-labelledby="areas" className="mt-10 mb-10">
          <h2 id="areas" className="text-2xl font-semibold mb-4">
            Wilayah Populer
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4">
            {AREAS.map((area) => (
              <button
                key={area}
                className="border rounded p-3 hover:border-brand"
                onClick={() => handlePopular(area)}
              >
                {area}
              </button>
            ))}
          </div>
        </section>

        <ReservationLookupCard />

        <div id="aria-live" className="sr-only" aria-live="polite" />
      </section>
    </Container>
  );
};

export default Home;
