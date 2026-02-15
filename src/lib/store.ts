import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Order, CustomerInfo } from '@/types';

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  
  // Orders (solo admin)
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Admin auth
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const ADMIN_PASSWORD = 'hombr2024'; // Cambiar por tu contraseña

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      
      addToCart: (product, size, color, quantity) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) =>
              item.product.id === product.id &&
              item.selectedSize === size &&
              item.selectedColor === color
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id &&
                item.selectedSize === size &&
                item.selectedColor === color
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { product, quantity, selectedSize: size, selectedColor: color }],
          };
        });
      },

      removeFromCart: (productId, size, color) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(item.product.id === productId &&
                item.selectedSize === size &&
                item.selectedColor === color)
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      // Orders state
      orders: [],

      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        }));
      },

      // Admin auth
      isAdminAuthenticated: false,

      adminLogin: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },

      adminLogout: () => set({ isAdminAuthenticated: false }),
    }),
    {
      name: 'hombr-store',
    }
  )
);
