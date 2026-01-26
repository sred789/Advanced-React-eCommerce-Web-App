// src/components/Home.tsx
import React, { useState } from "react";
import { Card, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../firebase/productService";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import type { Product } from "../types/Product";

const Home: React.FC = () => {
  const dispatch = useDispatch();

  // Track which product has been added for temporary feedback
  const [addedProductIds, setAddedProductIds] = useState<string[]>([]);

  // Track quantity selection per product
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Fetch products from Firestore
  const { data: products, isLoading } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) return <Spinner animation="border" />;

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id!] || 1;

    dispatch(
      addToCart({
        product,
        quantity,
      }),
    );

    // Show temporary feedback
    setAddedProductIds((prev) => [...prev, product.id!]);
    setTimeout(() => {
      setAddedProductIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <Row className="g-4">
      {products?.map((product) => (
        <Col key={product.id} xs={12} md={6} lg={4}>
          <Card style={{ height: "100%" }}>
            <Card.Img
              variant="top"
              src={product.image || "https://via.placeholder.com/150"}
              onError={(e) =>
                ((e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150")
              }
              style={{ objectFit: "contain", height: 200 }}
            />
            <Card.Body className="d-flex flex-column">
              <Card.Title>{product.title}</Card.Title>
              <Card.Text style={{ flex: 1 }}>{product.description}</Card.Text>
              <Card.Text>
                <strong>Price:</strong> ${product.price.toFixed(2)}
                <br />
                <strong>Rating:</strong> {product.rating} ⭐
              </Card.Text>

              <Form.Select
                className="mb-2"
                value={quantities[product.id!] || 1}
                onChange={(e) =>
                  setQuantities((prev) => ({
                    ...prev,
                    [product.id!]: parseInt(e.target.value),
                  }))
                }
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Form.Select>

              <Button
                variant={
                  addedProductIds.includes(product.id!) ? "success" : "primary"
                }
                onClick={() => handleAddToCart(product)}
              >
                {addedProductIds.includes(product.id!)
                  ? "Added!"
                  : "Add to Cart"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Home;
