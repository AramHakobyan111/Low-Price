import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { formatAMD } from "../utils/currency";

const API = "http://localhost:5050/api";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const url = useMemo(() => `${API}/products/${id}`, [id]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(url);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) throw new Error(data.message || "Չհաջողվեց բեռնել");

        if (!ignore) setP(data);

        if (data?.category) {
          const relRes = await fetch(
            `${API}/products?category=${data.category}&sort=new`
          );
          const relData = await relRes.json().catch(() => ([]));
          const list = Array.isArray(relData) ? relData : [];
          const filtered = list.filter((x) => x._id !== data._id).slice(0, 4);

          if (!ignore) setRelated(filtered);
        } else {
          if (!ignore) setRelated([]);
        }
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
        <div className="text-sm text-slate-600">
          <Link to="/products" className="hover:text-slate-900">
            ← Վերադառնալ ապրանքներին
          </Link>
        </div>

        {err && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-sm text-slate-600">Բեռնվում է…</div>
        ) : p ? (
          <>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <img
                  src={p.image || "/product1.png"}
                  alt={p.name}
                  className="h-[360px] w-full object-cover"
                />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                {p.category && (
                  <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                    {p.category}
                  </div>
                )}

                <h1 className="mt-3 text-2xl font-bold text-slate-950">
                  {p.name}
                </h1>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Գին</div>
                    <div className="text-3xl font-bold text-sky-700">
                      {formatAMD(p.price)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-500">Առկա է</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {p.stock ?? 0} հատ
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => addToCart(p)}
                    disabled={(p.stock ?? 0) <= 0}
                    className={`w-full rounded-2xl py-3 text-sm font-semibold text-white ${
                      (p.stock ?? 0) <= 0
                        ? "cursor-not-allowed bg-slate-300"
                        : "bg-sky-700 hover:bg-sky-800"
                    }`}
                  >
                    {(p.stock ?? 0) <= 0 ? "Վերջացած է" : "Ավելացնել զամբյուղ"}
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Link
                      to="/cart"
                      className="rounded-2xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Գնալ զամբյուղ
                    </Link>

                    <Link
                      to="/products"
                      className="rounded-2xl border border-slate-200 bg-white py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Շարունակել գնումը
                    </Link>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="font-semibold text-slate-900">Նկարագրություն</div>
                  <div className="mt-2 whitespace-pre-line">
                    {p.description?.trim()
                      ? p.description
                      : "Նկարագրություն չկա։"}
                  </div>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold text-slate-950">
                  Նման ապրանքներ
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {related.map((x) => (
                    <Link
                      key={x._id}
                      to={`/products/${x._id}`}
                      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <img
                        src={x.image || "/product1.png"}
                        alt={x.name}
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <div className="line-clamp-2 text-sm font-semibold text-slate-950">
                          {x.name}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-sky-700">
                            {formatAMD(x.price)}
                          </span>
                          <span className="text-xs text-slate-500">
                            Առկա՝ {x.stock ?? 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}