import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { API_URL } from "../api/http";
import { useCart } from "../context/CartContext";
import { formatAMD } from "../utils/currency";

const categories = [
  {
    title: "Մաքրություն",
    desc: "Սփրեյներ, մաքրող միջոցներ, անձեռոցիկներ",
    slug: "cleaning",
    image: "/cleaning.png",
  },
  {
    title: "Խոհանոց",
    desc: "Թասեր, ափսեներ, սպունգներ, պարագաներ",
    slug: "kitchen",
    image: "/kitchen.png",
  },
  {
    title: "Սանհանգույց",
    desc: "Օճառներ, շամպուններ, հիգիենայի իրեր",
    slug: "bathroom",
    image: "/bathroom.png",
  },
  {
    title: "Պահեստավորում",
    desc: "Տուփեր, կազմակերպիչներ, պահեստային լուծումներ",
    slug: "storage",
    image: "/storage.png",
  },
];

/*
  Այստեղ դու ինքդ կարող ես որոշել՝
  որ ապրանքները երևան "Առաջարկվող ապրանքներ" բաժնում։

  Պարզապես դիր քո իրական product _id-ները այս array-ի մեջ։
  Օրինակ՝
  "67cdd1a2b3f4e5a6b7c8d901"

  Եթե array-ը դատարկ լինի, ավտոմատ կերևան վերջին 4 ապրանքները։
*/
const featuredProductIds = [
  // "PUT_PRODUCT_ID_HERE",
  // "PUT_PRODUCT_ID_HERE",
  // "PUT_PRODUCT_ID_HERE",
  // "PUT_PRODUCT_ID_HERE",
];

export default function Home() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredErr, setFeaturedErr] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        setLoadingFeatured(true);
        setFeaturedErr("");

        const res = await fetch(`${API_URL}/products?sort=new`);
        const data = await res.json().catch(() => ([]));

        if (!res.ok) {
          throw new Error(data.message || "Չհաջողվեց բեռնել ապրանքները");
        }

        if (!ignore) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!ignore) {
          setFeaturedErr(e.message);
        }
      } finally {
        if (!ignore) {
          setLoadingFeatured(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const featuredProducts = useMemo(() => {
  if (!products.length) return [];

  const selected = products.filter((p) => p.featured);

  if (selected.length) {
    return selected.slice(0, 4);
  }

  return products.slice(0, 4);
}, [products]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-slate-300/40 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-sky-600" />
              Ցածր գներ • Արագ առաքում • Անվտանգ վճարում
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Ցածր գներ՝{" "}
              <span className="text-sky-700">տնային ապրանքների</span> համար
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Ամենօրյա անհրաժեշտ իրեր՝ մաքրությունից մինչև խոհանոց․ պարզ որոնում,
              արագ պատվեր, հարմար առաքում։
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
              >
                Դիտել ապրանքները
              </Link>

              <Link
                to="/products?sort=price_asc"
                className="rounded-xl border border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50"
              >
                Ամենաէժանները
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Կատեգորիաներ</h2>
          <Link
            to="/products"
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            Տեսնել բոլորը →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/products?category=${c.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative">
                <img src={c.image} alt={c.title} className="h-36 w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                  {c.title}
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs text-slate-600">{c.desc}</div>
                <div className="mt-4 text-xs font-semibold text-sky-700 group-hover:text-sky-800">
                  Դիտել →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-slate-950">
            Առաջարկվող ապրանքներ
          </h2>
          <Link
            to="/products"
            className="text-sm font-semibold text-slate-800 hover:text-black"
          >
            Բոլոր ապրանքները →
          </Link>
        </div>

        {featuredErr ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {featuredErr}
          </div>
        ) : loadingFeatured ? (
          <div className="mt-4 text-sm text-slate-600">Բեռնվում է...</div>
        ) : featuredProducts.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <div
                key={p._id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link to={`/products/${p._id}`}>
                  <img
                    src={p.image || "/product1.png"}
                    alt={p.name}
                    className="h-44 w-full object-cover"
                  />
                </Link>

                <div className="p-5">
                  <Link to={`/products/${p._id}`}>
                    <div className="text-sm font-semibold text-slate-950">
                      {p.name}
                    </div>
                  </Link>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-sky-700">
                      {formatAMD(p.price)}
                    </span>
                    <span className="text-xs text-slate-500">
                      Առկա՝ {p.stock ?? 0}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(p)}
                    disabled={(p.stock ?? 0) <= 0}
                    className={`mt-3 w-full rounded-xl py-2 text-xs font-semibold text-white ${
                      (p.stock ?? 0) <= 0
                        ? "cursor-not-allowed bg-slate-300"
                        : "bg-sky-700 hover:bg-sky-800"
                    }`}
                  >
                    {(p.stock ?? 0) <= 0 ? "Վերջացած է" : "Ավելացնել"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            Առայժմ առաջարկվող ապրանքներ չկան։
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
          © {new Date().getFullYear()} Low Price • Օնլայն խանութ՝ տնային
          ապրանքների համար
        </div>
      </footer>
    </div>
  );
}