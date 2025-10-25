import { apiClient } from "./api";

export interface Activity {
  id: string;
  title: string;
  type: "entrepreneuriat" | "leadership" | "digital";
  description: string;
  startDate?: Date;
  endDate?: Date;
  status:
    | "planned"
    | "in_progress"
    | "completed"
    | "submitted"
    | "evaluated"
    | "cancelled";
  documents: string[]; // URLs des documents
  progress: number;
  score?: number;
  maxScore?: number;
  feedback?: string;
  evaluatorName?: string;
  submittedAt: Date;
  evaluatedAt?: Date;
  priority: "low" | "medium" | "high";
  tags: string[];
  estimatedHours?: number;
  actualHours?: number;
  collaborators?: string[];
  objectives: string[];
  outcomes: string[];
  challenges: string[];
  learnings: string[];
  isLateSubmission?: boolean;
  reminderSent?: boolean;
}

export const activityService = {
  getActivities: async (userId?: string) => {
    try {
      const endpoint = userId ? `/activities?userId=${userId}` : "/activities";
      console.log("Fetching activities from:", endpoint);
      const response = await apiClient.get<Activity[]>(endpoint);
      console.log("Activities response:", response);

      if (response.success && response.data) {
        // S'assurer que les données sont correctement formatées
        try {
          const formattedActivities = response.data.map((activity) => ({
            ...activity,
            startDate: activity.startDate ? new Date(activity.startDate) : new Date(),
            endDate: activity.endDate ? new Date(activity.endDate) : new Date(),
            submittedAt: activity.submittedAt
              ? new Date(activity.submittedAt)
              : new Date(),
            evaluatedAt: activity.evaluatedAt
              ? new Date(activity.evaluatedAt)
              : undefined,
            progress: activity.progress || 0,
            documents: Array.isArray(activity.documents)
              ? activity.documents
              : [],
            objectives: Array.isArray(activity.objectives)
              ? activity.objectives
              : [],
            outcomes: Array.isArray(activity.outcomes) ? activity.outcomes : [],
            challenges: Array.isArray(activity.challenges)
              ? activity.challenges
              : [],
            learnings: Array.isArray(activity.learnings)
              ? activity.learnings
              : [],
            collaborators: Array.isArray(activity.collaborators)
              ? activity.collaborators
              : [],
            tags: Array.isArray(activity.tags) ? activity.tags : [],
          }));

          console.log("Formatted activities:", formattedActivities);
          return {
            success: true,
            data: formattedActivities,
          };
        } catch (formatError) {
          console.error("Error formatting activities:", formatError);
          return {
            success: false,
            error: "Erreur de formatage des données",
          };
        }
      }

      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération des activités:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  },

  getActivity: async (id: string) => {
    return await apiClient.get<Activity>(`/activities/${id}`);
  },

  createActivity: async (
    activityData: Omit<Activity, "id" | "submittedAt">
  ) => {
    return await apiClient.post<Activity>("/activities", activityData);
  },

  updateActivity: async (id: string, activityData: Partial<Activity>) => {
    return await apiClient.put<Activity>(`/activities/${id}`, activityData);
  },

  deleteActivity: async (id: string) => {
    return await apiClient.delete(`/activities/${id}`);
  },

  submitActivity: async (id: string) => {
    return await apiClient.post<Activity>(`/activities/${id}/submit`);
  },

  evaluateActivity: async (
    id: string,
    evaluation: { score: number; feedback: string; status: string }
  ) => {
    return await apiClient.post<Activity>(
      `/activities/${id}/evaluate`,
      evaluation
    );
  },

  uploadDocuments: async (activityId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("documents", file));
    return await apiClient.postFile<{ urls: string[] }>(
      `/activities/${activityId}/documents`,
      formData
    );
  },

  downloadDocument: async (documentUrl: string, filename: string) => {
    try {
      const response = await fetch(documentUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true };
      }
      return { success: false, error: "Erreur de téléchargement" };
    } catch (error) {
      return { success: false, error: "Erreur de téléchargement" };
    }
  },

  exportActivities: async (format: "csv" | "excel" | "pdf") => {
    try {
      const response = await fetch(`${apiClient.baseURL}/activities/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ format }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const extension = format === "excel" ? "xlsx" : format;
        link.download = `mes-activites-led-${Date.now()}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true };
      }
      return { success: false, error: "Erreur lors de l'export" };
    } catch (error) {
      console.error("Export error:", error);
      return { success: false, error: "Erreur lors de l'export" };
    }
  },
};
