const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types pour le service utilisateur
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'led_team' | 'supervisor';
  filiere?: string;
  niveau?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  phone?: string;
  address?: string;
  birthDate?: string;
  profileImage?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface UserStats {
  activitesTotal: number;
  activitesCompletes: number;
  activitesEnCours: number;
  scoresMoyens: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
  progression: {
    dernierMois: number;
    tendance: 'up' | 'down' | 'stable';
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }>;
  classement: {
    position: number;
    total: number;
    filiere: number;
  };
}

export interface UserActivity {
  id: string;
  title: string;
  type: 'ENTREPRENEURIAT' | 'LEADERSHIP' | 'DIGITAL';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUBMITTED' | 'EVALUATED' | 'CANCELLED';
  createdAt: string;
  submittedAt?: string;
  evaluatedAt?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  filiere?: string;
  niveau?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Fonction utilitaire pour obtenir les headers avec auth
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Service utilisateur
export const userService = {
  // Récupérer le profil de l'utilisateur connecté
  getProfile: async (): Promise<{ success: boolean; data?: UserProfile; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Récupérer un profil utilisateur par ID (pour les superviseurs)
  getUserById: async (userId: string): Promise<{ success: boolean; data?: UserProfile; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Mettre à jour le profil de l'utilisateur connecté
  updateProfile: async (userData: UpdateUserData): Promise<{ success: boolean; data?: UserProfile; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Mettre à jour les données utilisateur dans localStorage
      if (result.success && result.data) {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const updatedUser = { ...JSON.parse(currentUser), ...result.data };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Changer le mot de passe
  changePassword: async (passwordData: ChangePasswordData): Promise<{ success: boolean; error?: string }> => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return {
          success: false,
          error: 'Les mots de passe ne correspondent pas'
        };
      }

      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Récupérer les statistiques de l'utilisateur
  getUserStats: async (): Promise<{ success: boolean; data?: UserStats; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/stats/overview`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Récupérer les activités de l'utilisateur
  getUserActivities: async (filters?: {
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; data?: UserActivity[]; error?: string }> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, value.toString());
        });
      }

      const response = await fetch(`${API_BASE_URL}/users/activities?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des activités utilisateur:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Récupérer tous les utilisateurs (pour les administrateurs)
  getAllUsers: async (filters?: {
    role?: string;
    filiere?: string;
    niveau?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; data?: User[]; pagination?: any; error?: string }> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, value.toString());
        });
      }

      const response = await fetch(`${API_BASE_URL}/users?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        pagination: result.pagination
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Upload d'une photo de profil
  uploadProfileImage: async (file: File): Promise<{ success: boolean; data?: { imageUrl: string }; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // Ne pas définir Content-Type pour FormData
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Supprimer un utilisateur (admin seulement)
  deleteUser: async (userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Mettre à jour le rôle d'un utilisateur (admin seulement)
  updateUserRole: async (userId: string, role: string): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Récupérer le classement des utilisateurs
  getUserRanking: async (type: 'global' | 'filiere' = 'global'): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/ranking?type=${type}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du classement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  // Désactiver/Activer un compte utilisateur
  toggleUserStatus: async (userId: string, active: boolean): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },
};

export default userService;