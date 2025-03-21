import axios from "axios";
import { BACKEND_URL } from "./constant";
import { useAuthStore } from "./stores/auth-store";

export const checkAuthStatus = async () => {
  const { login, logout, setLoading } = useAuthStore.getState();

  try {
    const response = await axios.get(`${BACKEND_URL}/user/me`, {
      withCredentials: true,
    });
    if (response.data?.data?.user) {
      login(response.data.data.user);
    } else {
        console.log("User not found in response:", response.data);
      logout();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    logout();
  } finally {
    setLoading(false);
  }
};
