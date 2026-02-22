import api from "@/lib/api/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/global/interface/user.apiInterface";

export const login = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/user/login", credentials);
  return response.data;
};

export const register = async (
  payload: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/user/register", payload);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/user/logout");
};
