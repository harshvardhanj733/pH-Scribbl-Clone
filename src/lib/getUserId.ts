import { v4 as uuidv4 } from "uuid";

export default function getOrCreateUserId() {
  let userId = localStorage.getItem("userIdpHLevels");
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("userIdpHLevels", userId);
  }
  return userId;
}