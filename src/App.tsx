// src/App.tsx
import React from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Badge,
  NavDropdown,
} from "react-bootstrap";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Checkout from "./pages/Checkout";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProductManager from "./pages/ProductManager";
import { useAuth } from "./hooks/useAuth";
import { logoutUser } from "./firebase/authService";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import OrderHistory from "./pages/orderHistory";
import OrderDetails from "./pages/orderDetails";

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const cartCount = useSelector((state: RootState) =>
    state.cart.products.reduce((sum, p) => sum + (p.quantity || 0), 0),
  );

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Product Catalog
          </Navbar.Brand>

          <Nav className="ms-auto align-items-center">
            {/* Cart link */}
            <Nav.Link onClick={() => navigate("/cart")}>
              Cart{" "}
              <Badge bg="light" text="dark">
                {cartCount}
              </Badge>
            </Nav.Link>

            {/* Logged-in user */}
            {user ? (
              <NavDropdown
                title={user.displayName || "Profile"}
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  My Profile
                </NavDropdown.Item>

                <NavDropdown.Item onClick={() => navigate("/admin/products")}>
                  Manage Products
                </NavDropdown.Item>

                <NavDropdown.Item onClick={() => navigate("/order-history")}>
                  Order History
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item onClick={logoutUser}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                {/* Guest / not logged in */}
                <Button
                  variant="outline-light"
                  className="ms-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>

                <Button
                  variant="light"
                  className="ms-2"
                  onClick={() => navigate("/login?mode=register")}
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/order-history"
            element={user ? <OrderHistory /> : <Navigate to="/login" />}
          />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/products" element={<ProductManager />} />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/order-details/:id"
            element={user ? <OrderDetails /> : <Navigate to="/login" />}
          />
        </Routes>
      </Container>
    </>
  );
};

export default App;
