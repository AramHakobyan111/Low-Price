import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); 
  // item shape: { _id, name, price, image, qty }

  function addToCart(product) {
    setItems((prev) => {
      const found = prev.find((x) => x._id === product._id);
      if (found) {
        return prev.map((x) =>
          x._id === product._id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        },
      ];
    });
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((x) => x._id !== id));
  }

  function setQty(id, qty) {
    const q = Number(qty);
    if (!Number.isFinite(q)) return;
    setItems((prev) =>
      prev
        .map((x) => (x._id === id ? { ...x, qty: q } : x))
        .filter((x) => x.qty > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, x) => sum + x.qty, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, x) => sum + x.qty * x.price, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}