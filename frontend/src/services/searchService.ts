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
};
