import { apiClient } from "./api";
import { User } from "../App";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  role: string;
}

export const authService = {
  login: async (credentials: LoginRequest) => {
    return await apiClient.post<{ user: User; token: string }>(
      "/auth/login",
      credentials
    );
  },

  register: async (userData: RegisterRequest) => {
    return await apiClient.post<{ user: User; token: string }>(
      "/auth/register",
      userData
    );
  },

  logout: async () => {
    localStorage.removeItem("token");
    return { success: true };
  },

  getCurrentUser: async () => {
    return await apiClient.get<User>("/auth/me");
  },
};
