import { apiClient } from "./api";

export interface Activity {
  id: string;
  title: string;
  type: "entrepreneuriat" | "leadership" | "digital";
  description: string;
  startDate: Date;
  endDate: Date;
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
    const endpoint = userId ? `/activities?userId=${userId}` : "/activities";
    return await apiClient.get<Activity[]>(endpoint);
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
};
