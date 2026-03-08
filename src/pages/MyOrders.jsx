import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { API_URL } from "../api/http";
import { getAuth } from "../auth/storage";
import { formatAMD } from "../utils/currency";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadMyOrders() {
      try {
        setLoading(true);
        setErr("");

        const token = getAuth()?.token;

        if (!token) {
          throw new Error("Մուտք գործիր, որպեսզի տեսնես պատվերները");
        }

        const res = await fetch(`${API_URL}/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => ([]));

        if (!res.ok) {
          throw new Error(data.message || "Չհաջողվեց բեռնել պատվերները");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadMyOrders();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-950">Իմ պատվերները</h1>

        {loading ? (
          <div className="mt-6 text-sm text-slate-600">Բեռնվում է...</div>
        ) : err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : !orders.length ? (
          <div className="mt-6 rounded-2xl border bg-white p-6 text-slate-600">
            Դու դեռ պատվեր չունես
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Պատվերի ID</p>
                    <p className="break-all font-mono text-sm text-slate-900">
                      {order._id}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">Վճարման կարգավիճակ</p>
                      <p className="font-semibold text-slate-900">
                        {order.paymentStatus}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Պատվերի կարգավիճակ</p>
                      <p className="font-semibold text-slate-900">
                        {order.status}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Ընդհանուր գումար</p>
                      <p className="font-bold text-sky-700">
                        {formatAMD(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Առաքման տվյալներ
                  </p>

                  <div className="space-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">Անուն:</span>{" "}
                      {order.customerName || "—"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Հեռախոս:</span>{" "}
                      {order.customerPhone || "—"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Հասցե:</span>{" "}
                      {order.shippingAddress || "—"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Քաղաք:</span>{" "}
                      {order.shippingCity || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-500">
                    Ստեղծվել է՝{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "—"}
                  </div>

                  <Link
                    to={`/my-orders/${order._id}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
                  >
                    Բացել մանրամասները
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}