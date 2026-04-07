import { apiClient } from "./api";

export interface SupervisorActivity {
  id: string;
  title: string;
  type: "entrepreneuriat" | "leadership" | "digital";
  description: string;
  deadline: string;
  status: string;
  isSupervisorCreated: boolean;
  userId: string;
  creatorId: string;
  assignedStudents: string[];
  objectives?: string[];
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    filiere?: string;
    niveau?: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
  };
  evaluations?: any[];
}

export interface CreateActivityData {
  title: string;
  type: "entrepreneuriat" | "leadership" | "digital";
  description: string;
  deadline: string;
  studentIds: string[];
  objectives?: string[];
  estimatedHours?: number;
}

export interface EvaluateActivityData {
  score: number;
  feedback?: string;
}

export const supervisorActivityService = {
  // Créer une activité et l'assigner à des étudiants
  async createActivity(data: CreateActivityData) {
    return apiClient.post<SupervisorActivity[]>("/supervisor-activities", data);
  },

  // Récupérer les activités créées par le superviseur
  async getMyActivities() {
    return apiClient.get<SupervisorActivity[]>("/supervisor-activities");
  },

  // Noter une activité
  async evaluateActivity(activityId: string, data: EvaluateActivityData) {
    return apiClient.post(`/supervisor-activities/${activityId}/evaluate`, data);
  },

  // Envoyer un rappel
  async sendReminder(activityId: string) {
    return apiClient.post(`/supervisor-activities/${activityId}/remind`, {});
  },

  // Supprimer une activité
  async deleteActivity(activityId: string) {
    return apiClient.delete(`/supervisor-activities/${activityId}`);
  },
};
