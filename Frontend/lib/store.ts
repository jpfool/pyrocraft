import { create } from 'zustand';

export interface CartItem {
  id: number;
  name: string;
  emoji: string;
  price: number;
  qty: number;
  image_url?: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  cart: [],
  
  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map(item =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        };
      }
      return {
        cart: [...state.cart, { ...product, qty: 1 }]
      };
    });
  },
  
  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter(item => item.id !== id)
    }));
  },
  
  updateQty: (id, qty) => {
    set((state) => {
      if (qty <= 0) {
        return { cart: state.cart.filter(item => item.id !== id) };
      }
      return {
        cart: state.cart.map(item =>
          item.id === id ? { ...item, qty } : item
        )
      };
    });
  },
  
  clearCart: () => set({ cart: [] }),
  
  getTotal: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  },
  
  getCount: () => {
    return get().cart.reduce((sum, item) => sum + item.qty, 0);
  }
}));
