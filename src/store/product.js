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
          // Keep local cart, do not clear
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
        
        try {
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
            // Guest mode: update state cart locally
            set((state) => {
              const existingIndex = state.cart.findIndex(
                (item) =>
                  item.id === product.id &&
                  item.size === sz &&
                  item.color === clr
              );
              let newCart = [...state.cart];
              if (existingIndex > -1) {
                newCart[existingIndex] = {
                  ...newCart[existingIndex],
                  quantity: newCart[existingIndex].quantity + qty,
                };
              } else {
                newCart.push({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image || product.images?.[0] || '/placeholder.png',
                  quantity: qty,
                  size: sz,
                  color: clr,
                });
              }
              return { cart: newCart };
            });
            return { guest: true };
          }
          if (res.ok) {
            const { data } = await res.json();
            set({ cart: data });
          }
        } catch (err) {
          console.error("addToCart error, fallback to local:", err);
          // Fallback locally on network error
          set((state) => {
            const existingIndex = state.cart.findIndex(
              (item) =>
                item.id === product.id &&
                item.size === sz &&
                item.color === clr
            );
            let newCart = [...state.cart];
            if (existingIndex > -1) {
              newCart[existingIndex] = {
                ...newCart[existingIndex],
                quantity: newCart[existingIndex].quantity + qty,
              };
            } else {
              newCart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || product.images?.[0] || '/placeholder.png',
                quantity: qty,
                size: sz,
                color: clr,
              });
            }
            return { cart: newCart };
          });
        }
        return {};
      },
      removeFromCart: async (productId, size = 'M', color = 'White') => {
        try {
          const res = await fetch(`/api/cart/${productId}?size=${encodeURIComponent(size)}&color=${encodeURIComponent(color)}`, { method: 'DELETE' });
          if (res.status === 401) {
            set((state) => ({
              cart: state.cart.filter(
                (item) =>
                  !(item.id === productId && item.size === size && item.color === color)
              ),
            }));
            return;
          }
          if (res.ok) {
            const { data } = await res.json();
            set({ cart: data });
          }
        } catch (err) {
          console.error("removeFromCart error, fallback to local:", err);
          set((state) => ({
            cart: state.cart.filter(
              (item) =>
                !(item.id === productId && item.size === size && item.color === color)
            ),
          }));
        }
      },
      clearCart: async () => {
        try {
          const res = await fetch('/api/cart', { method: 'DELETE' });
          if (res.status === 401) {
            set({ cart: [] });
            return;
          }
          if (res.ok) {
            set({ cart: [] });
          }
        } catch (err) {
          console.error("clearCart error, fallback to local:", err);
          set({ cart: [] });
        }
      },
      syncCart: async () => {
        const state = useProductStore.getState();
        const localCart = state.cart;
        if (localCart && localCart.length > 0) {
          try {
            for (const item of localCart) {
              await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  productId: item.id,
                  quantity: item.quantity,
                  size: item.size,
                  color: item.color
                }),
              });
            }
          } catch (e) {
            console.error("Failed to sync cart:", e);
          }
        }
        // Fetch the updated cart from db
        const res = await fetch('/api/cart');
        if (res.ok) {
          const { data } = await res.json();
          set({ cart: data });
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
      partialize: (state) => ({ favorites: state.favorites, cart: state.cart }),
    }
  )
);
