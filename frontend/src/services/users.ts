import { apiClient } from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  filiere?: string;
  niveau?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  activities?: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    progress: number;
    createdAt: string;
    evaluations: Array<{
      score: number;
      maxScore: number;
      feedback: string;
      createdAt: string;
    }>;
  }>;
}

export interface UpdateProfileData {
  name: string;
  filiere?: string;
  niveau?: string;
}

export const userService = {
  // Récupérer le profil de l'utilisateur connecté
  getProfile: async (): Promise<{
    success: boolean;
    data?: UserProfile;
    error?: string;
  }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return {
          success: false,
          error: "Token d'authentification manquant",
        };
      }

      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  },

  // Mettre à jour le profil
  updateProfile: async (
    data: UpdateProfileData
  ): Promise<{ success: boolean; data?: UserProfile; error?: string }> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return {
          success: false,
          error: "Token d'authentification manquant",
        };
      }

      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  },

  // Récupérer tous les utilisateurs (admin/superviseur)
  getUsers: async (filters?: {
    role?: string;
    filiere?: string;
    niveau?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data?: any; error?: string }> => {
    let url = "/users";
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    return await apiClient.get(url);
  },

  // Récupérer tous les étudiants (pour les admins/superviseurs)
  getScholars: async (filters?: {
    search?: string;
    filiere?: string;
    niveau?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data?: any;
    error?: string;
    pagination?: any;
  }> => {
    try {
      let url = "/users/scholars";
      const params = new URLSearchParams();

      if (filters?.search) params.append("search", filters.search);
      if (filters?.filiere) params.append("filiere", filters.filiere);
      if (filters?.niveau) params.append("niveau", filters.niveau);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  },

  // Récupérer un utilisateur spécifique
  getUserById: async (
    id: string
  ): Promise<{ success: boolean; data?: UserProfile; error?: string }> => {
    return await apiClient.get(`/users/${id}`);
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: false, error: "Token d'authentification manquant" };
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/users/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  },
};
