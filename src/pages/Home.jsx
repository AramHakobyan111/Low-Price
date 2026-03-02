import Header from "../components/Header";

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

const featuredProducts = [
  { id: 1, name: "Բազմաֆունկցիոնալ մաքրող միջոց", price: 1290, image: "/product1.png" },
  { id: 2, name: "Սպունգների հավաքածու (5 հատ)", price: 790, image: "/product2.png" },
  { id: 3, name: "Ափսեների աման", price: 990, image: "/product3.png" },
  { id: 4, name: "Աղբի տոպրակներ (30 հատ)", price: 1490, image: "/product4.png" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-10">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-slate-300/40 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-sky-600" />
              Ցածր գներ • Արագ առաքում • Անվտանգ վճարում
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Ցածր գներ՝ <span className="text-sky-700">տնային ապրանքների</span> համար
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600">
              Ամենօրյա անհրաժեշտ իրեր՝ մաքրությունից մինչև խոհանոց․ պարզ որոնում, արագ պատվեր, հարմար առաքում։
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/products"
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
              >
                Դիտել ապրանքները
              </a>

              <a
                href="/products?sort=price_asc"
                className="rounded-xl border border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50"
              >
                Ամենաէժանները
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Կատեգորիաներ</h2>
          <a href="/products" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
            Տեսնել բոլորը →
          </a>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <a
              key={c.slug}
              href={`/products?category=${c.slug}`}
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
            </a>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Առաջարկվող ապրանքներ</h2>
          <a href="/products" className="text-sm font-semibold text-slate-800 hover:text-black">
            Բոլոր ապրանքները →
          </a>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <img src={p.image} alt={p.name} className="h-44 w-full object-cover" />

              <div className="p-5">
                <div className="text-sm font-semibold text-slate-950">{p.name}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sky-700 font-bold">{p.price} ֏</span>
                  <button className="rounded-xl bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800">
                    Ավելացնել
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
          © {new Date().getFullYear()} Low Price • Օնլայն խանութ՝ տնային ապրանքների համար
        </div>
      </footer>
    </div>
  );
}