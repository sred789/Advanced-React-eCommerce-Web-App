import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";

// TextEncoder/TextDecoder for Node
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

// Mock Firebase modules
jest.mock("./firebase/firebase", () => ({
  auth: {},
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => ({ id: "mockCollection" })),
  query: jest.fn(() => "mockQuery"),
  getDocs: jest.fn(async () => ({
    docs: [{ id: "1", data: () => ({ name: "Mock Product", price: 10 }) }],
  })),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  where: jest.fn(),
}));
