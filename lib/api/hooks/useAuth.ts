import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";
import { useRouter } from "next/navigation";
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "@/lib/api/services/auth.api";

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.data.user);
    },
  });
};

export const useRegister = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data.data.user);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      logout();
      router.push("/sign-up");
    },
    onError: () => {
      // Even if the API call fails, clear the local state
      logout();
      router.push("/sign-in");
    },
  });
};
