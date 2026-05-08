"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";

export type CartProduct = {
  color?: string;
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  size?: string;
  slug: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartState = {
  addItem: (product: CartProduct, quantity?: number) => void;
  clear: () => void;
  decreaseItem: (id: string, size?: string, color?: string) => void;
  increaseItem: (id: string, size?: string, color?: string) => void;
  items: CartItem[];
  removeItem: (id: string, size?: string, color?: string) => void;
};

function sameVariant(item: CartItem, id: string, size?: string, color?: string) {
  return item.id === id && item.size === size && item.color === color;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find((item) =>
            sameVariant(item, product.id, product.size, product.color),
          );

          if (!existingItem) {
            return { items: [...state.items, { ...product, quantity }] };
          }

          return {
            items: state.items.map((item) =>
              sameVariant(item, product.id, product.size, product.color)
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          };
        }),
      clear: () => set({ items: [] }),
      decreaseItem: (id, size, color) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              sameVariant(item, id, size, color)
                ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),
      increaseItem: (id, size, color) =>
        set((state) => ({
          items: state.items.map((item) =>
            sameVariant(item, id, size, color) ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),
      items: [],
      removeItem: (id, size, color) =>
        set((state) => ({
          items: state.items.filter((item) => !sameVariant(item, id, size, color)),
        })),
    }),
    {
      name: "newera-cart",
    },
  ),
);

export function useCartHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribeStore = useCartStore.subscribe(onStoreChange);
      const unsubscribeHydration = useCartStore.persist.onFinishHydration(onStoreChange);

      return () => {
        unsubscribeStore();
        unsubscribeHydration();
      };
    },
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
