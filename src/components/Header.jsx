import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getAuth, clearAuth } from "../auth/storage";

export default function Header() {
  const { totalItems } = useCart();
  const auth = getAuth();
  const nav = useNavigate();

  const isLoggedIn = !!auth?.token;
  const isAdmin = auth?.user?.role === "admin";

  function logout() {
    clearAuth();
    nav("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-sky-950 border-b border-sky-900/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center">
        
        {/* LEFT: Logo + Name */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Low Price logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-base font-semibold text-white">
            Low Price
          </span>
        </Link>

        {/* RIGHT: Navigation */}
        <nav className="ml-auto flex items-center gap-4">
          <Link
            to="/products"
            className="text-sm font-medium text-sky-100 hover:text-white transition"
          >
            Ապրանքներ
          </Link>

          <Link
            to="/cart"
            className="relative text-sm font-medium text-sky-100 hover:text-white transition"
          >
            Զամբյուղ
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-sky-200 hover:text-white transition"
            >
              Admin
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-sky-100 hover:text-white transition"
              >
                Մուտք
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-sky-950 hover:bg-sky-100 transition"
              >
                Գրանցում
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Ելք
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}