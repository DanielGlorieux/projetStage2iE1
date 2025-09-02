/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("API_BASE_URL configuré:", API_BASE_URL);

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Test de connexion
export const testConnection = async () => {
  try {
    const response = await fetch("http://localhost:5000/health");
    if (!response.ok) throw new Error("Backend non accessible");
    return await response.json();
  } catch (error) {
    console.error("Erreur de connexion backend:", error);
    throw error;
  }
};

// Configuration avec fetch
export const apiClient = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Erreur de connexion" };
    }
  },

  post: async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Erreur de connexion" };
    }
  },

  postFile: async <T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Erreur de connexion" };
    }
  },

  put: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Erreur de connexion" };
    }
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Erreur de connexion" };
    }
  },
};
