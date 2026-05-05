import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('mi_tienda_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mi_tienda_cart', JSON.stringify(cart));
  }, [cart]);

  // MODIFICADO: Ahora valida el stock y devuelve un booleano
  const addToCart = (product, quantity = 1) => {
    let success = true; // Variable para saber si se pudo agregar

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const currentQuantity = existing ? existing.quantity : 0;

      // Validación de stock
      if (currentQuantity + quantity > product.stock_actual) {
        success = false;
        return prev; // Retornamos el carrito sin cambios
      }

      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    if (success) {
      setIsSidebarOpen(true);
    }
    
    return success; // Devolvemos el resultado a la ProductCard
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // MODIFICADO: Prevenimos que se exceda el stock desde el carrito lateral
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        // Validación de stock en el botón de + del carrito
        if (quantity > item.stock_actual) return item; 
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.precio_venta * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, 
      cartTotal, cartCount, isSidebarOpen, setIsSidebarOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}