// src/App.tsx
import React from "react";
import { Container, Navbar, Nav, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import Home from "./components/Home";
import Cart from "./components/Cart";

const App: React.FC = () => {
  const [showCart, setShowCart] = React.useState(false);

  const cartCount = useSelector((state: RootState) =>
    state.cart.products.reduce((sum, p) => sum + (p.quantity || 0), 0),
  );

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => setShowCart(false)}
          >
            Product Catalog
          </Navbar.Brand>

          <Nav>
            <Nav.Link onClick={() => setShowCart(true)}>
              Cart{" "}
              <Badge bg="light" text="dark">
                {cartCount}
              </Badge>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>{showCart ? <Cart /> : <Home />}</Container>
    </>
  );
};

export default App;
