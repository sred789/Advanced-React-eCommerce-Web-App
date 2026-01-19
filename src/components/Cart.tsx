// src/components/Cart.tsx
import React from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { removeFromCart, clearCart } from "../redux/cartSlice";

const Cart: React.FC = () => {
  const products = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();
  const [checkoutSuccess, setCheckoutSuccess] = React.useState(false);

  const totalPrice = products.reduce(
    (sum, p) => sum + p.price * (p.quantity || 1),
    0,
  );
  const totalCount = products.reduce((sum, p) => sum + (p.quantity || 1), 0);

  const handleCheckout = () => {
    dispatch(clearCart());
    setCheckoutSuccess(true);
    setTimeout(() => setCheckoutSuccess(false), 3000);
  };

  return (
    <>
      {checkoutSuccess && (
        <Alert variant="success">Checkout successful! Cart cleared.</Alert>
      )}
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
                <tr key={p.id}>
                  <td>
                    <img src={p.image} alt={p.title} width={50} height={50} />
                  </td>
                  <td>{p.title}</td>
                  <td>${p.price}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => dispatch(removeFromCart(p.id))}
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
          <Button onClick={handleCheckout}>Checkout</Button>
        </>
      )}
    </>
  );
};

export default Cart;
