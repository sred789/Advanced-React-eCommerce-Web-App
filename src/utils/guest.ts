// src/utils/guest.ts
import { v4 as uuidv4 } from "uuid";

export const getGuestId = () => {
  let guestId = sessionStorage.getItem("guestId");
  if (!guestId) {
    guestId = uuidv4();
    sessionStorage.setItem("guestId", guestId);
  }
  return guestId;
};
