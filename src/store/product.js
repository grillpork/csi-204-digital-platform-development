import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductStore = create(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        if (existingItem) {
          // ถ้ามีสินค้านี้ในตะกร้าแล้ว ให้บวกจำนวนเพิ่ม
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        } else {
          // ถ้ายังไม่มี ให้เพิ่มสินค้าใหม่พร้อมระบุจำนวน 1
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }
      }),
      removeFromCart: (productId) => set((state) => ({
        // เอาสินค้าออกจากตะกร้า
        cart: state.cart.filter((item) => item.id !== productId)
      })),
      clearCart: () => set({ cart: [] }),
      toggleFavorite: (productId) => set((state) => {
        if (state.favorites.includes(productId)) {
          return { favorites: state.favorites.filter(id => id !== productId) };
        } else {
          return { favorites: [...state.favorites, productId] };
        }
      })
    }),
    {
      name: 'product-storage', // key in local storage
    }
  )
);
