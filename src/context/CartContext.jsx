import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  function addToCart(product) {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if ((product.stock ?? 0) <= 0) {
        return prev;
      }

      if (existing) {
        if (existing.qty >= (product.stock ?? 0)) {
          return prev;
        }

        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((item) => item._id !== id));
  }

  function updateQty(id, qty) {
    setItems((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;

        const maxStock = item.stock ?? qty;
        const safeQty = Math.max(1, Math.min(qty, maxStock));

        return { ...item, qty: safeQty };
      })
    );
  }

  function clearCart() {
    setItems([]);
    localStorage.removeItem("cartItems");
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}