// src/components/Login.tsx
import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { loginUser, registerUser } from "../firebase/authService";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 🔑 Sync URL → state
  useEffect(() => {
    setIsRegister(searchParams.get("mode") === "register");
  }, [searchParams]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await registerUser(email, password, displayName);
      } else {
        await loginUser(email, password);
      }

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Authentication failed");
      }
    }
  };

  return (
    <Card style={{ maxWidth: 400 }} className="mx-auto">
      <Card.Body>
        <Card.Title>{isRegister ? "Register" : "Login"}</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {isRegister && (
            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDisplayName(e.target.value)
                }
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Form.Group>

          <Button type="submit" className="w-100">
            {isRegister ? "Create Account" : "Login"}
          </Button>
        </Form>

        <Button
          variant="secondary"
          className="mt-3 w-100"
          onClick={() => navigate("/")}
        >
          Continue as Guest
        </Button>

        <div className="text-center mt-3">
          {isRegister ? (
            <span>
              Already have an account?{" "}
              <Button variant="link" onClick={() => navigate("/login")}>
                Login
              </Button>
            </span>
          ) : (
            <span>
              Don’t have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/login?mode=register")}
              >
                Register
              </Button>
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Login;
