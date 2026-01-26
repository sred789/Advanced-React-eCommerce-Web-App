import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getUserOrders } from "../firebase/orderService";
import type { Order } from "../firebase/orderService";
import { Spinner, Alert, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderHistory: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    console.log("USER UID:", user.uid);

    const fetchOrders = async () => {
      try {
        console.log("📦 Fetching orders for:", user.uid);
        const data = await getUserOrders(user.uid);
        console.log("✅ Orders fetched:", data);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading || loading) return <Spinner />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2 className="mb-4">Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item
              key={order.id}
              action
              onClick={() => navigate(`/order-details/${order.id}`)}
            >
              <div>
                <strong>Order ID:</strong> {order.id}
              </div>

              <div>
                <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
              </div>

              <div className="text-muted">
                {order.createdAt?.toDate().toLocaleString()}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default OrderHistory;
