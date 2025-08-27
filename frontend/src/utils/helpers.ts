//import { ACTIVITY_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS } from "../constants/activityTypes";
import { differenceInDays } from "date-fns";
import {
  Briefcase,
  Lightbulb,
  Monitor,
  Clock,
  RefreshCw,
  CheckCircle,
  Send,
  Award,
  X,
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "planned", label: "Planifiée", color: "bg-gray-500", icon: Clock },
  {
    value: "in_progress",
    label: "En cours",
    color: "bg-orange-500",
    icon: RefreshCw,
  },
  {
    value: "completed",
    label: "Terminée",
    color: "bg-blue-500",
    icon: CheckCircle,
  },
  { value: "submitted", label: "Soumise", color: "bg-indigo-500", icon: Send },
  { value: "evaluated", label: "Évaluée", color: "bg-green-500", icon: Award },
  { value: "cancelled", label: "Annulée", color: "bg-red-500", icon: X },
];

const ACTIVITY_TYPES = [
  {
    value: "entrepreneuriat",
    label: "Entrepreneuriat & Innovation",
    icon: Briefcase,
    color: "bg-blue-500",
    description:
      "Projets d'innovation, création d'entreprise, développement de produits",
  },
  {
    value: "leadership",
    label: "Leadership & Management",
    icon: Lightbulb,
    color: "bg-green-500",
    description:
      "Formation en leadership, gestion d'équipe, conduite du changement",
  },
  {
    value: "digital",
    label: "Transformation Digitale",
    icon: Monitor,
    color: "bg-purple-500",
    description: "Technologies numériques, développement, innovation digitale",
  },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Basse", color: "bg-gray-400" },
  { value: "medium", label: "Moyenne", color: "bg-yellow-500" },
  { value: "high", label: "Haute", color: "bg-red-500" },
];

export const getActivityIcon = (type: string) => {
  const activityType = ACTIVITY_TYPES.find((t) => t.value === type);
  return activityType ? activityType.icon : null;
};

export const getActivityColor = (type: string) => {
  const activityType = ACTIVITY_TYPES.find((t) => t.value === type);
  return activityType ? activityType.color : "bg-gray-500";
};

export const getStatusColor = (status: string) => {
  const statusOption = STATUS_OPTIONS.find((s) => s.value === status);
  return statusOption ? statusOption.color : "bg-gray-500";
};

export const getStatusLabel = (status: string) => {
  const statusOption = STATUS_OPTIONS.find((s) => s.value === status);
  return statusOption ? statusOption.label : status;
};

export const getPriorityColor = (priority: string) => {
  const priorityOption = PRIORITY_OPTIONS.find((p) => p.value === priority);
  return priorityOption ? priorityOption.color : "bg-gray-400";
};

export const getDaysUntilDeadline = (endDate: Date) => {
  return differenceInDays(endDate, new Date());
};

export const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSize: number
) => {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Le fichier ${file.name} dépasse la taille maximale de ${
        maxSize / (1024 * 1024)
      }MB`,
    };
  }
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Le type de fichier ${file.name} n'est pas autorisé`,
    };
  }
  return { valid: true };
};
