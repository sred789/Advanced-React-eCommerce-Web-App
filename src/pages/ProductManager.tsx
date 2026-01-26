import React, { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../firebase/productService";
import type { Product } from "../types/Product";
import { Form, Button, Card, Row, Col, Table } from "react-bootstrap";

const emptyProduct: Omit<Product, "id"> = {
  title: "",
  price: 0,
  category: "",
  description: "",
  image: "",
  rating: 0,
};

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch products from Firestore
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      const data = await getProducts();
      if (isMounted) {
        setProducts(data);
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.image.trim()) newErrors.image = "Image URL is required";
    if (form.price <= 0) newErrors.price = "Price must be greater than 0";
    if (form.rating < 0 || form.rating > 5)
      newErrors.rating = "Rating must be between 0 and 5";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (editingId) {
      await updateProduct(editingId, form);
      setEditingId(null);
    } else {
      await addProduct(form);
    }

    setForm(emptyProduct);
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  const handleEdit = (product: Product) => {
    if (!product.id) return;
    setEditingId(product.id);
    setForm({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      rating: product.rating,
    });
    setErrors({});
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2 className="mb-4">Product Manager</h2>

      {/* Form */}
      <Card className="mb-4 p-3">
        <h5>{editingId ? "Edit Product" : "Add Product"}</h5>
        <Form noValidate>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  placeholder="Title"
                  value={form.title}
                  isInvalid={!!errors.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  placeholder="Category"
                  value={form.category}
                  isInvalid={!!errors.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0" // visible hint, not actual value
                  value={form.price === 0 ? "" : form.price} // show empty string if 0
                  min={0}
                  isInvalid={!!errors.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  value={form.rating}
                  isInvalid={!!errors.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: Number(e.target.value) })
                  }
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.rating}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  placeholder="Image URL"
                  value={form.image}
                  isInvalid={!!errors.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Form.Group>

          <Button variant="primary" onClick={handleSubmit}>
            {editingId ? "Update Product" : "Add Product"}
          </Button>
        </Form>
      </Card>

      {/* Products Table */}
      <h5>Products List</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.rating}</td>
              <td>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                )}
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductManager;
