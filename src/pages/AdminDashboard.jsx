import { useEffect, useState } from "react";
import { authPost, authPut, authDelete, get, uploadImage } from "../api/http";
import { getAuth, clearAuth } from "../auth/storage";
import { useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = [
  { value: "", label: "Ընտրիր կատեգորիա" },
  { value: "cleaning", label: "Մաքրություն" },
  { value: "kitchen", label: "Խոհանոց" },
  { value: "bathroom", label: "Սանհանգույց" },
  { value: "storage", label: "Պահեստավորում" },
];

export default function AdminDashboard() {
  const nav = useNavigate();
  const auth = getAuth();
  const token = auth?.token;
  const isAdmin = auth?.user?.role === "admin";

  // ADD form
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    category: "",
    description: "",
  });

  // ADD upload
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // LIST
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Messages
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // EDIT
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    category: "",
    description: "",
  });

  // EDIT upload
  const [editFile, setEditFile] = useState(null);
  const [editFilePreview, setEditFilePreview] = useState("");
  const [editUploading, setEditUploading] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setErr("");
    try {
      const data = await get("/products");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!auth) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center px-4">
        <div className="rounded-2xl border bg-white p-6">Մուտք արա ադմինի համար։</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center px-4">
        <div className="rounded-2xl border bg-white p-6">Այս էջը միայն ադմինների համար է։</div>
      </div>
    );
  }

  function logout() {
    clearAuth();
    nav("/");
  }

  async function handleUploadAdd() {
    if (!file) return;

    setUploading(true);
    setErr("");
    setMsg("");

    try {
      const data = await uploadImage(file, token); // { url }
      setForm((prev) => ({ ...prev, image: data.url }));
      setMsg("✅ Նկարը upload եղավ (ավելացնելու համար)");
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    try {
      await authPost("/products", form, token);

      setMsg("✅ Ապրանքը ավելացվեց");
      setForm({
        name: "",
        price: "",
        stock: "",
        image: "",
        category: "",
        description: "",
      });

      // reset add upload previews
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFile(null);
      setFilePreview("");

      await loadProducts();
    } catch (e) {
      setErr(e.message);
    }
  }

  function startEdit(p) {
    setEditingId(p._id);
    setEdit({
      name: p.name || "",
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      image: p.image || "",
      category: p.category || "",
      description: p.description || "",
    });

    // reset edit upload previews
    if (editFilePreview) URL.revokeObjectURL(editFilePreview);
    setEditFile(null);
    setEditFilePreview("");

    setMsg("");
    setErr("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEdit({
      name: "",
      price: "",
      stock: "",
      image: "",
      category: "",
      description: "",
    });

    if (editFilePreview) URL.revokeObjectURL(editFilePreview);
    setEditFile(null);
    setEditFilePreview("");
  }

  async function handleUploadEdit() {
    if (!editFile) return;

    setEditUploading(true);
    setErr("");
    setMsg("");

    try {
      const data = await uploadImage(editFile, token); // { url }
      setEdit((prev) => ({ ...prev, image: data.url }));
      setMsg("✅ Նկարը upload եղավ (խմբագրման համար)");
    } catch (e) {
      setErr(e.message);
    } finally {
      setEditUploading(false);
    }
  }

  async function saveEdit() {
    setMsg("");
    setErr("");

    try {
      await authPut(`/products/${editingId}`, edit, token);
      setMsg("✅ Պահվեց");
      setEditingId(null);

      if (editFilePreview) URL.revokeObjectURL(editFilePreview);
      setEditFile(null);
      setEditFilePreview("");

      await loadProducts();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function removeProduct(id) {
    const ok = confirm("Ջնջե՞լ ապրանքը");
    if (!ok) return;

    setMsg("");
    setErr("");

    try {
      await authDelete(`/products/${id}`, token);
      setMsg("✅ Ջնջվեց");
      await loadProducts();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* LEFT: ADD */}
        <div className="rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-950">Admin Panel</h1>
              <p className="mt-1 text-sm text-slate-600">Ավելացնել ապրանք</p>
            </div>
            <button
              onClick={logout}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Ելք
            </button>
          </div>

          {(msg || err) && (
            <div
              className={`mt-4 rounded-xl p-3 text-sm ${
                err ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-800"
              }`}
            >
              {err || msg}
            </div>
          )}

          <form onSubmit={addProduct} className="mt-5 grid gap-3">
            <input
              className="rounded-xl border p-3"
              placeholder="Ապրանքի անուն"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                className="rounded-xl border p-3"
                placeholder="Գին (AMD)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                className="rounded-xl border p-3"
                placeholder="Քանակ"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>

            <select
              className="rounded-xl border p-3 bg-white"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <textarea
              className="rounded-xl border p-3 min-h-[110px]"
              placeholder="Նկարագրություն (օր․ օգտագործում, չափս, նյութ...)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* ADD: choose file -> local preview */}
            <input
              type="file"
              accept="image/*"
              className="rounded-xl border p-3"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);

                if (filePreview) URL.revokeObjectURL(filePreview);
                setFilePreview(f ? URL.createObjectURL(f) : "");
              }}
            />

            <button
              type="button"
              onClick={handleUploadAdd}
              disabled={!file || uploading}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-100 disabled:opacity-50"
            >
              {uploading ? "Upload..." : "Upload նկարը"}
            </button>

            {/* URL input (auto-filled after upload) */}
            <input
              className="rounded-xl border p-3"
              placeholder="Նկարի URL (upload-ից հետո ավտո կլցվի)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />

            {(form.image || filePreview) && (
              <img
                src={form.image || filePreview}
                alt="preview"
                className="h-44 w-full rounded-2xl object-cover border"
              />
            )}

            <button className="rounded-xl bg-sky-700 py-3 text-white font-semibold hover:bg-sky-800">
              Ավելացնել ապրանք
            </button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            Նկար ընտրելուց հետո preview կերևա։ Upload-ը կլցնի URL-ը։ Description-ը ցույց կտանք product-ի էջում։
          </div>
        </div>

        {/* RIGHT: LIST + EDIT */}
        <div className="rounded-3xl border bg-white p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Ապրանքներ</h2>
              <p className="mt-1 text-sm text-slate-600">
                Խմբագրել գին / քանակ / նկար / կատեգորիա / description
              </p>
            </div>

            <button
              onClick={loadProducts}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-slate-100"
            >
              Թարմացնել
            </button>
          </div>

          {loading ? (
            <div className="mt-6 text-sm text-slate-600">Բեռնվում է…</div>
          ) : items.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((p) => (
                <div
                  key={p._id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >
                  <img
                    src={p.image || "/product1.png"}
                    alt={p.name}
                    className="h-40 w-full object-cover"
                  />

                  <div className="p-5">
                    {editingId === p._id ? (
                      <>
                        <input
                          className="w-full rounded-xl border p-2 text-sm"
                          value={edit.name}
                          onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                          placeholder="Անուն"
                        />

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <input
                            className="rounded-xl border p-2 text-sm"
                            value={edit.price}
                            onChange={(e) => setEdit({ ...edit, price: e.target.value })}
                            placeholder="Գին"
                          />
                          <input
                            className="rounded-xl border p-2 text-sm"
                            value={edit.stock}
                            onChange={(e) => setEdit({ ...edit, stock: e.target.value })}
                            placeholder="Քանակ"
                          />
                        </div>

                        <select
                          className="mt-2 w-full rounded-xl border p-2 text-sm bg-white"
                          value={edit.category}
                          onChange={(e) => setEdit({ ...edit, category: e.target.value })}
                        >
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>

                        <textarea
                          className="mt-2 w-full rounded-xl border p-2 text-sm min-h-[90px]"
                          value={edit.description}
                          onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                          placeholder="Նկարագրություն"
                        />

                        {/* EDIT: choose file -> local preview */}
                        <div className="mt-2 grid gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="rounded-xl border p-2 text-sm"
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              setEditFile(f);

                              if (editFilePreview) URL.revokeObjectURL(editFilePreview);
                              setEditFilePreview(f ? URL.createObjectURL(f) : "");
                            }}
                          />

                          <button
                            type="button"
                            onClick={handleUploadEdit}
                            disabled={!editFile || editUploading}
                            className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-100 disabled:opacity-50"
                          >
                            {editUploading ? "Upload..." : "Upload նոր նկար"}
                          </button>

                          <input
                            className="w-full rounded-xl border p-2 text-sm"
                            value={edit.image}
                            onChange={(e) => setEdit({ ...edit, image: e.target.value })}
                            placeholder="Նկարի URL"
                          />

                          {(edit.image || editFilePreview) && (
                            <img
                              src={edit.image || editFilePreview}
                              alt="edit preview"
                              className="h-32 w-full rounded-2xl object-cover border"
                            />
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="rounded-xl bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800"
                          >
                            Պահել
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-xl border px-4 py-2 text-xs font-semibold hover:bg-slate-100"
                          >
                            Չեղարկել
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-slate-950">{p.name}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          Կատեգորիա՝ {p.category || "—"}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sky-700 font-bold">{p.price} ֏</span>
                          <span className="text-xs text-slate-500">Առկա՝ {p.stock ?? 0}</span>
                        </div>

                        {p.description?.trim() && (
                          <div className="mt-3 text-xs text-slate-600 line-clamp-2">
                            {p.description}
                          </div>
                        )}

                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => startEdit(p)}
                            className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-black"
                          >
                            Խմբագրել
                          </button>

                          <button
                            onClick={() => removeProduct(p._id)}
                            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Ջնջել
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              Դեռ ապրանք չկա։ Ավելացրու ձախ մասից։
            </div>
          )}
        </div>
      </div>
    </div>
  );
}