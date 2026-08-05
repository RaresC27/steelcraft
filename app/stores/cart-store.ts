import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
  stock: number;
};

type AddItemInput = Omit<CartItem, "quantity">;

type CartState = {
  items: CartItem[];

  addItem: (item: AddItemInput) => void;
  removeItem: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  setQuantity: (
    productId: number,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.productId === newItem.productId,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) => {
                if (
                  item.productId !== newItem.productId
                ) {
                  return item;
                }

                return {
                  ...item,
                  quantity: Math.min(
                    item.quantity + 1,
                    item.stock,
                  ),
                };
              }),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...newItem,
                quantity: 1,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.productId !== productId,
          ),
        }));
      },

      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId !== productId) {
              return item;
            }

            return {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.stock,
              ),
            };
          }),
        }));
      },

      decreaseQuantity: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.productId !== productId) {
                return item;
              }

              return {
                ...item,
                quantity: item.quantity - 1,
              };
            })
            .filter((item) => item.quantity > 0),
        }));
      },

      setQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.productId !== productId) {
                return item;
              }

              const safeQuantity = Math.min(
                Math.max(quantity, 0),
                item.stock,
              );

              return {
                ...item,
                quantity: safeQuantity,
              };
            })
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => {
        set({
          items: [],
        });
      },
    }),
    {
      name: "steelcraft-cart",
    },
  ),
);