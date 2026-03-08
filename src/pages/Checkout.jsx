import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { API_URL } from "../api/http";
import { getAuth } from "../auth/storage";
import { formatAMD } from "../utils/currency";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm({ amount, clearCart, items, customer }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !customer.city
    ) {
      setMessage("Լրացրու բոլոր հասցեի դաշտերը");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "Վճարումը չհաջողվեց");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        const token = getAuth()?.token;

        if (!token) {
          throw new Error("Մուտք գործիր, որպեսզի պատվերը պահվի");
        }

        const orderPayload = {
          items: items.map((item) => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            image: item.image || "",
          })),
          totalAmount: amount,
          paymentIntentId: paymentIntent.id,
          customerEmail: customer.email,
          customerName: customer.name,
          customerPhone: customer.phone,
          shippingAddress: customer.address,
          shippingCity: customer.city,
        };

        const orderRes = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        });

        const orderData = await orderRes.json().catch(() => ({}));

        if (!orderRes.ok && orderRes.status !== 409) {
          throw new Error(orderData.message || "Order save failed");
        }
      } catch (err) {
        console.error("Order save failed:", err);
        setMessage(
          err.message || "Վճարումը կատարվել է, բայց պատվերի պահպանումը ձախողվեց"
        );
        setLoading(false);
        return;
      }

      clearCart();
      localStorage.removeItem("cartItems");
      navigate("/payment-success");
      return;
    }

    setMessage("Վճարման կարգավիճակը հաստատված չէ");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border bg-white p-6">
      <h2 className="text-xl font-bold text-slate-950">Քարտով վճարում</h2>
      <p className="mt-1 text-sm text-slate-600">
        Ընդհանուր գումարը՝ {formatAMD(amount)}
      </p>

      <div className="mt-5">
        <PaymentElement />
      </div>

      {message && (
        <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="mt-5 w-full rounded-2xl bg-sky-700 py-3 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
      >
        {loading ? "Վճարումը..." : "Վճարել հիմա"}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();

  const [clientSecret, setClientSecret] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    async function createIntent() {
      try {
        setLoading(true);
        setErr("");

        const amountInCents = Math.round(Number(totalPrice || 0) * 100);

        const res = await fetch(`${API_URL}/payments/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: amountInCents }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.message || "Չհաջողվեց ստեղծել վճարումը");
        }

        setClientSecret(data.clientSecret);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (items.length) {
      createIntent();
    } else {
      setLoading(false);
      setErr("Զամբյուղը դատարկ է");
    }
  }, [items, totalPrice]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-950">Checkout</h1>

        {loading ? (
          <div className="mt-6 text-sm text-slate-600">Բեռնվում է...</div>
        ) : err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : clientSecret ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div className="rounded-3xl border bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-950">
                  Առաքման տվյալներ
                </h2>

                <div className="mt-4 grid gap-4">
                  <input
                    type="text"
                    placeholder="Անուն"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className="rounded-2xl border px-4 py-3 outline-none"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                    className="rounded-2xl border px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Հեռախոսահամար"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    className="rounded-2xl border px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Հասցե"
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    className="rounded-2xl border px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Քաղաք"
                    value={customer.city}
                    onChange={(e) =>
                      setCustomer({ ...customer, city: e.target.value })
                    }
                    className="rounded-2xl border px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  amount={totalPrice}
                  clearCart={clearCart}
                  items={items}
                  customer={customer}
                />
              </Elements>
            </div>

            <div className="h-fit rounded-3xl border bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Պատվերի ամփոփում
              </h2>

              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-semibold text-slate-950">
                      {formatAMD(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Ընդհանուր</span>
                  <span className="text-xl font-bold text-sky-700">
                    {formatAMD(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}