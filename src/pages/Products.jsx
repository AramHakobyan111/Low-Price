import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { formatAMD } from "../utils/currency";
import { API_URL } from "../api/http";



const CATEGORY_OPTIONS = [
  { value: "", label: "Բոլոր կատեգորիաները" },
  { value: "cleaning", label: "Մաքրություն" },
  { value: "kitchen", label: "Խոհանոց" },
  { value: "bathroom", label: "Սանհանգույց" },
  { value: "storage", label: "Պահեստավորում" },
];

export default function Products() {
  const { addToCart } = useCart();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const url = useMemo(() => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sort) params.set("sort", sort);
  if (category) params.set("category", category);
  const qs = params.toString();
  return `${API_URL}/products${qs ? `?${qs}` : ""}`;
}, [q, sort, category]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(url);
        const data = await res.json().catch(() => ([]));
        if (!res.ok) throw new Error(data.message || "Չհաջողվեց բեռնել");
        if (!ignore) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setErr(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [url]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Ապրանքներ</h1>
            <p className="mt-1 text-sm text-slate-600">
              Սեղմիր ապրանքի վրա՝ մանրամասների համար
            </p>
          </div>

          <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Որոնել…"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
            >
              <option value="new">Նորերը</option>
              <option value="price_asc">Գին՝ ցածրից բարձր</option>
              <option value="price_desc">Գին՝ բարձրից ցածր</option>
            </select>
          </div>
        </div>

        {err && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-sm text-slate-600">Բեռնվում է…</div>
        ) : items.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => (
              <Link
                key={p._id || p.id}
                to={`/products/${p._id || p.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img
                  src={p.image || "/product1.png"}
                  alt={p.name}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5">
                  <div className="line-clamp-2 text-sm font-semibold text-slate-950">
                    {p.name}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-sky-700">
                      {formatAMD(p.price)}
                    </span>
                    <span className="text-xs text-slate-500">
                      Առկա՝ {p.stock ?? 0}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(p);
                    }}
                    disabled={(p.stock ?? 0) <= 0}
                    className={`mt-3 w-full rounded-xl py-2 text-sm font-semibold text-white ${
                      (p.stock ?? 0) <= 0
                        ? "cursor-not-allowed bg-slate-300"
                        : "bg-sky-700 hover:bg-sky-800"
                    }`}
                  >
                    {(p.stock ?? 0) <= 0 ? "Վերջացած է" : "Ավելացնել զամբյուղ"}
                  </button>

                  {p.category && (
                    <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                      {p.category}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Այս ֆիլտրերով ապրանք չի գտնվել։ Փորձիր փոխել որոնումը/կատեգորիան։
          </div>
        )}
      </div>
    </div>
  );
}