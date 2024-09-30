// store/cartStore.ts
import { create } from "zustand";

interface CartItem {
  price: number;
  id: string;
  name: string;
  price: number;
  totalPrice: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void; // Nueva función para vaciar el carrito
}

const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: i.quantity + item.quantity,
                  totalPrice: (i.quantity + item.quantity) * i.price, // Calcula correctamente el totalPrice
                }
              : i
          ),
        };
      } else {
        return {
          items: [
            ...state.items,
            {
              ...item,
              totalPrice: item.quantity * item.price, // Calcula totalPrice al agregar un nuevo ítem
            },
          ],
        };
      }
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateItemQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.price, // Calcula correctamente el totalPrice al actualizar la cantidad
            }
          : item
      ),
    })),

  clearCart: () => set({ items: [] }), // Implementación de la función para vaciar el carrito
}));


export default useCartStore;
