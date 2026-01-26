Advanced React E-Commerce Web App

A full-featured eCommerce web application built with React, TypeScript, Redux Toolkit, Firebase, and React-Bootstrap. This project supports user authentication, shopping cart functionality, product management, order management, and more.

⸻

Features

User Features
	•	User authentication with email/password via Firebase.
	•	Browse products with images, categories, descriptions, and ratings.
	•	Add multiple quantities of products to cart.
	•	Checkout system that stores orders in Firebase.
	•	View past orders (order history) with detailed product info.
	•	Shopping cart persisted in sessionStorage until checkout.

Admin Features
	•	Product Manager for CRUD operations on products:
	•	Add new products
	•	Edit existing products
	•	Delete products
	•	Product categories, prices, and ratings managed in Firebase.

Technical Features
	•	React + TypeScript for type-safe components.
	•	Redux Toolkit for global state management (cart and user session).
	•	Firebase Firestore for storing products, orders, and user data.
	•	React-Bootstrap for responsive UI components.
	•	Form validation and user feedback on product forms and checkout.
	•	Supports guest users with temporary guest IDs.

You must add your own firebase authetication to this project formatted as such:

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
