import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { clearCart, removeFromCart } from "../redux/cartSlice";
import { useAuth } from "../hooks/useAuth";
import { getGuestId } from "../utils/guest";
import { createOrder } from "../firebase/orderService";
import type { OrderProduct } from "../firebase/orderService";
import { Button, ListGroup, Spinner, Alert } from "react-bootstrap";

const Checkout: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Ask for confirmation first
    const confirmed = window.confirm(
      `Are you sure you want to place this order for $${totalPrice.toFixed(2)}?`,
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);

      const orderUserId = user?.uid ?? `guest_${getGuestId()}`;

      // Flatten cart into OrderProduct[]
      const orderProducts: OrderProduct[] = cart.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));

      // Send order to Firestore
      await createOrder(orderUserId, orderProducts, totalPrice);

      // Only clear cart after successful order
      dispatch(clearCart());

      // Show success message
      setSuccess("Your order has been placed successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="mb-4">Checkout</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ListGroup className="mb-3">
            {cart.map((item) => (
              <ListGroup.Item
                key={item.product.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.product.title}</strong>
                  <div className="text-muted">
                    {item.quantity} × ${item.product.price.toFixed(2)}
                  </div>
                </div>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => dispatch(removeFromCart(item.product.id))}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h5>Total: ${totalPrice.toFixed(2)}</h5>

          <Button
            variant="success"
            className="mt-3"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Place Order"}
          </Button>
        </>
      )}
    </div>
  );
};

export default Checkout;
