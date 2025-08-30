import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function getUserWithExpiry(router: AppRouterInstance) {
  const userStr = localStorage.getItem("userpHLevels");
  if (!userStr) {
    router.push('/');
    return;
  }
  
  const user = JSON.parse(userStr);
  const now = Date.now();
  
  if (now > user.expiry) {
    localStorage.removeItem("userpHLevels");
    router.push('/');
    return;
  }
  
  return user;
}