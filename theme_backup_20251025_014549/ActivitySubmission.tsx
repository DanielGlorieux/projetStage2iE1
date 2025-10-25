/*import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import {
  Plus,
  Upload,
  Calendar as CalendarIcon,
  FileText,
  Briefcase,
  Lightbulb,
  Monitor,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Save,
  X,
  PaperclipIcon,
  Download,
  Filter,
  Search,
  Award,
  TrendingUp,
  Target,
  Users,
  Building,
  Star,
  MessageSquare,
  Send,
  RefreshCw,
} from "lucide-react";
import { format, isAfter, isBefore, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface Activity {
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

interface ActivitySubmissionProps {
  userRole: string;
}

interface FilterState {
  type: string;
  status: string;
  priority: string;
  dateRange: "all" | "week" | "month" | "semester";
  searchTerm: string;
}

export function ActivitySubmission({ userRole }: ActivitySubmissionProps) {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      title: "Développement d'une Application de Gestion de l'Eau Intelligente",
      type: "entrepreneuriat",
      description:
        "Conception et développement d'une application mobile innovante utilisant l'IoT pour optimiser la gestion de l'eau dans les communautés rurales du Burkina Faso. Le projet intègre des capteurs intelligents, une interface utilisateur intuitive et un système d'alertes automatiques.",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-05-30"),
      status: "in_progress",
      documents: [],
      progress: 75,
      submittedAt: new Date("2024-01-20"),
      priority: "high",
      tags: ["Innovation", "IoT", "Mobile", "Eau", "Communautés"],
      estimatedHours: 120,
      actualHours: 90,
      collaborators: ["Ibrahim DIALLO", "Fatou BA"],
      objectives: [
        "Créer une solution technologique durable",
        "Améliorer l'accès à l'eau potable",
        "Sensibiliser les communautés",
      ],
      outcomes: [
        "Prototype fonctionnel développé",
        "Tests utilisateurs réalisés",
        "Validation technique obtenue",
      ],
      challenges: [
        "Connexion internet limitée en zone rurale",
        "Formation des utilisateurs locaux",
      ],
      learnings: [
        "Gestion de projet agile",
        "Développement mobile avancé",
        "Approche centrée utilisateur",
      ],
    },
    {
      id: "2",
      title: "Formation Leadership Digital - Transformation Numérique",
      type: "leadership",
      description:
        "Participation intensive à un programme de leadership digital comprenant la gestion d'équipes virtuelles, la conduite du changement numérique et l'innovation collaborative. Formation certifiante avec mise en pratique sur des projets réels.",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-04-15"),
      status: "evaluated",
      documents: [],
      progress: 100,
      score: 18,
      maxScore: 20,
      feedback:
        "Excellent travail démontrant une compréhension approfondie des enjeux du leadership digital. Votre approche collaborative et votre capacité d'adaptation sont remarquables. Continuez à développer ces compétences transversales.",
      evaluatorName: "Dr. Awa SAWADOGO",
      submittedAt: new Date("2024-02-05"),
      evaluatedAt: new Date("2024-04-20"),
      priority: "medium",
      tags: ["Leadership", "Digital", "Management", "Innovation"],
      estimatedHours: 80,
      actualHours: 85,
      objectives: [
        "Maîtriser les outils de leadership digital",
        "Développer une vision stratégique",
        "Créer une culture d'innovation",
      ],
      outcomes: [
        "Certification obtenue avec distinction",
        "Projet de transformation réalisé",
        "Équipe virtuelle managée avec succès",
      ],
      challenges: [
        "Adoption des outils numériques par tous les membres",
        "Gestion de la résistance au changement",
      ],
      learnings: [
        "Communication digitale efficace",
        "Gestion du changement",
        "Innovation collaborative",
      ],
    },
    {
      id: "3",
      title: "Hackathon Innovation Technologique - Solution FinTech",
      type: "digital",
      description:
        "Participation au hackathon national d'innovation où notre équipe a développé une solution FinTech pour l'inclusion financière des populations rurales. Développement d'une plateforme de micro-crédit digital avec système de scoring alternatif.",
      startDate: new Date("2024-03-10"),
      endDate: new Date("2024-03-12"),
      status: "completed",
      documents: [],
      progress: 100,
      submittedAt: new Date("2024-03-15"),
      priority: "high",
      tags: ["FinTech", "Innovation", "Hackathon", "Inclusion", "Digital"],
      estimatedHours: 48,
      actualHours: 52,
      collaborators: ["Marie SANOGO", "Boureima OUEDRAOGO"],
      objectives: [
        "Développer une solution FinTech innovante",
        "Adresser l'inclusion financière",
        "Remporter le concours",
      ],
      outcomes: [
        "2ème place au hackathon national",
        "Prototype MVP fonctionnel",
        "Intérêt d'investisseurs potentiels",
      ],
      challenges: [
        "Contraintes de temps importantes",
        "Intégration d'APIs complexes",
      ],
      learnings: [
        "Développement rapide de MVP",
        "Travail en équipe sous pression",
        "Pitch et présentation",
      ],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    status: "all",
    priority: "all",
    dateRange: "all",
    searchTerm: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    type: "" as "entrepreneuriat" | "leadership" | "digital" | "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: "planned" as Activity["status"],
    documents: [] as File[],
    priority: "medium" as "low" | "medium" | "high",
    estimatedHours: 0,
    actualHours: 0,
    collaborators: [] as string[],
    objectives: [""] as string[],
    outcomes: [""] as string[],
    challenges: [""] as string[],
    learnings: [""] as string[],
    tags: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);

  const activityTypes = [
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
      description:
        "Technologies numériques, développement, innovation digitale",
    },
  ];

  const statusOptions = [
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
    {
      value: "submitted",
      label: "Soumise",
      color: "bg-indigo-500",
      icon: Send,
    },
    {
      value: "evaluated",
      label: "Évaluée",
      color: "bg-green-500",
      icon: Award,
    },
    { value: "cancelled", label: "Annulée", color: "bg-red-500", icon: X },
  ];

  const priorityOptions = [
    { value: "low", label: "Basse", color: "bg-gray-400" },
    { value: "medium", label: "Moyenne", color: "bg-yellow-500" },
    { value: "high", label: "Haute", color: "bg-red-500" },
  ];

  // Filtrage des activités
  const filteredActivities = activities.filter((activity) => {
    if (filters.type !== "all" && activity.type !== filters.type) return false;
    if (filters.status !== "all" && activity.status !== filters.status)
      return false;
    if (filters.priority !== "all" && activity.priority !== filters.priority)
      return false;
    if (
      filters.searchTerm &&
      !activity.title
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) &&
      !activity.description
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase())
    )
      return false;

    if (filters.dateRange !== "all") {
      const now = new Date();
      const daysAgo =
        filters.dateRange === "week"
          ? 7
          : filters.dateRange === "month"
          ? 30
          : 120;
      const cutoffDate = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000
      );
      if (activity.startDate < cutoffDate) return false;
    }

    return true;
  });

  // Calcul des statistiques
  const stats = {
    total: activities.length,
    completed: activities.filter(
      (a) => a.status === "completed" || a.status === "evaluated"
    ).length,
    inProgress: activities.filter((a) => a.status === "in_progress").length,
    avgScore:
      activities
        .filter((a) => a.score)
        .reduce((sum, a) => sum + (a.score || 0), 0) /
        activities.filter((a) => a.score).length || 0,
    totalHours: activities.reduce((sum, a) => sum + (a.actualHours || 0), 0),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validations améliorées
    if (
      !formData.title ||
      !formData.type ||
      !formData.description
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      setIsLoading(false);
      return;
    }

    if (formData.description.length < 100) {
      setError("La description doit contenir au moins 100 caractères");
      setIsLoading(false);
      return;
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      setError("La date de fin doit être postérieure à la date de début");
      setIsLoading(false);
      return;
    }

    if (formData.objectives.filter((obj) => obj.trim()).length < 1) {
      setError("Veuillez définir au moins un objectif");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const isLate = formData.endDate && isAfter(new Date(), formData.endDate);

      const newActivity: Activity = {
        id: editingActivity?.id || Date.now().toString(),
        title: formData.title,
        type: formData.type as "entrepreneuriat" | "leadership" | "digital",
        description: formData.description,
        startDate: formData.startDate as Date,
        endDate: formData.endDate as Date,
        status: formData.status,
        documents: formData.documents,
        progress:
          formData.status === "completed"
            ? 100
            : formData.status === "in_progress"
            ? 50
            : 0,
        priority: formData.priority,
        estimatedHours: formData.estimatedHours,
        actualHours: formData.actualHours,
        collaborators: formData.collaborators.filter((c) => c.trim()),
        objectives: formData.objectives.filter((obj) => obj.trim()),
        outcomes: formData.outcomes.filter((out) => out.trim()),
        challenges: formData.challenges.filter((ch) => ch.trim()),
        learnings: formData.learnings.filter((l) => l.trim()),
        tags: formData.tags,
        submittedAt: editingActivity?.submittedAt || new Date(),
        isLateSubmission: isLate,
      };

      if (editingActivity) {
        setActivities((prev) =>
          prev.map((a) => (a.id === editingActivity.id ? newActivity : a))
        );
        setSuccess("Activité modifiée avec succès ! 🎉");
      } else {
        setActivities((prev) => [...prev, newActivity]);
        setSuccess(
          "Activité soumise avec succès ! Votre progression LED a été mise à jour. 🚀"
        );
      }

      resetForm();
      setIsLoading(false);

      setTimeout(() => setSuccess(""), 5000);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      status: "planned",
      documents: [],
      priority: "medium",
      estimatedHours: 0,
      actualHours: 0,
      collaborators: [],
      objectives: [""],
      outcomes: [""],
      challenges: [""],
      learnings: [""],
      tags: [],
    });
    setShowForm(false);
    setEditingActivity(null);
    setShowAdvancedForm(false);
  };

  const handleEdit = (activity: Activity) => {
    setFormData({
      title: activity.title,
      type: activity.type,
      description: activity.description,
      startDate: activity.startDate,
      endDate: activity.endDate,
      status: activity.status,
      documents: activity.documents,
      priority: activity.priority,
      estimatedHours: activity.estimatedHours || 0,
      actualHours: activity.actualHours || 0,
      collaborators: activity.collaborators || [],
      objectives: activity.objectives.length > 0 ? activity.objectives : [""],
      outcomes: activity.outcomes.length > 0 ? activity.outcomes : [""],
      challenges: activity.challenges.length > 0 ? activity.challenges : [""],
      learnings: activity.learnings.length > 0 ? activity.learnings : [""],
      tags: activity.tags || [],
    });
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette activité ? Cette action est irréversible."
      )
    ) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      setSuccess("Activité supprimée avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      // Validation des fichiers
      const validFiles = newFiles.filter((file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/png",
        ];

        if (file.size > maxSize) {
          setError(
            `Le fichier ${file.name} dépasse la taille maximale de 10MB`
          );
          return false;
        }

        if (!allowedTypes.includes(file.type)) {
          setError(`Le type de fichier ${file.name} n'est pas autorisé`);
          return false;
        }

        return true;
      });

      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...validFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const addListItem = (field: keyof typeof formData, value: string = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value],
    }));
  };

  const updateListItem = (
    field: keyof typeof formData,
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const removeListItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find((t) => t.value === type);
    return activityType ? activityType.icon : FileText;
  };

  const getActivityColor = (type: string) => {
    const activityType = activityTypes.find((t) => t.value === type);
    return activityType ? activityType.color : "bg-gray-500";
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.color : "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getPriorityColor = (priority: string) => {
    const priorityOption = priorityOptions.find((p) => p.value === priority);
    return priorityOption ? priorityOption.color : "bg-gray-400";
  };

  const getDaysUntilDeadline = (endDate?: Date) => {
    if (!endDate) return null;
    return differenceInDays(endDate, new Date());
  };

  if (userRole !== "student") {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cette fonctionnalité est réservée aux étudiants boursiers LED.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      */ {
  /* En-tête avec statistiques */
}
/*
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            Mes Réalisations LED
          </h1>
          <p className="text-muted-foreground text-lg">
            Gérez et valorisez vos projets en Leadership, Entrepreneuriat &
            Digital
          </p>

          */ {
  /* Stats rapides */
}
/*
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-blue-50 px-3 py-2 rounded-lg">
              <span className="text-blue-600 font-semibold">{stats.total}</span>
              <span className="text-blue-700 text-sm ml-1">activités</span>
            </div>
            <div className="bg-green-50 px-3 py-2 rounded-lg">
              <span className="text-green-600 font-semibold">
                {stats.completed}
              </span>
              <span className="text-green-700 text-sm ml-1">terminées</span>
            </div>
            <div className="bg-orange-50 px-3 py-2 rounded-lg">
              <span className="text-orange-600 font-semibold">
                {stats.totalHours}h
              </span>
              <span className="text-orange-700 text-sm ml-1">investies</span>
            </div>
            {stats.avgScore > 0 && (
              <div className="bg-purple-50 px-3 py-2 rounded-lg">
                <span className="text-purple-600 font-semibold">
                  {stats.avgScore.toFixed(1)}
                </span>
                <span className="text-purple-700 text-sm ml-1">
                  score moyen
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Réalisation
        </Button>
      </div>

      */ {
  /* Alertes */
}
/*
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Mes Activités ({filteredActivities.length})
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-6">
          */ {
  /* Filtres et recherche */
}
/*
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une activité..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  className="pl-9"
                />
              </div>

              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.priority}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.dateRange}
                onValueChange={(value: any) =>
                  setFilters((prev) => ({ ...prev, dateRange: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes périodes</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="semester">Ce semestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          */ {
  /* Liste des activités */
}
/*
          {filteredActivities.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filters.searchTerm ||
                  filters.type !== "all" ||
                  filters.status !== "all"
                    ? "Aucune activité ne correspond à vos critères"
                    : "Aucune activité LED"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {filters.searchTerm ||
                  filters.type !== "all" ||
                  filters.status !== "all"
                    ? "Essayez de modifier vos filtres de recherche"
                    : "Commencez par documenter votre première réalisation en Leadership, Entrepreneuriat ou Digital"}
                </p>
                {!filters.searchTerm &&
                  filters.type === "all" &&
                  filters.status === "all" && (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer ma première activité
                    </Button>
                  )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                const daysUntilDeadline = getDaysUntilDeadline(
                  activity.endDate
                );
                const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7;
                const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0;

                return (
                  <Card
                    key={activity.id}
                    className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-500"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 ${getActivityColor(
                              activity.type
                            )} rounded-lg flex items-center justify-center flex-shrink-0`}
                          >
                            <ActivityIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                              {activity.title}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                className={`${getStatusColor(
                                  activity.status
                                )} text-white`}
                              >
                                {getStatusLabel(activity.status)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`${getPriorityColor(
                                  activity.priority
                                )} text-white`}
                              >
                                {activity.priority === "low"
                                  ? "Basse"
                                  : activity.priority === "medium"
                                  ? "Moyenne"
                                  : "Haute"}
                              </Badge>
                              {activity.isLateSubmission && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Retard
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingActivity(activity)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(activity)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(activity.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {activity.description}
                      </p>

                      */ {
  /* Progress bar pour les activités en cours */
}
/*
                      {activity.status === "in_progress" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span>{activity.progress}%</span>
                          </div>
                          <Progress value={activity.progress} className="h-2" />
                        </div>
                      )}

                      */ {
  /* Score pour les activités évaluées */
}
/*
                      {activity.score && activity.maxScore && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">
                            Note: {activity.score}/{activity.maxScore}
                          </span>
                        </div>
                      )}

                      */ {
  /* Dates et délais */
}
/*
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {activity.startDate && activity.endDate ? (
                              <>
                                {format(activity.startDate, "dd MMM", {
                                  locale: fr,
                                })}{" "}
                                -{" "}
                                {format(activity.endDate, "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </>
                            ) : (
                              "Dates non définies"
                            )}
                          </span>
                        </div>

                        {activity.status !== "completed" &&
                          activity.status !== "evaluated" && daysUntilDeadline !== null && (
                            <div
                              className={`flex items-center gap-1 ${
                                isOverdue
                                  ? "text-red-600"
                                  : isUrgent
                                  ? "text-orange-600"
                                  : "text-gray-600"
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">
                                {isOverdue
                                  ? `${Math.abs(
                                      daysUntilDeadline
                                    )} jour(s) de retard`
                                  : `${daysUntilDeadline} jour(s) restant(s)`}
                              </span>
                            </div>
                          )}
                      </div>

                      */ {
  /* Tags */
}
/*
                      {activity.tags && activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {activity.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {activity.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{activity.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      */ {
  /* Collaborateurs */
}
/*
                      {activity.collaborators &&
                        activity.collaborators.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-wrap gap-1">
                              {activity.collaborators
                                .slice(0, 2)
                                .map((collaborator, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                  >
                                    {collaborator}
                                  </span>
                                ))}
                              {activity.collaborators.length > 2 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  +{activity.collaborators.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        */ {
  /* Onglet Statistiques */
}
/*
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Activités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Target className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">
                      Réalisations documentées
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taux de Réussite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Award className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {stats.total > 0
                        ? Math.round((stats.completed / stats.total) * 100)
                        : 0}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.completed}/{stats.total} terminées
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Score Moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {stats.avgScore > 0 ? stats.avgScore.toFixed(1) : "—"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sur 20 points
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Temps Investi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {stats.totalHours}h
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total heures
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          */ {
  /* Répartition par type */
}
/*
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Activités</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activityTypes.map((type) => {
                  const count = activities.filter(
                    (a) => a.type === type.value
                  ).length;
                  const percentage =
                    stats.total > 0 ? (count / stats.total) * 100 : 0;
                  const TypeIcon = type.icon;

                  return (
                    <div
                      key={type.value}
                      className="flex items-center gap-3 p-4 border rounded-lg"
                    >
                      <div
                        className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center`}
                      >
                        <TypeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{type.label}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-sm text-muted-foreground">
                            ({percentage.toFixed(0)}%)
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2 mt-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        */ {
  /* Onglet Planning */
}
/*
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Planning des Échéances</CardTitle>
              <CardDescription>
                Vue chronologique de vos activités et leurs délais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities
                  .filter(
                    (a) => a.status !== "completed" && a.status !== "evaluated"
                  )
                  .sort((a, b) => {
                    if (!a.endDate) return 1;
                    if (!b.endDate) return -1;
                    return a.endDate.getTime() - b.endDate.getTime();
                  })
                  .map((activity) => {
                    const daysUntilDeadline = getDaysUntilDeadline(
                      activity.endDate
                    );
                    const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0;
                    const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7;
                    const ActivityIcon = getActivityIcon(activity.type);

                    return (
                      <div
                        key={activity.id}
                        className={`flex items-center gap-4 p-4 border rounded-lg ${
                          isOverdue
                            ? "border-red-200 bg-red-50"
                            : isUrgent
                            ? "border-orange-200 bg-orange-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 ${getActivityColor(
                            activity.type
                          )} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <ActivityIcon className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {activity.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            {activity.endDate && (
                              <span>
                                Échéance:{" "}
                                {format(activity.endDate, "dd MMM yyyy", {
                                  locale: fr,
                                })}
                              </span>
                            )}
                            <Badge
                              className={`${getStatusColor(
                                activity.status
                              )} text-white`}
                            >
                              {getStatusLabel(activity.status)}
                            </Badge>
                          </div>
                        </div>

                        <div
                          className={`text-right ${
                            isOverdue
                              ? "text-red-600"
                              : isUrgent
                              ? "text-orange-600"
                              : "text-gray-600"
                          }`}
                        >
                          <div className="font-medium">
                            {isOverdue
                              ? `${Math.abs(
                                  daysUntilDeadline
                                )} jour(s) de retard`
                              : `${daysUntilDeadline} jour(s) restant(s)`}
                          </div>
                          {isOverdue && (
                            <div className="text-xs">⚠️ En retard</div>
                          )}
                          {isUrgent && !isOverdue && (
                            <div className="text-xs">⏰ Urgent</div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {activities.filter(
                  (a) => a.status !== "completed" && a.status !== "evaluated"
                ).length === 0 && (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Aucune échéance en cours
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      */ {
  /* Dialog de visualisation d'activité */
}
/*
      <Dialog
        open={!!viewingActivity}
        onOpenChange={() => setViewingActivity(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {viewingActivity && (
                <>
                  <div
                    className={`w-8 h-8 ${getActivityColor(
                      viewingActivity.type
                    )} rounded-lg flex items-center justify-center`}
                  >
                    {React.createElement(
                      getActivityIcon(viewingActivity.type),
                      { className: "w-4 h-4 text-white" }
                    )}
                  </div>
                  {viewingActivity.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {viewingActivity && (
            <div className="space-y-6">
              */ {
  /* Informations générales */
}
/*
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Type d'activité
                  </Label>
                  <div className="mt-1">
                    <Badge
                      className={`${getActivityColor(
                        viewingActivity.type
                      )} text-white`}
                    >
                      {
                        activityTypes.find(
                          (t) => t.value === viewingActivity.type
                        )?.label
                      }
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Statut
                  </Label>
                  <div className="mt-1">
                    <Badge
                      className={`${getStatusColor(
                        viewingActivity.status
                      )} text-white`}
                    >
                      {getStatusLabel(viewingActivity.status)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Période
                  </Label>
                  <p className="mt-1">
                    {viewingActivity.startDate && viewingActivity.endDate ? (
                      <>
                        Du{" "}
                        {format(viewingActivity.startDate, "dd MMM yyyy", {
                          locale: fr,
                        })}{" "}
                        au{" "}
                        {format(viewingActivity.endDate, "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </>
                    ) : (
                      "Dates non définies"
                    )}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Priorité
                  </Label>
                  <div className="mt-1">
                    <Badge
                      className={`${getPriorityColor(
                        viewingActivity.priority
                      )} text-white`}
                    >
                      {viewingActivity.priority === "low"
                        ? "Basse"
                        : viewingActivity.priority === "medium"
                        ? "Moyenne"
                        : "Haute"}
                    </Badge>
                  </div>
                </div>
              </div>

              */ {
  /* Description */
}
/*
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Description
                </Label>
                <p className="mt-2 text-sm leading-relaxed">
                  {viewingActivity.description}
                </p>
              </div>

              */ {
  /* Objectifs */
}
/*
              {viewingActivity.objectives.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Objectifs
                  </Label>
                  <ul className="mt-2 space-y-1">
                    {viewingActivity.objectives.map((objective, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              */ {
  /* Résultats */
}
/*
              {viewingActivity.outcomes.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Résultats obtenus
                  </Label>
                  <ul className="mt-2 space-y-1">
                    {viewingActivity.outcomes.map((outcome, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              */ {
  /* Défis */
}
/*
              {viewingActivity.challenges.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Défis rencontrés
                  </Label>
                  <ul className="mt-2 space-y-1">
                    {viewingActivity.challenges.map((challenge, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              */ {
  /* Apprentissages */
}
/*
              {viewingActivity.learnings.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Apprentissages clés
                  </Label>
                  <ul className="mt-2 space-y-1">
                    {viewingActivity.learnings.map((learning, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {learning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              */ {
  /* Temps investi */
}
/*
              {(viewingActivity.estimatedHours ||
                viewingActivity.actualHours) && (
                <div className="grid grid-cols-2 gap-4">
                  {viewingActivity.estimatedHours && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Temps estimé
                      </Label>
                      <p className="mt-1 text-sm">
                        {viewingActivity.estimatedHours}h
                      </p>
                    </div>
                  )}
                  {viewingActivity.actualHours && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Temps réel
                      </Label>
                      <p className="mt-1 text-sm">
                        {viewingActivity.actualHours}h
                      </p>
                    </div>
                  )}
                </div>
              )}

              */ {
  /* Évaluation */
}
/*
              {viewingActivity.score && viewingActivity.maxScore && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Évaluation</Label>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">
                        {viewingActivity.score}/{viewingActivity.maxScore}
                      </span>
                    </div>
                  </div>
                  {viewingActivity.feedback && (
                    <div className="mt-2">
                      <Label className="text-xs font-medium text-muted-foreground">
                        Commentaire de l'évaluateur
                      </Label>
                      <p className="text-sm mt-1 italic">
                        "{viewingActivity.feedback}"
                      </p>
                      {viewingActivity.evaluatorName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          — {viewingActivity.evaluatorName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              */ {
  /* Collaborateurs */
}
/*
              {viewingActivity.collaborators &&
                viewingActivity.collaborators.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Collaborateurs
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {viewingActivity.collaborators.map(
                        (collaborator, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Users className="w-3 h-3" />
                            {collaborator}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

              */ {
  /* Tags */
}
/*
              {viewingActivity.tags && viewingActivity.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewingActivity.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingActivity(null)}>
              Fermer
            </Button>
            {viewingActivity && (
              <Button
                onClick={() => {
                  setViewingActivity(null);
                  handleEdit(viewingActivity);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      */ {
  /* Dialog de formulaire */
}
/*
      <Dialog
        open={showForm}
        onOpenChange={() => {
          if (!isLoading) {
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              {editingActivity
                ? "Modifier l'activité"
                : "Nouvelle réalisation LED"}
            </DialogTitle>
            <DialogDescription>
              Documentez votre projet en Leadership, Entrepreneuriat ou Digital
              transformation
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            */ {
  /* Informations de base */
}
/*
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Titre de l'activité *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ex: Développement d'une application mobile innovante..."
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="type">Type d'activité *</Label>
                <Select
                  value={formData.type ?? ""}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: value as
                        | "entrepreneuriat"
                        | "leadership"
                        | "digital",
                    }))
                  }
                >
                  <SelectTrigger className="mt-1" disabled={isLoading}>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {React.createElement(type.icon, {
                            className: "w-4 h-4",
                          })}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="mt-1" disabled={isLoading}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="startDate">Date de début (optionnel)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="mt-1 w-full justify-start text-left font-normal"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate
                        ? format(formData.startDate, "dd MMM yyyy", {
                            locale: fr,
                          })
                        : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, startDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="endDate">Date de fin (optionnel)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="mt-1 w-full justify-start text-left font-normal"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate
                        ? format(formData.endDate, "dd MMM yyyy", {
                            locale: fr,
                          })
                        : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, endDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description détaillée *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Décrivez votre projet, vos méthodes, les technologies utilisées, l'impact attendu... (minimum 100 caractères)"
                rows={4}
                className="mt-1"
                disabled={isLoading}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/100 caractères minimum
              </div>
            </div>

            */ {
  /* Section avancée (optionnelle) */
}
/*
            <div className="space-y-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdvancedForm(!showAdvancedForm)}
                className="flex items-center gap-2"
              >
                {showAdvancedForm ? (
                  <>
                    <X className="w-4 h-4" />
                    Masquer les options avancées
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Options avancées (collaborateurs, objectifs, etc.)
                  </>
                )}
              </Button>

              {showAdvancedForm && (
                <div className="space-y-6 p-4 border rounded-lg bg-gray-50">
                  */ {
  /* Temps estimé et réel */
}
/*
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimatedHours">
                        Temps estimé (heures)
                      </Label>
                      <Input
                        id="estimatedHours"
                        type="number"
                        min="0"
                        value={formData.estimatedHours}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            estimatedHours: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="actualHours">Temps réel (heures)</Label>
                      <Input
                        id="actualHours"
                        type="number"
                        min="0"
                        value={formData.actualHours}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            actualHours: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  */ {
  /* Collaborateurs */
}
/*
                  <div>
                    <Label>Collaborateurs</Label>
                    <div className="space-y-2 mt-2">
                      {formData.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={collaborator}
                            onChange={(e) =>
                              updateListItem(
                                "collaborators",
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Nom du collaborateur"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeListItem("collaborators", index)
                            }
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("collaborators")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un collaborateur
                      </Button>
                    </div>
                  </div>

                  */ {
  /* Objectifs */
}
/*
                  <div>
                    <Label>Objectifs *</Label>
                    <div className="space-y-2 mt-2">
                      {formData.objectives.map((objective, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={objective}
                            onChange={(e) =>
                              updateListItem(
                                "objectives",
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Décrivez un objectif de ce projet..."
                            rows={2}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem("objectives", index)}
                            disabled={
                              isLoading || formData.objectives.length <= 1
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("objectives")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un objectif
                      </Button>
                    </div>
                  </div>

                  */ {
  /* Résultats obtenus */
}
/*
                  <div>
                    <Label>Résultats obtenus</Label>
                    <div className="space-y-2 mt-2">
                      {formData.outcomes.map((outcome, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={outcome}
                            onChange={(e) =>
                              updateListItem("outcomes", index, e.target.value)
                            }
                            placeholder="Décrivez un résultat concret obtenu..."
                            rows={2}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem("outcomes", index)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("outcomes")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un résultat
                      </Button>
                    </div>
                  </div>

                  */ {
  /* Défis rencontrés */
}
/*
                  <div>
                    <Label>Défis rencontrés</Label>
                    <div className="space-y-2 mt-2">
                      {formData.challenges.map((challenge, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={challenge}
                            onChange={(e) =>
                              updateListItem(
                                "challenges",
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Décrivez une difficulté rencontrée..."
                            rows={2}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem("challenges", index)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("challenges")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un défi
                      </Button>
                    </div>
                  </div>

                  */ {
  /* Apprentissages clés */
}
/*
                  <div>
                    <Label>Apprentissages clés</Label>
                    <div className="space-y-2 mt-2">
                      {formData.learnings.map((learning, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={learning}
                            onChange={(e) =>
                              updateListItem("learnings", index, e.target.value)
                            }
                            placeholder="Qu'avez-vous appris grâce à ce projet ?"
                            rows={2}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem("learnings", index)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("learnings")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un apprentissage
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            */ {
  /* Upload de documents */
}
/*
            <div>
              <Label>Documents justificatifs</Label>
              <div className="mt-2 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Glissez-déposez vos fichiers ici ou
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                    >
                      <PaperclipIcon className="w-4 h-4 mr-2" />
                      Parcourir
                    </Button>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, JPG, PNG - Max 10MB par fichier
                  </p>
                </div>

                */ {
  /* Liste des fichiers */
}
/*
                {formData.documents.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Fichiers sélectionnés :</Label>
                    {formData.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            */ {
  /* Statut */
}
/*
            <div>
              <Label htmlFor="status">Statut de l'activité</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="mt-1" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        {React.createElement(status.icon, {
                          className: "w-4 h-4",
                        })}
                        {status.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            */ {
  /* Tags (suggestions automatiques) */
} /*
            <div>
              <Label>Tags (optionnel)</Label>
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Innovation",
                    "Mobile",
                    "IoT",
                    "IA",
                    "Blockchain",
                    "Startup",
                    "Développement Durable",
                    "Formation",
                    "Management",
                    "Équipe",
                  ].map((suggestedTag) => (
                    <Button
                      key={suggestedTag}
                      type="button"
                      variant={
                        formData.tags.includes(suggestedTag)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (formData.tags.includes(suggestedTag)) {
                          setFormData((prev) => ({
                            ...prev,
                            tags: prev.tags.filter(
                              (tag) => tag !== suggestedTag
                            ),
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            tags: [...prev.tags, suggestedTag],
                          }));
                        }
                      }}
                      disabled={isLoading}
                    >
                      {suggestedTag}
                    </Button>
                  ))}
                </div>
                {formData.tags.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Tags sélectionnés : {formData.tags.join(", ")}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {editingActivity ? "Modification..." : "Soumission..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingActivity
                      ? "Modifier l'activité"
                      : "Soumettre l'activité"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}*/

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { useRef } from "react";
import {
  Plus,
  Upload,
  Calendar as CalendarIcon,
  FileText,
  Briefcase,
  Lightbulb,
  Monitor,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Save,
  X,
  PaperclipIcon,
  Download,
  Filter,
  Search,
  Award,
  TrendingUp,
  Target,
  Users,
  Building,
  Star,
  MessageSquare,
  Send,
  RefreshCw,
} from "lucide-react";
import { format, isAfter, isBefore, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { activityService, Activity } from "../services/activityService";
import { useApi } from "../hooks/useApi";

interface ActivitySubmissionProps {
  userRole: string;
}

export function ActivitySubmission({ userRole }: ActivitySubmissionProps) {
  const {
    data: activities,
    loading,
    error: apiError,
    refetch,
  } = useApi(() => activityService.getActivities(), []);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Gérer le focus quand le dialog s'ouvre
  useEffect(() => {
    if (isDialogOpen && titleInputRef.current) {
      // Délai pour laisser le dialog s'ouvrir complètement
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isDialogOpen]);

  // État pour les fichiers sélectionnés
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "" as "entrepreneuriat" | "leadership" | "digital" | "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: "planned" as Activity["status"],
    documents: [] as File[],
    priority: "medium" as "low" | "medium" | "high",
    estimatedHours: 0,
    actualHours: 0,
    collaborators: [] as string[],
    objectives: [""] as string[],
    outcomes: [""] as string[],
    challenges: [""] as string[],
    learnings: [""] as string[],
    tags: [] as string[],
  });

  // Types d'activités disponibles
  const activityTypes = [
    {
      value: "entrepreneuriat",
      label: "Entrepreneuriat",
      icon: Target,
      description:
        "Projets d'innovation, création d'entreprise, initiatives commerciales",
      color: "bg-blue-500",
    },
    {
      value: "leadership",
      label: "Leadership",
      icon: Users,
      description:
        "Management d'équipe, organisation d'événements, responsabilités associatives",
      color: "bg-green-500",
    },
    {
      value: "digital",
      label: "Digital",
      icon: Monitor,
      description:
        "Développement logiciel, projets tech, transformation numérique",
      color: "bg-purple-500",
    },
  ];

  const priorityOptions = [
    { value: "low", label: "Basse", color: "bg-gray-100 text-gray-800" },
    {
      value: "medium",
      label: "Moyenne",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "Haute", color: "bg-red-100 text-red-800" },
  ];

  const statusOptions = [
    {
      value: "planned",
      label: "Planifiée",
      icon: CalendarIcon,
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "in_progress",
      label: "En cours",
      icon: RefreshCw,
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "completed",
      label: "Terminée",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800",
    },
    {
      value: "submitted",
      label: "Soumise",
      icon: Upload,
      color: "bg-purple-100 text-purple-800",
    },
  ];

  // Gestion de la sélection de fichiers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      validateAndAddFiles(newFiles);
    }
  };

  const validateAndAddFiles = (files: File[]) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
      "video/mp4",
      "video/avi",
    ];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        setError(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        setError(`Le type de fichier ${file.name} n'est pas autorisé`);
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    if (validFiles.length > 0) setError("");
  };

  // Gestion du drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndAddFiles(droppedFiles);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Gestion des listes dynamiques (objectifs, résultats, défis, apprentissages)
  const addListItem = (
    field:
      | "objectives"
      | "outcomes"
      | "challenges"
      | "learnings"
      | "collaborators"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateListItem = (
    field:
      | "objectives"
      | "outcomes"
      | "challenges"
      | "learnings"
      | "collaborators",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeListItem = (
    field:
      | "objectives"
      | "outcomes"
      | "challenges"
      | "learnings"
      | "collaborators",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Fonction de téléchargement de document
  const handleDownloadDocument = async (
    documentUrl: string,
    filename: string
  ) => {
    const result = await activityService.downloadDocument(
      documentUrl,
      filename
    );
    if (!result.success) {
      setError(result.error || "Erreur de téléchargement");
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation des champs obligatoires
    if (!formData.title || !formData.type || !formData.description) {
      setError("Veuillez remplir tous les champs obligatoires");
      setIsLoading(false);
      return;
    }

    if (formData.description.length < 100) {
      setError("La description doit contenir au moins 100 caractères");
      setIsLoading(false);
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      setError("La date de fin doit être postérieure à la date de début");
      setIsLoading(false);
      return;
    }

    if (formData.objectives.filter((obj) => obj.trim()).length === 0) {
      setError("Veuillez ajouter au moins un objectif");
      setIsLoading(false);
      return;
    }

    try {
      const activityData = {
        title: formData.title,
        type: formData.type as "entrepreneuriat" | "leadership" | "digital",
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        priority: formData.priority,
        estimatedHours: formData.estimatedHours,
        actualHours: formData.actualHours,
        collaborators: formData.collaborators.filter((c) => c.trim()),
        objectives: formData.objectives.filter((obj) => obj.trim()),
        outcomes: formData.outcomes.filter((out) => out.trim()),
        challenges: formData.challenges.filter((ch) => ch.trim()),
        learnings: formData.learnings.filter((l) => l.trim()),
        tags: formData.tags,
        progress:
          formData.status === "completed"
            ? 100
            : formData.status === "in_progress"
            ? 50
            : 0,
        documents: [],
      };

      let response;
      if (editingActivity) {
        response = await activityService.updateActivity(
          editingActivity.id,
          activityData
        );
      } else {
        response = await activityService.createActivity(activityData);
      }

      if (response.success && response.data) {
        // Upload des fichiers si présents
        if (selectedFiles.length > 0) {
          const uploadResponse = await activityService.uploadDocuments(
            response.data.id,
            selectedFiles
          );
          if (!uploadResponse.success) {
            setError("Activité créée mais erreur d'upload des fichiers");
          }
        }

        setSuccess(
          editingActivity
            ? "Activité modifiée avec succès ! 🎉"
            : "Activité soumise avec succès ! Votre progression LED a été mise à jour. 🚀"
        );

        resetForm();
        refetch();
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(response.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      status: "planned",
      documents: [],
      priority: "medium",
      estimatedHours: 0,
      actualHours: 0,
      collaborators: [],
      objectives: [""],
      outcomes: [""],
      challenges: [""],
      learnings: [""],
      tags: [],
    });
    setSelectedFiles([]);
    setShowForm(false);
    setEditingActivity(null);
    setError("");
  };

  // Fonction d'export des données
  const exportActivities = async (format: "csv" | "excel" | "pdf") => {
    try {
      setIsLoading(true);
      const result = await activityService.exportActivities(format);
      
      if (result.success) {
        setSuccess(`Export ${format.toUpperCase()} réussi ! 📥`);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Erreur lors de l'export");
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Export error:", error);
      setError("Erreur lors de l'export");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Édition d'une activité existante
  const handleEditActivity = (activity: Activity) => {
    setFormData({
      title: activity.title,
      type: activity.type,
      description: activity.description,
      startDate: new Date(activity.startDate),
      endDate: new Date(activity.endDate),
      status: activity.status,
      documents: [],
      priority: activity.priority,
      estimatedHours: activity.estimatedHours || 0,
      actualHours: activity.actualHours || 0,
      collaborators: activity.collaborators || [],
      objectives: activity.objectives || [""],
      outcomes: activity.outcomes || [],
      challenges: activity.challenges || [],
      learnings: activity.learnings || [],
      tags: activity.tags || [],
    });
    setEditingActivity(activity);
    setShowForm(true);
  };

  const getStatusBadge = (status: string) => {
    const statusInfo =
      statusOptions.find((s) => s.value === status) || statusOptions[0];
    return (
      <Badge className={statusInfo.color}>
        <statusInfo.icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>
    );
  };

  // Gestion du loading et des erreurs
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Chargement de vos activités...
          </p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erreur de chargement des données: {apiError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Vérification du rôle utilisateur
  if (userRole !== "student" && userRole !== "STUDENT") {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cette fonctionnalité est réservée aux étudiants boursiers LED.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header avec boutons d'export */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            Mes Réalisations LED
          </h1>
          <p className="text-muted-foreground text-lg">
            Gérez et valorisez vos projets en Leadership, Entrepreneuriat &
            Digital
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportActivities("csv")}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => exportActivities("excel")}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => exportActivities("pdf")}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Réalisation
          </Button>
        </div>
      </div>

      {/* Alertes */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Affichage des activités existantes */}
      {activities && activities.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{activity.type}</Badge>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditActivity(activity)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {activity.description.slice(0, 120)}...
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{activity.progress}%</span>
                  </div>
                  <Progress value={activity.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>
                    {activity.startDate && activity.endDate ? (
                      <>
                        Du{" "}
                        {format(new Date(activity.startDate), "dd MMM", {
                          locale: fr,
                        })}{" "}
                        au{" "}
                        {format(new Date(activity.endDate), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </>
                    ) : (
                      "Dates non définies"
                    )}
                  </span>
                </div>

                {/* Section documents */}
                {activity.documents && activity.documents.length > 0 && (
                  <div className="border-t pt-3">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Documents ({activity.documents.length})
                    </Label>
                    <div className="mt-2 space-y-2 max-h-24 overflow-y-auto">
                      {activity.documents.slice(0, 2).map((docUrl, index) => {
                        const filename =
                          docUrl.split("/").pop() || `document-${index + 1}`;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3 text-muted-foreground" />
                              <span className="truncate">{filename}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDownloadDocument(docUrl, filename)
                              }
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        );
                      })}
                      {activity.documents.length > 2 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{activity.documents.length - 2} autres documents
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <Target className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune activité LED</h3>
            <p className="text-muted-foreground mb-6">
              Commencez par documenter votre première réalisation
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer ma première activité
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog du formulaire - VERSION AMÉLIORÉE */}
      <Dialog open={showForm} onOpenChange={() => !isLoading && resetForm()}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-hidden flex flex-col p-0">
          {/* En-tête moderne avec dégradé sobre */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white px-6 py-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-xl">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">
                    {editingActivity
                      ? "Modifier l'activité"
                      : "Nouvelle réalisation LED"}
                  </div>
                  <DialogDescription className="text-slate-200 text-sm mt-0.5">
                    Documentez votre projet en Leadership, Entrepreneuriat ou Digital
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
              {/* Tabs List améliorée avec indicateurs */}
              <div className="bg-gray-50 border-b px-6 py-3">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-white/50 p-1 rounded-lg">
                  <TabsTrigger
                    value="basic"
                    className="text-xs sm:text-sm py-2.5 px-3 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <span className="hidden sm:inline font-medium">Informations</span>
                      <span className="sm:hidden font-medium">Infos</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="text-xs sm:text-sm py-2.5 px-3 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <span className="hidden sm:inline font-medium">Détails</span>
                      <span className="sm:hidden font-medium">Détails</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="text-xs sm:text-sm py-2.5 px-3 data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <span className="hidden sm:inline font-medium">Documents</span>
                      <span className="sm:hidden font-medium">Docs</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="text-xs sm:text-sm py-2.5 px-3 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <span className="hidden sm:inline font-medium">Avancé</span>
                      <span className="sm:hidden font-medium">Avancé</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Container scrollable avec padding amélioré */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* Tab 1: Informations de base */}
                <TabsContent value="basic" className="space-y-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Titre de l'activité *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Ex: Développement d'une application mobile innovante..."
                        className="mt-1"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="type">Type d'activité *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: any) =>
                          setFormData((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger className="mt-1" disabled={isLoading}>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {activityTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-start gap-2">
                                <type.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">
                                    {type.label}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {type.description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value: any) =>
                          setFormData((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger className="mt-1" disabled={isLoading}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <Badge className={option.color}>
                                {option.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="startDate">Date de début</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="mt-1 w-full justify-start text-left font-normal"
                            disabled={isLoading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate
                              ? format(formData.startDate, "dd MMM yyyy", {
                                  locale: fr,
                                })
                              : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                startDate: date,
                              }))
                            }
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="endDate">Date de fin</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="mt-1 w-full justify-start text-left font-normal"
                            disabled={isLoading}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate
                              ? format(formData.endDate, "dd MMM yyyy", {
                                  locale: fr,
                                })
                              : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                endDate: date,
                              }))
                            }
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description détaillée *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Décrivez votre projet, vos méthodes, les technologies utilisées, l'impact attendu... (maximum 100 caractères)"
                      rows={6}
                      className="mt-1"
                      disabled={isLoading}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {formData.description.length}/100 caractères maximum
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Détails du projet */}
                <TabsContent value="details" className="space-y-6">
                  {/* Objectifs */}
                  <div>
                    <Label>Objectifs du projet *</Label>
                    <div className="space-y-2 mt-2">
                      {formData.objectives.map((objective, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={objective}
                            onChange={(e) =>
                              updateListItem(
                                "objectives",
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Décrivez un objectif de ce projet..."
                            rows={2}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem("objectives", index)}
                            disabled={
                              isLoading || formData.objectives.length <= 1
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("objectives")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un objectif
                      </Button>
                    </div>
                  </div>

                  {/* Collaborateurs */}
                  <div>
                    <Label>Collaborateurs et partenaires</Label>
                    <div className="space-y-2 mt-2">
                      {formData.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={collaborator}
                            onChange={(e) =>
                              updateListItem(
                                "collaborators",
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Nom du collaborateur..."
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeListItem("collaborators", index)
                            }
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("collaborators")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un collaborateur
                      </Button>
                    </div>
                  </div>

                  {/* Résultats attendus */}
                  <div>
                    <Label>Résultats attendus</Label>
                    <div className="space-y-2 mt-2">
                      {formData.outcomes.map((outcome, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={outcome}
                            onChange={(e) =>
                              updateListItem("outcomes", index, e.target.value)
                            }
                            placeholder="Décrivez un résultat attendu..."
                            rows={2}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem("outcomes", index)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("outcomes")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un résultat
                      </Button>
                    </div>
                  </div>

                  {/* Défis et difficultés */}
                  <div>
                    <Label>Défis et difficultés rencontrés</Label>
                    <div className="space-y-2 mt-2">
                      {formData.challenges.map((challenge, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={challenge}
                            onChange={(e) =>
                              updateListItem(
                                "challenges",
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Décrivez un défi rencontré..."
                            rows={2}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem("challenges", index)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("challenges")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un défi
                      </Button>
                    </div>
                  </div>

                  {/* Apprentissages */}
                  <div>
                    <Label>Apprentissages et compétences développées</Label>
                    <div className="space-y-2 mt-2">
                      {formData.learnings.map((learning, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={learning}
                            onChange={(e) =>
                              updateListItem("learnings", index, e.target.value)
                            }
                            placeholder="Décrivez ce que vous avez appris..."
                            rows={2}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeListItem("learnings", index)}
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem("learnings")}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un apprentissage
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Documents */}
                <TabsContent value="documents" className="space-y-6">
                  <div>
                    <Label>Documents justificatifs</Label>
                    <div className="mt-2 space-y-4">
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragOver
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Glissez-déposez vos fichiers ici ou
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                          >
                            <PaperclipIcon className="w-4 h-4 mr-2" />
                            Parcourir
                          </Button>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.avi"
                            className="hidden"
                            id="file-upload"
                            disabled={isLoading}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, MP4, AVI - Max
                          10MB par fichier
                        </p>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm">
                            Fichiers sélectionnés :
                          </Label>
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-4 h-4 text-blue-500" />
                                  <div>
                                    <p className="text-sm font-medium truncate max-w-xs">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / (1024 * 1024)).toFixed(2)}{" "}
                                      MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  disabled={isLoading}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 4: Paramètres avancés */}
                <TabsContent value="advanced" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimatedHours">Heures estimées</Label>
                      <Input
                        id="estimatedHours"
                        type="number"
                        value={formData.estimatedHours}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            estimatedHours: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="actualHours">Heures réelles</Label>
                      <Input
                        id="actualHours"
                        type="number"
                        value={formData.actualHours}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            actualHours: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="status">Statut de l'activité</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) =>
                          setFormData((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger className="mt-1" disabled={isLoading}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <status.icon className="w-4 h-4" />
                                <Badge className={status.color}>
                                  {status.label}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            {/* Footer moderne avec bordure et fond */}
            <div className="border-t bg-gray-50 px-6 py-4 flex-shrink-0">
              <DialogFooter className="flex gap-3 sm:justify-between items-center">
                <div className="hidden sm:flex items-center text-xs text-muted-foreground gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Les champs marqués d'un * sont obligatoires
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg flex-1 sm:flex-none"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        {editingActivity ? "Modification..." : "Soumission..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingActivity
                          ? "Modifier l'activité"
                          : "Enregistrer l'activité"}
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
