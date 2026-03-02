import Header from "../components/Header";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeFromCart, setQty, totalPrice, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-950">Զամբյուղ</h1>

        {!items.length ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Զամբյուղը դատարկ է։
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <div className="grid gap-3">
              {items.map((x) => (
                <div
                  key={x._id}
                  className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4"
                >
                  <img
                    src={x.image || "/product1.png"}
                    alt={x.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <div className="font-semibold text-slate-950">{x.name}</div>
                    <div className="mt-1 text-sm text-sky-700 font-bold">
                      {x.price} ֏
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => setQty(x._id, x.qty - 1)}
                        className="h-9 w-9 rounded-xl border hover:bg-slate-50"
                      >
                        -
                      </button>

                      <input
                        value={x.qty}
                        onChange={(e) => setQty(x._id, e.target.value)}
                        className="w-16 rounded-xl border px-3 py-2 text-center text-sm"
                      />

                      <button
                        onClick={() => setQty(x._id, x.qty + 1)}
                        className="h-9 w-9 rounded-xl border hover:bg-slate-50"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(x._id)}
                        className="ml-auto rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Ջնջել
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-3xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-950">
                Վճարման ամփոփում
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-600">Ընդհանուր</span>
                <span className="font-bold text-slate-950">{totalPrice} ֏</span>
              </div>

              <button className="mt-4 w-full rounded-xl bg-sky-700 py-3 text-sm font-semibold text-white hover:bg-sky-800">
                Անցնել վճարման
              </button>

              <button
                onClick={clearCart}
                className="mt-3 w-full rounded-xl border py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Մաքրել զամբյուղը
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}