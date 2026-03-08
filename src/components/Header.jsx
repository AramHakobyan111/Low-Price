import { Link, useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaShoppingCart,
  FaUserCircle,
} from "react-icons/fa";
import { getAuth, clearAuth } from "../auth/storage";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const auth = getAuth();
  const user = auth?.user || null;
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex min-h-[78px] items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Low Price"
                className="h-18 w-auto object-contain"
              />

              <div className="hidden leading-tight sm:block">
                <div className="text-xs text-slate-500">
                  Տան և կենցաղի ապրանքներ
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              <Link
                to="/"
                className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
              >
                Գլխավոր
              </Link>

              <Link
                to="/products"
                className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
              >
                Ապրանքներ
              </Link>

              {user && (
                <Link
                  to="/my-orders"
                  className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
                >
                  Իմ պատվերները
                </Link>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
                  >
                    Admin Panel
                  </Link>

                  <Link
                    to="/admin/orders"
                    className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
                  >
                    Admin Orders
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-sky-700 hover:text-sky-700"
                title="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-sky-700 hover:text-sky-700"
                title="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.wildberries.ru/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-700 hover:text-sky-700"
                title="Wildberries"
              >
                WB
              </a>

              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-sky-700 hover:text-sky-700"
                title="TikTok"
              >
                <FaTiktok />
              </a>
            </div>

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-800 transition hover:border-sky-700 hover:text-sky-700"
              title="Զամբյուղ"
            >
              <FaShoppingCart />

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-700 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-3 py-2 sm:flex">
                  <FaUserCircle className="text-slate-500" />
                  <div className="max-w-[130px] truncate text-sm font-medium text-slate-700">
                    {user.name || user.email || "User"}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Ելք
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-sky-700 hover:text-sky-700"
                >
                  Մուտք
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                  Գրանցում
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 py-3 lg:hidden">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
          >
            Գլխավոր
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
          >
            Ապրանքներ
          </Link>

          {user && (
            <Link
              to="/my-orders"
              className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
            >
              Իմ պատվերները
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin"
                className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
              >
                Admin Panel
              </Link>

              <Link
                to="/admin/orders"
                className="text-sm font-medium text-slate-700 transition hover:text-sky-700"
              >
                Admin Orders
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}