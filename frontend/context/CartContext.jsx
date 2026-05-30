import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});

  const orderItems = useMemo(
    () =>
      Object.values(cart).filter(
        (item) => item?.product && Number(item.quantity) > 0
      ),
    [cart]
  );

  const totalItems = useMemo(
    () => orderItems.reduce((acc, item) => acc + item.quantity, 0),
    [orderItems]
  );

  const subtotal = useMemo(
    () =>
      orderItems.reduce((sum, item) => {
        if (!item.product.price) {
          return sum;
        }
        return sum + item.product.price * item.quantity;
      }, 0),
    [orderItems]
  );

  function handleQuantityChange(product, quantity) {
    const safeQuantity = Math.max(0, Number(quantity) || 0);

    setCart((prev) => ({
      ...prev,
      [product._id]: {
        product,
        quantity: safeQuantity
      }
    }));
  }

  function handleAddToCart(product) {
    setCart((prev) => {
      const existingQuantity = prev[product._id]?.quantity || 0;
      return {
        ...prev,
        [product._id]: {
          product,
          quantity: existingQuantity > 0 ? existingQuantity : 1
        }
      };
    });
  }

  function clearCart() {
    setCart({});
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        orderItems,
        totalItems,
        subtotal,
        handleQuantityChange,
        handleAddToCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
