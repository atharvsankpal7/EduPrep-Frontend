import axios from "axios";
import { BACKEND_URL } from "../constant";
import { useAuthStore } from "../stores/auth-store";
import { toast } from "@/components/ui/use-toast";
import { isAuthPublicPath } from "@/lib/routing/public-paths";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    const isAuthPage = isAuthPublicPath(currentPath);

    if (status === 401 && !isAuthPage) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        window.location.href = `/sign-up?callbackUrl=${encodeURIComponent(currentPath)}`;
      }
    }

    if (status === 403 && !isAuthPage) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
        variant: "destructive",
      });
    }

    if (status === 429 && !isAuthPage) {
      toast({
        title: "Too Many Requests",
        description: "Please slow down and try again in a moment.",
        variant: "destructive",
      });
    }

    if (status && status >= 500) {
      toast({
        title: "Server Error",
        description: "Something went wrong on our end. Please try again later.",
        variant: "destructive",
      });
    }

    if (!error.response && error.code === "ERR_NETWORK") {
      toast({
        title: "Connection Error",
        description: "Unable to reach the server. Please check your internet connection.",
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
