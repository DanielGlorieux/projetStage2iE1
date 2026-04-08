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
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);

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

    // Vérifier que chaque objectif a au moins 10 caractères
    const shortObjectives = formData.objectives.filter(
      (obj) => obj.trim() && obj.trim().length < 10
    );
    if (shortObjectives.length > 0) {
      setError("Chaque objectif doit contenir au moins 10 caractères");
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
        // Afficher les détails de validation si disponibles
        if (response.details && response.details.length > 0) {
          const validationErrors = response.details
            .map((detail: any) => `${detail.path || detail.param}: ${detail.msg}`)
            .join(', ');
          setError(`Erreur de validation: ${validationErrors}`);
          console.error('Détails de validation:', response.details);
        } else {
          setError(response.error || "Erreur lors de la sauvegarde");
        }
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
                      title="Modifier l'activité"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setViewingActivity(activity)}
                      title="Voir les détails"
                    >
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
      <Dialog open={showForm} onOpenChange={() => !isLoading && resetForm()} modal={false}>
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
                      <Popover modal={false}>
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
                        <PopoverContent className="w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                startDate: date,
                              }))
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="endDate">Date de fin</Label>
                      <Popover modal={false}>
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
                        <PopoverContent className="w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) =>
                              setFormData((prev) => ({
                                ...prev,
                                endDate: date,
                              }))
                            }
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Chaque objectif doit contenir au moins 10 caractères
                    </p>
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
                            placeholder="Décrivez un objectif de ce projet (minimum 10 caractères)..."
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

      {/* Dialog de visualisation des détails */}
      <Dialog open={!!viewingActivity} onOpenChange={() => setViewingActivity(null)} modal={false}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{viewingActivity?.title}</DialogTitle>
          </DialogHeader>
          {viewingActivity && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <Badge variant="outline">{viewingActivity.type}</Badge>
                {getStatusBadge(viewingActivity.status)}
                <Badge variant="secondary" className="capitalize">
                  {viewingActivity.priority}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{viewingActivity.description}</p>
              </div>

              {viewingActivity.startDate && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Date de début</h3>
                    <p className="text-sm">{new Date(viewingActivity.startDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  {viewingActivity.endDate && (
                    <div>
                      <h3 className="font-semibold mb-2">Date de fin</h3>
                      <p className="text-sm">{new Date(viewingActivity.endDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
                </div>
              )}

              {viewingActivity.objectives && viewingActivity.objectives.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Objectifs</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {viewingActivity.objectives.map((obj, index) => (
                      <li key={index}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {viewingActivity.outcomes && viewingActivity.outcomes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Résultats</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {viewingActivity.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setViewingActivity(null)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setViewingActivity(null);
                  handleEditActivity(viewingActivity);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
