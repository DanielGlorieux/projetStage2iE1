import { apiClient } from "./api";

export interface SearchFilters {
  nom?: string;
  email?: string;
  filiere?: string[];
  niveau?: string[];
  scoreMin?: number;
  scoreMax?: number;
  statut?: string[];
  typeActivite?: string[];
  periodeDebut?: string;
  periodeFin?: string;
}

export interface StudentResult {
  id: string;
  nom: string;
  email: string;
  filiere: string;
  niveau: string;
  scoreGlobal: number;
  statut: string;
  dernierAcces: string;
  activitesCompletes: number;
  activitesTotal: number;
  competences: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
}

export const searchService = {
  searchStudents: async (filters: SearchFilters) => {
    return await apiClient.post<StudentResult[]>("/search/students", filters);
  },

  exportSearchResults: async (
    filters: SearchFilters,
    format: "csv" | "excel" | "pdf"
  ) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/search/export`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ filters, format }),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `recherche_etudiants.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true };
      }
      return { success: false, error: "Erreur d'export" };
    } catch (error) {
      return { success: false, error: "Erreur d'export" };
    }
  },

  getStats: async () => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_BASE_URL}/search/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: {
          students: {
            total: result.data?.totalStudents || 0,
            withActivities: result.data?.studentsWithActivities || 0,
            activeRate: result.data?.activeStudentsRate || 0,
          },
          activities: {
            total: result.data?.totalActivities || 0,
            byStatus: {
              PLANNED: result.data?.activitiesByStatus?.PLANNED || 0,
              IN_PROGRESS: result.data?.activitiesByStatus?.IN_PROGRESS || 0,
              COMPLETED: result.data?.activitiesByStatus?.COMPLETED || 0,
              SUBMITTED: result.data?.activitiesByStatus?.SUBMITTED || 0,
              EVALUATED: result.data?.activitiesByStatus?.EVALUATED || 0,
              CANCELLED: result.data?.activitiesByStatus?.CANCELLED || 0,
            },
            byType: {
              ENTREPRENEURIAT:
                result.data?.activitiesByType?.ENTREPRENEURIAT || 0,
              LEADERSHIP: result.data?.activitiesByType?.LEADERSHIP || 0,
              DIGITAL: result.data?.activitiesByType?.DIGITAL || 0,
            },
          },
          scores: {
            averages: {
              entrepreneuriat: result.data?.averageScores?.entrepreneuriat || 0,
              leadership: result.data?.averageScores?.leadership || 0,
              digital: result.data?.averageScores?.digital || 0,
            },
            global: result.data?.globalAverageScore || 0,
          },
          recent: result.data?.recentActivities || [],
        },
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        data: {
          students: { total: 0, withActivities: 0, activeRate: 0 },
          activities: {
            total: 0,
            byStatus: {},
            byType: {},
          },
          scores: {
            averages: { entrepreneuriat: 0, leadership: 0, digital: 0 },
            global: 0,
          },
          recent: [],
        },
      };
    }
  },
};
