import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  // Khởi tạo từ localStorage nếu có
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart_items');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Cập nhật localStorage mỗi lần items thay đổi
  React.useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const addToCart = product => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity++;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = id => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, qty) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  // Đóng gói API cho đồng bộ với các component khác: cart: {items: [...]}
  return (
    <CartContext.Provider
      value={{
        cart: { items }, // Thay đổi ở đây để Navbar, CartPage... đều dùng cart.items
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
