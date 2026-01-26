// src/firebase/userService.ts
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import type { User } from "firebase/auth";
import { db } from "./firebase";

/* =======================
   READ USER PROFILE
======================= */
export const getUserProfile = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    throw new Error("User profile not found");
  }

  return snapshot.data();
};

/* =======================
   UPDATE USER PROFILE
======================= */
export const updateUserProfile = async (
  uid: string,
  data: {
    displayName?: string;
    address?: string;
  },
) => {
  await updateDoc(doc(db, "users", uid), data);
};

/* =======================
   DELETE USER ACCOUNT
======================= */
export const deleteAccount = async (user: User) => {
  // Delete Firestore user document
  await deleteDoc(doc(db, "users", user.uid));

  // Delete Firebase Authentication account
  await deleteUser(user);
};
