// src/firebase/authService.ts
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

/* =======================
   REGISTER
======================= */
export const registerUser = async (
  email: string,
  password: string,
  displayName?: string,
) => {
  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  // 2. Create Firestore user document
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: displayName || "",
    createdAt: new Date(),
  });

  return user;
};

/* =======================
   LOGIN
======================= */
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

/* =======================
   LOGOUT
======================= */
export const logoutUser = async () => {
  await signOut(auth);
};

/* =======================
   DELETE USER (Optional)
======================= */
export const deleteUserAccount = async (uid: string) => {
  // Remove Firestore user document
  await deleteDoc(doc(db, "users", uid));
};
