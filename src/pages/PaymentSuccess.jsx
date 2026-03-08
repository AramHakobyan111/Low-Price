import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border bg-white p-8 text-center">
          <div className="text-4xl">✅</div>

          <h1 className="mt-4 text-2xl font-bold text-slate-950">
            Վճարումը հաջողվեց
          </h1>

          <p className="mt-2 text-slate-600">
            Ձեր պատվերի վճարումը հաջողությամբ ընդունվել է։
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-800"
            >
              Շարունակել գնումը
            </Link>

            <Link
              to="/"
              className="rounded-2xl border px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Գլխավոր էջ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}