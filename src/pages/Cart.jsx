import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { formatAMD } from "../utils/currency";

export default function Cart() {
  const { items, removeFromCart, updateQty, totalPrice } = useCart();

  if (!items.length) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <div className="mx-auto max-w-4xl px-4 py-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Զամբյուղ</h1>

          <p className="mt-6 text-slate-600">Ձեր զամբյուղը դատարկ է</p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-sky-700 px-6 py-3 text-white hover:bg-sky-800"
          >
            Գնալ ապրանքների էջ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Զամբյուղ</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 rounded-2xl border bg-white p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-slate-900">{item.name}</h2>

                  <p className="text-sm text-slate-600">
                    {formatAMD(item.price)}
                  </p>

                  <p className="text-xs text-slate-500">
                    Առկա՝ {item.stock ?? 0}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQty(item._id, Math.max(1, item.qty - 1))
                      }
                      className="rounded-lg border px-2 py-1"
                    >
                      -
                    </button>

                    <span className="px-3">{item.qty}</span>

                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      disabled={item.qty >= (item.stock ?? item.qty)}
                      className={`rounded-lg border px-2 py-1 ${
                        item.qty >= (item.stock ?? item.qty)
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">
                    {formatAMD(item.price * item.qty)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Հեռացնել
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Պատվերի ամփոփում
            </h2>

            <div className="mt-4 flex justify-between text-slate-700">
              <span>Ընդհանուր</span>
              <span className="font-bold text-sky-700">
                {formatAMD(totalPrice)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-5 block w-full rounded-xl bg-sky-700 py-3 text-center text-white hover:bg-sky-800"
            >
              Անցնել վճարման
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}