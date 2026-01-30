// src/pages/__tests__/ProductManager.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import ProductManager from "../ProductManager";
import * as productService from "../../firebase/productService";
import type { Product } from "../../types/Product";

jest.mock("../../firebase/productService");

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Test Product",
    price: 10,
    category: "Test Category",
    description: "Test Description",
    image: "Test Image",
    rating: 0,
  },
];

describe("ProductManager component", () => {
  beforeEach(() => {
    (productService.getProducts as jest.Mock).mockResolvedValue(mockProducts);
  });

  test("renders product manager title", async () => {
    render(<ProductManager />);

    await waitFor(() =>
      expect(screen.getByText(/product manager/i)).toBeInTheDocument(),
    );
  });

  test("renders products after fetch", async () => {
    render(<ProductManager />);

    for (const product of mockProducts) {
      const element = await screen.findByText(product.title);
      expect(element).toBeInTheDocument();
    }
  });
});
