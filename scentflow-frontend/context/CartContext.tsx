"use client";

import { CartItem, Product } from "@/types";
import { ReactNode, useState, createContext, useContext } from "react";

interface CartContextType {
  cart: CartItem[];
  totalPrice: number;
  clearCart: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addToCart: (product: Product, quantity?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) return;
    const amount = Math.max(1, Math.floor(quantity));
    setCart((previous) => {
      const existing = previous.find((item) => item.id === product.id);
      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, ...product, quantity: Math.min(product.stock, item.quantity + amount) }
            : item,
        );
      }
      return [...previous, { ...product, quantity: Math.min(product.stock, amount) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((previous) => previous.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const current = cart.find((item) => item.id === productId);
    if (quantity <= 0 || (current && current.stock <= 0)) {
      removeFromCart(productId);
      return;
    }
    setCart((previous) =>
      previous.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(item.stock, Math.floor(quantity)) }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart harus digunakan di dalam CartProvider");
  return context;
}
