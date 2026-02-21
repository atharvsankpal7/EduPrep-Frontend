import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { useAuthStore, User } from "../../stores/auth-store";
import { useRouter } from "next/navigation";

// ---- Types ----

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  city: string;
  contactNumber: string;
}

interface AuthResponse {
  statusCode: number;
  data: {
    user: User;
  };
  message: string;
}

// ---- API functions ----

const loginApi = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/user/login", credentials);
  return response.data;
};

const registerApi = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/user/register", data);
  return response.data;
};

const logoutApi = async (): Promise<void> => {
  await api.post("/user/logout");
};

// ---- Hooks ----

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
      router.push("/sign-in");
    },
    onError: () => {
      // Even if the API call fails, clear the local state
      logout();
      router.push("/sign-in");
    },
  });
};
