// src/redux/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
  quantity?: number;
}

interface CartState {
  products: Product[];
}

const initialState: CartState = {
  products: JSON.parse(sessionStorage.getItem("cart") || "[]"),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) => {
      const existing = state.products.find(
        (p) => p.id === action.payload.product.id,
      );

      if (existing) {
        existing.quantity! += action.payload.quantity;
      } else {
        state.products.push({
          ...action.payload.product,
          quantity: action.payload.quantity,
        });
      }

      sessionStorage.setItem("cart", JSON.stringify(state.products));
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      sessionStorage.setItem("cart", JSON.stringify(state.products));
    },

    clearCart: (state) => {
      state.products = [];
      sessionStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
