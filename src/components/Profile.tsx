// src/components/Profile.tsx
import React, { useEffect, useState } from "react";
import { Card, Form, Button, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import {
  getUserProfile,
  updateUserProfile,
  deleteAccount,
} from "../firebase/userService";
import { useNavigate } from "react-router-dom";

/**
 * Firestore user profile shape
 * This should match what you store in the `users` collection
 */
interface UserProfile {
  displayName?: string;
  address?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  // Load user profile
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const data = (await getUserProfile(user.uid)) as
          | UserProfile
          | undefined;

        setDisplayName(data?.displayName ?? "");
        setAddress(data?.address ?? "");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load profile");
        }
      }
    };

    loadProfile();
  }, [user]);

  // Save profile updates
  const handleUpdate = async (): Promise<void> => {
    if (!user) return;

    try {
      await updateUserProfile(user.uid, { displayName, address });
      setMessage("Profile updated successfully");
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
      setMessage("");
    }
  };

  // Delete account
  const handleDeleteAccount = async (): Promise<void> => {
    if (!user) return;

    try {
      await deleteAccount(user);
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete account");
      }
    }
  };

  return (
    <Card style={{ maxWidth: 500 }} className="mx-auto">
      <Card.Body>
        <Card.Title>Profile</Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDisplayName(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddress(e.target.value)
              }
            />
          </Form.Group>

          <Button className="me-2" onClick={handleUpdate}>
            Save Changes
          </Button>

          <Button variant="danger" onClick={() => setShowModal(true)}>
            Delete Account
          </Button>
        </Form>

        {/* Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setShowModal(false);
                handleDeleteAccount();
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default Profile;
