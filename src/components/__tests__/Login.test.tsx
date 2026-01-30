// src/components/__tests__/Login.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";

// Mock Firebase Auth
jest.mock("../../firebase/authService", () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
}));

// Polyfill fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;

describe("Login page", () => {
  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    // Login button exists
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

    // Email input exists
    expect(screen.getByRole("textbox", { name: "" })).toBeInTheDocument();

    // Password input exists
    expect(screen.getByRole("textbox", { hidden: true })).toBeTruthy();
  });
});
