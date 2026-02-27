import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hombr-cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('hombr-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, talla, color, cantidad = 1) => {
    setCart(prev => {
      const key = `${product._id}-${talla}-${color}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, cantidad: i.cantidad + cantidad } : i);
      }
      return [...prev, { key, ...product, talla, color, cantidad }];
    });
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(i => i.key !== key));
  };

  const updateQuantity = (key, cantidad) => {
    if (cantidad < 1) return removeFromCart(key);
    setCart(prev => prev.map(i => i.key === key ? { ...i, cantidad } : i));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const count = cart.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
