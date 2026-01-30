// src/components/__tests__/Cart.integration.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../redux/cartSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "../Home";
import * as productService from "../../firebase/productService";

// Mock products
const mockProducts = [
  { id: "1", name: "Product 1", price: 10, image: "", rating: 0 },
  { id: "2", name: "Product 2", price: 20, image: "", rating: 0 },
];

// Mock Firebase fetch
jest
  .spyOn(productService, "getProducts")
  .mockResolvedValue(mockProducts as any);

// Redux store
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// React Query client
const queryClient = new QueryClient();

describe("Cart integration", () => {
  test("adds product to cart and updates UI", async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </Provider>,
    );

    // Wait for Add to Cart buttons
    await waitFor(() => {
      expect(
        screen.getAllByRole("button", { name: /add to cart/i }).length,
      ).toBeGreaterThan(0);
    });

    // Click first Add to Cart
    const addButtons = screen.getAllByRole("button", { name: /add to cart/i });
    fireEvent.click(addButtons[0]);

    // Check Redux state safely
    const state = store.getState();
    const cartState = state.cart;

    // Detect array dynamically (use a runtime-safe lookup to satisfy TypeScript)
    const dynamic = cartState as unknown as Record<string, any>;
    const items = dynamic.items || dynamic.cartItems || dynamic.products || [];

    expect(items.length).toBeGreaterThan(0);
  });
});
