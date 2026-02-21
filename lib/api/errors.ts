import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  success?: boolean;
}

const AUTH_ERROR_MESSAGES: Record<number, string> = {
  401: "Invalid email or password. Please check your credentials and try again.",
  403: "You have too many active sessions. Please log out from another device and try again.",
  429: "Too many attempts. Please wait a moment before trying again.",
};

const REGISTER_ERROR_MESSAGES: Record<number, string> = {
  ...AUTH_ERROR_MESSAGES,
  400: "Please check your information and try again.",
  409: "An account with this email already exists. Please sign in instead.",
};

const DEFAULT_ERROR = "An unexpected error occurred. Please try again later.";

export function getAuthErrorMessage(error: unknown, type: "login" | "register"): string {
  if (!(error instanceof AxiosError)) return DEFAULT_ERROR;

  const status = error.response?.status;
  if (!status) return DEFAULT_ERROR;

  const messages = type === "login" ? AUTH_ERROR_MESSAGES : REGISTER_ERROR_MESSAGES;
  return messages[status] ?? DEFAULT_ERROR;
}
