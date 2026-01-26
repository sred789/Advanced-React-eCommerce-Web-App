// src/firebase/orderService.ts
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../types/Product";

/**
 * Product snapshot stored in an order
 */
export interface OrderProduct extends Product {
  quantity: number;
}

/**
 * Firestore Order shape
 */
export interface Order {
  id: string;
  userId: string;
  products: OrderProduct[];
  totalPrice: number;
  createdAt?: Timestamp;
}

/**
 * CREATE: Store a new order
 */
export const createOrder = async (
  userId: string,
  products: OrderProduct[],
  totalPrice: number,
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      userId,
      products,
      totalPrice,
      createdAt: serverTimestamp(),
    });

    return docRef.id; // return the ID of the created order
  } catch (error) {
    console.error("Failed to create order in Firestore:", error);
    throw error; // propagate to the caller
  }
};

/**
 * READ: Get all orders for a user
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(collection(db, "orders"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  console.log("Fetched orders:", snapshot.docs.length);

  return snapshot.docs.map(
    (docSnap) =>
      ({
        id: docSnap.id,
        ...docSnap.data(),
      }) as Order,
  );
};

/**
 * READ: Get a single order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const ref = doc(db, "orders", orderId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  } as Order;
};
