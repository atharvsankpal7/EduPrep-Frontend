export interface User {
  id: string;
  fullName: string;
  email: string;
  urn?: number;
  city?: string;
  contactNumber?: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  city: string;
  contactNumber: string;
}

export interface AuthResponse {
  statusCode: number;
  data: {
    user: User;
  };
  message: string;
}

export interface IUser {
  urn: number;
  email: string;
  fullName: string;
  password: string;
  refreshToken?: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
