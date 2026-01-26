// src/pages/OrderDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, ListGroup, Spinner } from "react-bootstrap";
import { getOrderById } from "../firebase/orderService";
import type { Order } from "../firebase/orderService";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      const data = await getOrderById(id);
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!order) {
    return (
      <>
        <p>Order not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </>
    );
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: 600 }}>
      <Card.Body>
        <Card.Title>Order Details</Card.Title>

        <p>
          <strong>Order ID:</strong> {order.id}
        </p>

        <p>
          <strong>Date:</strong> {order.createdAt?.toDate().toLocaleString()}
        </p>

        <ListGroup className="mb-3">
          {order.products.map((product) => (
            <ListGroup.Item key={product.id}>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{product.title}</strong>
                  <div className="text-muted">
                    {product.quantity} × ${product.price}
                  </div>
                </div>
                <div>${(product.quantity * product.price).toFixed(2)}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <h5>Total: ${order.totalPrice.toFixed(2)}</h5>

        <Button className="mt-3" onClick={() => navigate(-1)}>
          Back to Orders
        </Button>
      </Card.Body>
    </Card>
  );
};

export default OrderDetails;
