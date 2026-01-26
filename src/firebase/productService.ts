import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product } from "../types/Product";

const productsRef = collection(db, "products");

export const getProducts = async (): Promise<Product[]> => {
  console.log("GET PRODUCTS");
  const snapshot = await getDocs(query(productsRef));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
};

export const addProduct = async (
  product: Omit<Product, "id">,
): Promise<void> => {
  await addDoc(productsRef, product);
};

export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id">>,
): Promise<void> => {
  await updateDoc(doc(db, "products", id), data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "products", id));
};
