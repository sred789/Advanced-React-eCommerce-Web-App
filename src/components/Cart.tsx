// src/components/Cart.tsx
import React from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { removeFromCart } from "../redux/cartSlice";

const Cart: React.FC = () => {
  const products = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = products.reduce(
    (sum, p) => sum + p.product.price * (p.quantity || 1),
    0,
  );
  const totalCount = products.reduce((sum, p) => sum + (p.quantity || 1), 0);

  return (
    <>
      <h3>Shopping Cart</h3>
      {products.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product.id}>
                  <td>
                    <img
                      src={p.product.image}
                      alt={p.product.title}
                      width={50}
                      height={50}
                    />
                  </td>
                  <td>{p.product.title}</td>
                  <td>${p.product.price.toFixed(2)}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => dispatch(removeFromCart(p.product.id))}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <p>
            <strong>Total Items:</strong> {totalCount}
          </p>
          <p>
            <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
          </p>

          {/* Navigate to Checkout page instead of clearing cart */}
          <Button variant="success" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </>
  );
};

export default Cart;
