import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { API_URL } from "../api/http";
import { formatAMD } from "../utils/currency";

const STATUS_OPTIONS = ["new", "processing", "shipped", "delivered"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [savingId, setSavingId] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setErr("");

      const res = await fetch(`${API_URL}/orders`);
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

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(orderId, newStatus) {
    try {
      setSavingId(orderId);
      setErr("");

      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Չհաջողվեց փոխել կարգավիճակը");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: data.status } : order
        )
      );
    } catch (e) {
      setErr(e.message);
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-950">Պատվերներ</h1>

          <button
            onClick={loadOrders}
            className="rounded-2xl border px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            Թարմացնել
          </button>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-slate-600">Բեռնվում է...</div>
        ) : err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : !orders.length ? (
          <div className="mt-6 rounded-2xl border bg-white p-6 text-slate-600">
            Պատվերներ դեռ չկան
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-slate-500">Պատվերի ID</p>
                      <p className="break-all font-mono text-sm text-slate-900">
                        {order._id}
                      </p>
                    </div>

                    <div className="text-sm text-slate-600">
                      Ստեղծվել է՝{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "—"}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">Վճարման կարգավիճակ</p>
                      <p className="font-semibold text-slate-900">
                        {order.paymentStatus}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Ընդհանուր գումար</p>
                      <p className="font-bold text-sky-700">
                        {formatAMD(order.totalAmount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Պատվերի կարգավիճակ</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        disabled={savingId === order._id}
                        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Հաճախորդի տվյալներ
                    </p>

                    <div className="space-y-1 text-sm text-slate-600">
                      <p>
                        <span className="font-medium text-slate-800">Անուն:</span>{" "}
                        {order.customerName || "—"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-800">Email:</span>{" "}
                        {order.customerEmail || "—"}
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

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      Ապրանքներ
                    </p>

                    <div className="space-y-3">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div
                          key={`${order._id}-${idx}`}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-700">
                            {item.name} × {item.qty}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {formatAMD(item.price * item.qty)}
                          </span>
                        </div>
                      ))}

                      {order.items?.length > 3 && (
                        <p className="text-xs text-slate-500">
                          Եվս {order.items.length - 3} ապրանք...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-500">
                    {savingId === order._id
                      ? "Պահվում է..."
                      : `Կարգավիճակ՝ ${order.status}`}
                  </div>

                  <Link
                    to={`/admin/orders/${order._id}`}
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