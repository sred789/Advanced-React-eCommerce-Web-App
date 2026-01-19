// src/components/Home.tsx
import React from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import type { Product } from "../redux/cartSlice";

const fetchCategories = async (): Promise<string[]> => {
  const res = await axios.get("https://fakestoreapi.com/products/categories");
  return res.data;
};

const fetchProducts = async (category?: string): Promise<Product[]> => {
  const url = category
    ? `https://fakestoreapi.com/products/category/${category}`
    : "https://fakestoreapi.com/products";
  const res = await axios.get(url);
  return res.data;
};

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [quantities, setQuantities] = React.useState<Record<number, number>>(
    {},
  );
  const [addedProductId, setAddedProductId] = React.useState<number | null>(
    null,
  );

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
  });

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;

    dispatch(addToCart({ product, quantity }));

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://via.placeholder.com/150";
  };

  return (
    <>
      <Form.Select
        className="mb-3"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Form.Select>

      <Row>
        {products.map((product) => (
          <Col md={4} key={product.id} className="mb-4">
            <Card>
              <Card.Img
                src={product.image}
                onError={handleImageError}
                style={{ height: "300px", objectFit: "contain" }}
              />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>
                  <strong>${product.price}</strong>
                  <br />
                  Rating: {product.rating.rate}
                  <br />
                  {product.description.slice(0, 80)}...
                </Card.Text>

                <Form.Select
                  className="mb-2"
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [product.id]: Number(e.target.value),
                    })
                  }
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      Qty: {num}
                    </option>
                  ))}
                </Form.Select>

                <Button
                  variant={
                    addedProductId === product.id ? "success" : "primary"
                  }
                  onClick={() => handleAddToCart(product)}
                  disabled={addedProductId === product.id}
                >
                  {addedProductId === product.id ? "Added ✓" : "Add to Cart"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;
