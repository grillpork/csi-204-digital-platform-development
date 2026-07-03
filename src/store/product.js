import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProductStore = create(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      fetchCart: async () => {
        const res = await fetch('/api/cart');
        if (res.status === 401) {
          set({ cart: [] });
          return;
        }
        if (res.ok) {
          const { data } = await res.json();
          set({ cart: data });
        }
      },
      addToCart: async (product, quantity = null, size = null, color = null) => {
        const qty = quantity !== null ? quantity : (product.quantity || 1);
        const sz = size !== null ? size : (product.size || 'M');
        const clr = color !== null ? color : (product.color || 'White');
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            quantity: qty,
            size: sz,
            color: clr
          }),
        });
        if (res.status === 401) {
          return { needLogin: true };
        }
        if (res.ok) {
          const { data } = await res.json();
          set({ cart: data });
        }
        return {};
      },
      removeFromCart: async (productId, size = 'M', color = 'White') => {
        const res = await fetch(`/api/cart/${productId}?size=${encodeURIComponent(size)}&color=${encodeURIComponent(color)}`, { method: 'DELETE' });
        if (res.ok) {
          const { data } = await res.json();
          set({ cart: data });
        }
      },
      clearCart: async () => {
        const res = await fetch('/api/cart', { method: 'DELETE' });
        if (res.ok) {
          set({ cart: [] });
        }
      },
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
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
