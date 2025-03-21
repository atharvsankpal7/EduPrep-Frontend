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
      logout();
      return false;
    }
  } catch (error) {
    logout();
    return false;
  } finally {
    setLoading(false);
  }
  return true;
};
