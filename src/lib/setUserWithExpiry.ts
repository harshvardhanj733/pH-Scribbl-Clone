import User from "@/types/User";
export default function setUserWithExpiry(data: User) {
  const expiryTime = Date.now() + (1000 * 60 * 60 * 24); // 24 hours from now
  data = {...data, expiry: expiryTime};
  localStorage.setItem("userpHLevels", JSON.stringify(data));
}