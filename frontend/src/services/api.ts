/// <reference types="vite/client" />

/*const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
};*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  public baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(isFile: boolean = false): HeadersInit {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {};
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (!isFile) {
      headers["Content-Type"] = "application/json";
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.error || response.statusText };
      }
      return { success: true, ...result };
    } catch {
      return { success: false, error: "Réponse invalide du serveur" };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`GET ${endpoint}`, { hasToken: !!localStorage.getItem("token") });
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    
    const result = await this.handleResponse<T>(response);
    console.log(`GET ${endpoint} response:`, result);
    return result;
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const headers = this.getHeaders();
    console.log(`POST ${endpoint}`, { headers, hasToken: !!localStorage.getItem("token") });
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async postFile<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: formData,
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Test de connexion
export const testConnection = async () => {
  try {
    const response = await fetch(API_BASE_URL.replace("/api", "/health"));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    throw new Error("Impossible de se connecter au serveur");
  }
};
