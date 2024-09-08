import {create} from 'zustand';

interface CartItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  cartItems: CartItem[];
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  totalPrice: 0,
  addItem: (item: CartItem) => set((state) => {
    const existingItem = state.cartItems.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
      return { ...state, totalPrice: state.totalPrice + item.price };
    }
    return {
      cartItems: [...state.cartItems, { ...item, quantity: 1 }],
      totalPrice: state.totalPrice + item.price,
    };
  }),
  removeItem: (id: number) => set((state) => {
    const itemToRemove = state.cartItems.find(i => i.id === id);
    if (!itemToRemove) return state;
    const updatedCartItems = state.cartItems.filter(i => i.id !== id);
    return {
      cartItems: updatedCartItems,
      totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
    };
  }),
  clearCart: () => set({ cartItems: [], totalPrice: 0 }),
}));
