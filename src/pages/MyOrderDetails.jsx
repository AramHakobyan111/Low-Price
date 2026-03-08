import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { API_URL } from "../api/http";
import { getAuth } from "../auth/storage";
import { formatAMD } from "../utils/currency";

export default function MyOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setErr("");

        const token = getAuth()?.token;

        if (!token) {
          throw new Error("Մուտք գործիր, որպեսզի տեսնես պատվերը");
        }

        const res = await fetch(`${API_URL}/orders/my/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || "Չհաջողվեց բեռնել պատվերը");
        }

        setOrder(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-950">
          Իմ պատվերի մանրամասները
        </h1>

        {loading ? (
          <div className="mt-6 text-sm text-slate-600">Բեռնվում է...</div>
        ) : err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : order ? (
          <div className="mt-6 grid gap-6">

            {/* Shipping */}
            <div className="rounded-3xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Առաքման տվյալներ
              </h2>

              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <p><strong>Անուն:</strong> {order.customerName || "—"}</p>
                <p><strong>Email:</strong> {order.customerEmail || "—"}</p>
                <p><strong>Հեռախոս:</strong> {order.customerPhone || "—"}</p>
                <p><strong>Հասցե:</strong> {order.shippingAddress || "—"}</p>
                <p><strong>Քաղաք:</strong> {order.shippingCity || "—"}</p>
              </div>
            </div>

            {/* Order info */}
            <div className="rounded-3xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Պատվերի տվյալներ
              </h2>

              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                <p><strong>Payment status:</strong> {order.paymentStatus}</p>
                <p><strong>Order status:</strong> {order.status}</p>
                <p><strong>Total:</strong> {formatAMD(order.totalAmount)}</p>
                <p>
                  <strong>Ստեղծվել է:</strong>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-3xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Ապրանքներ
              </h2>

              <div className="mt-4 space-y-4">
                {order.items?.map((item, idx) => (
                  <div
                    key={`${order._id}-${idx}`}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : null}

                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Քանակ՝ {item.qty}
                        </p>
                      </div>
                    </div>

                    <div className="font-bold text-slate-900">
                      {formatAMD(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
}