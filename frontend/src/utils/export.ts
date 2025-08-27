//import { StudentResult, Activity } from "../types";
import { format } from "date-fns";

interface Activity {
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
  documents: File[];
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

interface StudentResult {
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
  activitesRecentes: Array<{
    titre: string;
    type: string;
    score?: number;
    dateSubmission: string;
  }>;
}

export const exportToCSV = (data: StudentResult[], selectedIds?: string[]) => {
  const filteredData = data.filter(
    (student) =>
      !selectedIds ||
      selectedIds.length === 0 ||
      selectedIds.includes(student.id)
  );

  const csvData = filteredData.map((student) => ({
    Nom: student.nom,
    Email: student.email,
    Filiere: student.filiere,
    Niveau: student.niveau,
    ScoreGlobal: student.scoreGlobal,
    Statut: student.statut,
    ActivitesCompletes: student.activitesCompletes,
    ActivitesTotal: student.activitesTotal,
    TauxReussite: `${Math.round(
      (student.activitesCompletes / student.activitesTotal) * 100
    )}%`,
    Entrepreneuriat: student.competences.entrepreneuriat,
    Leadership: student.competences.leadership,
    Digital: student.competences.digital,
    DernierAcces: student.dernierAcces,
  }));

  const csvContent = [
    Object.keys(csvData[0] || {}),
    ...csvData.map((row) => Object.values(row)),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `recherche_etudiants_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.click();
};

export const exportActivitiesToCSV = (activities: Activity[]) => {
  const csvContent = [
    [
      "Titre",
      "Type",
      "Statut",
      "Date début",
      "Date fin",
      "Score",
      "Progression",
      "Priorité",
    ],
    ...activities.map((activity) => [
      activity.title,
      activity.type,
      activity.status,
      format(activity.startDate, "dd/MM/yyyy"),
      format(activity.endDate, "dd/MM/yyyy"),
      activity.score ? `${activity.score}/${activity.maxScore}` : "N/A",
      `${activity.progress}%`,
      activity.priority,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `activites_LED_${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
};

export const exportToPDF = (data: StudentResult[], selectedIds?: string[]) => {
  const filteredData = data.filter(
    (student) =>
      !selectedIds ||
      selectedIds.length === 0 ||
      selectedIds.includes(student.id)
  );

  console.log("Export PDF:", filteredData);
  alert(`Rapport PDF généré avec ${filteredData.length} étudiants`);
};

export const exportToExcel = (
  data: StudentResult[],
  selectedIds?: string[]
) => {
  const filteredData = data.filter(
    (student) =>
      !selectedIds ||
      selectedIds.length === 0 ||
      selectedIds.includes(student.id)
  );

  console.log("Export Excel:", filteredData);
  alert(`Export Excel généré avec ${filteredData.length} étudiants`);
};

export const downloadActivityData = (activity: Activity) => {
  const activityData = {
    ...activity,
    documents: activity.documents.map((doc) => ({
      name: doc.name,
      size: doc.size,
      type: doc.type,
    })),
  };

  const blob = new Blob([JSON.stringify(activityData, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `activite_${activity.id}_${format(
    new Date(),
    "yyyy-MM-dd"
  )}.json`;
  link.click();
};
