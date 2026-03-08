import { useState } from "react";
import { post } from "../api/http";
import { setAuth } from "../auth/storage";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await post("/auth/register", form);
      setAuth(data);
      nav("/");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">Գրանցում</h1>
        <p className="mt-1 text-sm text-slate-600">Ստեղծիր հաշիվ՝ գնումների համար</p>

        {err && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}

        <label className="mt-5 block text-sm font-semibold text-slate-700">Անուն</label>
        <input
          className="mt-2 w-full rounded-xl border p-3 outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Արամ"
        />

        <label className="mt-4 block text-sm font-semibold text-slate-700">Էլ․ փոստ</label>
        <input
          className="mt-2 w-full rounded-xl border p-3 outline-none"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="example@mail.com"
        />

        <label className="mt-4 block text-sm font-semibold text-slate-700">Գաղտնաբառ</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border p-3 outline-none"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
        />

        <button className="mt-6 w-full rounded-xl bg-sky-700 py-3 text-white font-semibold hover:bg-sky-800">
          Գրանցվել
        </button>

        <div className="mt-4 text-sm text-slate-600">
          Ունե՞ս հաշիվ․ <Link className="text-sky-700 font-semibold" to="/login">Մուտք</Link>
        </div>
      </form>
    </div>
  );
}