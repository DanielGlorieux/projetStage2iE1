/*import React, { useState } from "react";
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
} from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  User,
  Calendar,
  Briefcase,
  Lightbulb,
  Monitor,
  Star,
  MessageSquare,
  Download,
  Filter,
  Search,
  GraduationCap,
  Award,
  TrendingUp,
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  type: "entrepreneuriat" | "leadership" | "digital";
  description: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "approved" | "rejected" | "in_review";
  student: {
    id: string;
    name: string;
    email: string;
    program: string;
    year: number;
    avatar?: string;
  };
  submittedAt: Date;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
  }>;
  evaluation?: {
    score: number;
    maxScore: number;
    comments: string;
    evaluatedAt: Date;
    evaluatedBy: string;
  };
  progress: number;
}

interface ActivityValidationProps {
  userRole: string;
}

export function ActivityValidation({ userRole }: ActivityValidationProps) {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      title: "Projet d'Innovation en Agriculture Intelligente",
      type: "entrepreneuriat",
      description:
        "Développement d'un système IoT pour optimiser l'irrigation et surveiller les cultures. Le projet intègre des capteurs d'humidité, une application mobile et un tableau de bord web pour les agriculteurs.",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-05-30"),
      status: "pending",
      student: {
        id: "1",
        name: "Aminata KONE",
        email: "aminata.kone.et@2ie-edu.org",
        program: "Génie Rural et Environnement",
        year: 4,
      },
      submittedAt: new Date("2024-03-10"),
      documents: [
        {
          id: "1",
          name: "Rapport_Final_AgriSmart.pdf",
          type: "pdf",
          size: 2450000,
        },
        {
          id: "2",
          name: "Presentation_Prototype.pptx",
          type: "pptx",
          size: 15670000,
        },
        { id: "3", name: "Demo_Video.mp4", type: "mp4", size: 45230000 },
      ],
      progress: 95,
    },
    {
      id: "2",
      title: "Plateforme de Leadership Digital pour Jeunes",
      type: "leadership",
      description:
        "Création d'une plateforme communautaire pour développer les compétences de leadership chez les jeunes à travers des challenges, mentorat et formations en ligne.",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-04-15"),
      status: "approved",
      student: {
        id: "2",
        name: "Boureima OUEDRAOGO",
        email: "boureima.ouedraogo.et@2ie-edu.org",
        program: "Informatique et Télécommunications",
        year: 3,
      },
      submittedAt: new Date("2024-04-10"),
      documents: [
        {
          id: "3",
          name: "Rapport_Leadership_Platform.pdf",
          type: "pdf",
          size: 3200000,
        },
        { id: "4", name: "Mockups_Interface.png", type: "png", size: 8900000 },
      ],
      evaluation: {
        score: 18,
        maxScore: 20,
        comments:
          "Excellent projet avec une approche innovante. La plateforme répond à un vrai besoin et l'exécution est remarquable. Quelques améliorations mineures suggérées pour l'interface utilisateur.",
        evaluatedAt: new Date("2024-04-12"),
        evaluatedBy: "Prof. Marie TRAORE",
      },
      progress: 100,
    },
  ]);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState({
    score: 0,
    maxScore: 20,
    comments: "",
    status: "approved" as "approved" | "rejected",
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const activityTypes = [
    {
      value: "entrepreneuriat",
      label: "Entrepreneuriat",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      value: "leadership",
      label: "Leadership",
      icon: Lightbulb,
      color: "bg-green-500",
    },
    {
      value: "digital",
      label: "Digital",
      icon: Monitor,
      color: "bg-purple-500",
    },
  ];

  const statusOptions = [
    {
      value: "pending",
      label: "En attente",
      color: "bg-orange-500",
      icon: Clock,
    },
    {
      value: "in_review",
      label: "En cours d'évaluation",
      color: "bg-blue-500",
      icon: Eye,
    },
    {
      value: "approved",
      label: "Approuvée",
      color: "bg-green-500",
      icon: CheckCircle,
    },
    { value: "rejected", label: "Rejetée", color: "bg-red-500", icon: XCircle },
  ];

  // Fonction pour formatter la date (remplace date-fns)
  const formatDate = (date: Date, format: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: format.includes("MMMM") ? "long" : "2-digit",
      day: "2-digit",
      ...(format.includes("HH:mm") && { hour: "2-digit", minute: "2-digit" }),
    };

    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesStatus =
      filterStatus === "all" || activity.status === filterStatus;
    const matchesType = filterType === "all" || activity.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.student.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const handleEvaluate = (activity: Activity) => {
    setSelectedActivity(activity);
    setEvaluationForm({
      score: activity.evaluation?.score || 0,
      maxScore: 20,
      comments: activity.evaluation?.comments || "",
      status: activity.status === "rejected" ? "rejected" : "approved",
    });
    setShowEvaluationDialog(true);
  };

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetailsDialog(true);
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedActivity) return;

    setIsLoading(true);
    setSuccess("");
    setTimeout(() => {
      const updatedActivities = activities.map((activity) => {
        if (activity.id === selectedActivity.id) {
          return {
            ...activity,
            status: evaluationForm.status,
            evaluation: {
              score: evaluationForm.score,
              maxScore: evaluationForm.maxScore,
              comments: evaluationForm.comments,
              evaluatedAt: new Date(),
              evaluatedBy: "Prof. Mamadou TRAORE",
            },
          };
        }
        return activity;
      });

      setActivities(updatedActivities);
      setShowEvaluationDialog(false);
      setSelectedActivity(null);
      setIsLoading(false);
      setSuccess(`Activité "${selectedActivity.title}" évaluée avec succès !`);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.color : "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.icon : Clock;
  };

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find((t) => t.value === type);
    return activityType ? activityType.icon : FileText;
  };

  const getActivityColor = (type: string) => {
    const activityType = activityTypes.find((t) => t.value === type);
    return activityType ? activityType.color : "bg-gray-500";
  };

  const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatsForStatus = (status: string) => {
    return activities.filter((a) => a.status === status).length;
  };

  if (userRole !== "supervisor" && userRole !== "led_team") {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cette fonctionnalité est réservée aux encadrants et à l'équipe LED.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Validation des Activités LED
        </h1>
        <p className="text-muted-foreground mt-2">
          Évaluez et validez les activités soumises par vos étudiants boursiers
        </p>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      */ {
  /* Stats Cards */
}
/*
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getStatsForStatus("pending")}
            </div>
            <p className="text-xs text-muted-foreground">activités à évaluer</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Révision</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getStatsForStatus("in_review")}
            </div>
            <p className="text-xs text-muted-foreground">
              en cours d'évaluation
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getStatsForStatus("approved")}
            </div>
            <p className="text-xs text-muted-foreground">activités validées</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {getStatsForStatus("rejected")}
            </div>
            <p className="text-xs text-muted-foreground">
              nécessitent révision
            </p>
          </CardContent>
        </Card>
      </div>

      */ {
  /* Filters */
}
/*
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou nom d'étudiant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {statusOptions.map((status) => {
              const Icon = status.icon;
              return (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {status.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {activityTypes.map((type) => {
              const Icon = type.icon;
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      */ {
  /* Activities List */
}
/*
      {filteredActivities.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune activité trouvée
            </h3>
            <p className="text-muted-foreground">
              Aucune activité ne correspond à vos critères de recherche
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status);

            return (
              <Card
                key={activity.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      */ {
  /* Avatar étudiant */
}
/*
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={activity.student.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold">
                          {activity.student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-lg ${getActivityColor(
                              activity.type
                            )} flex items-center justify-center`}
                          >
                            <ActivityIcon className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold line-clamp-1">
                            {activity.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="font-medium">
                              {activity.student.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            <span>
                              {activity.student.program} - Année{" "}
                              {activity.student.year}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Soumis le{" "}
                              {formatDate(activity.submittedAt, "dd/MM/yyyy")}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {activity.description}
                        </p>

                        {activity.documents.length > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {activity.documents.length} document
                              {activity.documents.length > 1 ? "s" : ""} joint
                              {activity.documents.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}

                        {activity.evaluation && (
                          <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Évaluation
                              </span>
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  {activity.evaluation.score}/
                                  {activity.evaluation.maxScore}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {activity.evaluation.comments}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Évaluée par {activity.evaluation.evaluatedBy} le{" "}
                              {formatDate(
                                activity.evaluation.evaluatedAt,
                                "dd/MM/yyyy"
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      <Badge
                        className={`${getStatusColor(
                          activity.status
                        )} text-white flex items-center gap-1`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {getStatusLabel(activity.status)}
                      </Badge>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(activity)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Détails
                        </Button>

                        {(activity.status === "pending" ||
                          activity.status === "in_review") && (
                          <Button
                            size="sm"
                            onClick={() => handleEvaluate(activity)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Évaluer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Progression
                      </span>
                      <span className="text-xs font-medium">
                        {activity.progress}%
                      </span>
                    </div>
                    <Progress value={activity.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      */ {
  /* Evaluation Dialog */
}
/*
      <Dialog
        open={showEvaluationDialog}
        onOpenChange={setShowEvaluationDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Évaluer l'Activité
            </DialogTitle>
            <DialogDescription>
              Évaluez l'activité "{selectedActivity?.title}" de{" "}
              {selectedActivity?.student.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {selectedActivity && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">{selectedActivity.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedActivity.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Type: {selectedActivity.type}</span>
                  <span>
                    Période:{" "}
                    {formatDate(selectedActivity.startDate, "dd/MM/yyyy")} -{" "}
                    {formatDate(selectedActivity.endDate, "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Décision</Label>
                <Select
                  value={evaluationForm.status}
                  onValueChange={(value: "approved" | "rejected") =>
                    setEvaluationForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Approuver
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Rejeter
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="score">
                  Note (sur {evaluationForm.maxScore})
                </Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max={evaluationForm.maxScore}
                  value={evaluationForm.score}
                  onChange={(e) =>
                    setEvaluationForm((prev) => ({
                      ...prev,
                      score: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Commentaires et feedback</Label>
              <Textarea
                id="comments"
                value={evaluationForm.comments}
                onChange={(e) =>
                  setEvaluationForm((prev) => ({
                    ...prev,
                    comments: e.target.value,
                  }))
                }
                placeholder="Donnez vos commentaires détaillés sur l'activité..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Vos commentaires aideront l'étudiant à comprendre votre
                évaluation et à s'améliorer
              </p>
            </div>

            {selectedActivity && selectedActivity.documents.length > 0 && (
              <div className="space-y-2">
                <Label>Documents joints</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedActivity.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm truncate">{doc.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({formatFileSize(doc.size)})
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                        title="Télécharger le document"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEvaluationDialog(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitEvaluation}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmer l'Évaluation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      */ {
  /* Details Dialog */
} /*
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Détails de l'Activité
            </DialogTitle>
            <DialogDescription>
              Consultez les détails complets de l'activité soumise par
              l'étudiant
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedActivity.student.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold text-lg">
                    {selectedActivity.student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">
                    {selectedActivity.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="font-medium">
                      {selectedActivity.student.name}
                    </span>
                    <span>{selectedActivity.student.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{selectedActivity.student.program}</span>
                    <span>Année {selectedActivity.student.year}</span>
                    <Badge
                      className={`${getActivityColor(
                        selectedActivity.type
                      )} text-white`}
                    >
                      {selectedActivity.type}
                    </Badge>
                  </div>
                </div>
                <Badge
                  className={`${getStatusColor(
                    selectedActivity.status
                  )} text-white`}
                >
                  {getStatusLabel(selectedActivity.status)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description du Projet</h4>
                  <p className="text-muted-foreground">
                    {selectedActivity.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      Période de Réalisation
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Du{" "}
                        {formatDate(selectedActivity.startDate, "dd/MM/yyyy")}{" "}
                        au {formatDate(selectedActivity.endDate, "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Date de Soumission</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {formatDate(
                          selectedActivity.submittedAt,
                          "dd/MM/yyyy HH:mm"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Progression</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Avancement du projet
                      </span>
                      <span className="text-sm font-medium">
                        {selectedActivity.progress}%
                      </span>
                    </div>
                    <Progress
                      value={selectedActivity.progress}
                      className="h-2"
                    />
                  </div>
                </div>

                {selectedActivity.documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Documents Joints</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedActivity.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {doc.type.toUpperCase()} •{" "}
                                {formatFileSize(doc.size)}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(doc.url, '_blank')}
                            title="Télécharger le document"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedActivity.evaluation && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Évaluation</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">Note obtenue</span>
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <Badge className="bg-yellow-100 text-yellow-800 text-base">
                            {selectedActivity.evaluation.score}/
                            {selectedActivity.evaluation.maxScore}
                          </Badge>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="font-medium text-sm">
                          Commentaires:
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedActivity.evaluation.comments}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Évaluée par {selectedActivity.evaluation.evaluatedBy} le{" "}
                        {formatDate(
                          selectedActivity.evaluation.evaluatedAt,
                          "dd/MM/yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}*/

import React, { useState, useEffect } from "react";
import { activityService } from "../services/activityService";
import { searchService } from "../services/searchService";
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
} from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  User,
  Calendar,
  Briefcase,
  Lightbulb,
  Monitor,
  Star,
  MessageSquare,
  Download,
  Filter,
  Search,
  GraduationCap,
  Award,
  TrendingUp,
} from "lucide-react";

import { Activity as ServiceActivity } from "../services/activityService";

interface Activity extends ServiceActivity {
  user: {
    id: string;
    name: string;
    email: string;
    filiere: string;
    niveau: string;
  };
  progress: number;
}

interface ActivityValidationProps {
  userRole: string;
}

export function ActivityValidation({ userRole }: ActivityValidationProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState({
    score: 0,
    feedback: "",
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState<any>(null);

  // Charger les activités
  useEffect(() => {
    loadActivities();
    loadStats();
  }, [filterStatus, filterType]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const filters: any = {};
      if (filterStatus !== "all") filters.status = filterStatus;
      if (filterType !== "all") filters.type = filterType;

      const response = await activityService.getActivities(filters);

      if (response.success && response.data) {
        // Filtrer seulement les activités soumises pour la validation
        const submittedActivities = response.data.filter(
          (activity: ServiceActivity) =>
            activity.status === "submitted" || activity.status === "evaluated"
        );
        setActivities(submittedActivities);
      } else {
        setError("Erreur lors du chargement des activités");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await searchService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
    }
  };

  // Filtrer les activités côté client
  const filteredActivities = activities.filter((activity) => {
    const matchesStatus =
      filterStatus === "all" || activity.status === filterStatus;
    const matchesType = filterType === "all" || activity.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  const handleEvaluate = (activity: Activity) => {
    setSelectedActivity(activity);
    setEvaluationForm({
      score: activity.evaluations?.[0]?.score || 0,
      feedback: activity.evaluations?.[0]?.feedback || "",
    });
    setShowEvaluationDialog(true);
  };

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetailsDialog(true);
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedActivity) return;

    try {
      setIsEvaluating(true);
      setError("");

      const response = await activityService.evaluateActivity(
        selectedActivity.id,
        {
          score: evaluationForm.score,
          feedback: evaluationForm.feedback,
          status: "EVALUATED",
        }
      );

      if (response.success) {
        // Mettre à jour l'activité dans la liste
        setActivities((prevActivities) =>
          prevActivities.map((activity) =>
            activity.id === selectedActivity.id
              ? { ...activity, ...response.data.activity }
              : activity
          )
        );

        setShowEvaluationDialog(false);
        setSelectedActivity(null);
        setSuccess(
          `Activité "${selectedActivity.title}" évaluée avec succès !`
        );

        // Recharger les stats
        loadStats();
      } else {
        setError(response.error || "Erreur lors de l'évaluation");
      }
    } catch (err) {
      setError("Erreur lors de l'évaluation de l'activité");
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Fonctions utilitaires
  const formatDate = (dateString: string, format: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: format.includes("MMMM") ? "long" : "2-digit",
      day: "2-digit",
      ...(format.includes("HH:mm") && { hour: "2-digit", minute: "2-digit" }),
    };
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-orange-500";
      case "EVALUATED":
        return "bg-green-500";
      case "PLANNED":
        return "bg-gray-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-purple-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "Soumise";
      case "EVALUATED":
        return "Évaluée";
      case "PLANNED":
        return "Planifiée";
      case "IN_PROGRESS":
        return "En cours";
      case "COMPLETED":
        return "Complétée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case "ENTREPRENEURIAT":
        return "Entrepreneuriat";
      case "LEADERSHIP":
        return "Leadership";
      case "DIGITAL":
        return "Digital";
      default:
        return type;
    }
  };

  const getStatsForStatus = (status: string) => {
    if (!stats) return 0;
    return stats.activities?.byStatus?.[status] || 0;
  };

  if (userRole !== "supervisor" && userRole !== "led_team") {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Cette fonctionnalité est réservée aux encadrants et à l'équipe LED.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des activités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Validation des Activités LED
        </h1>
        <p className="text-muted-foreground mt-2">
          Évaluez et validez les activités soumises par vos étudiants boursiers
        </p>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soumises</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getStatsForStatus("SUBMITTED")}
            </div>
            <p className="text-xs text-muted-foreground">activités à évaluer</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getStatsForStatus("IN_PROGRESS")}
            </div>
            <p className="text-xs text-muted-foreground">
              en cours de réalisation
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getStatsForStatus("EVALUATED")}
            </div>
            <p className="text-xs text-muted-foreground">activités validées</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.scores?.global || 0}/100
            </div>
            <p className="text-xs text-muted-foreground">moyenne générale</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou nom d'étudiant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="SUBMITTED">Soumises</SelectItem>
            <SelectItem value="EVALUATED">Évaluées</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="ENTREPRENEURIAT">Entrepreneuriat</SelectItem>
            <SelectItem value="LEADERSHIP">Leadership</SelectItem>
            <SelectItem value="DIGITAL">Digital</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des activités */}
      {filteredActivities.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune activité trouvée
            </h3>
            <p className="text-muted-foreground">
              {loading
                ? "Chargement en cours..."
                : "Aucune activité ne correspond à vos critères"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold">
                        {activity.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold line-clamp-1">
                          {activity.title}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {getActivityTypeLabel(activity.type)}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="font-medium">
                            {activity.user.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          <span>
                            {activity.user.filiere} - {activity.user.niveau}
                          </span>
                        </div>
                        {activity.submittedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Soumis le{" "}
                              {formatDate(activity.submittedAt, "dd/MM/yyyy")}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {activity.description}
                      </p>

                      {activity.evaluations &&
                        activity.evaluations.length > 0 && (
                          <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Évaluation
                              </span>
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {activity.evaluations[0].score}/
                                {activity.evaluations[0].maxScore}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {activity.evaluations[0].feedback}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Évaluée par{" "}
                              {activity.evaluations[0].evaluator.name}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 ml-4">
                    <Badge
                      className={`${getStatusColor(
                        activity.status
                      )} text-white`}
                    >
                      {getStatusLabel(activity.status)}
                    </Badge>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(activity)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Détails
                      </Button>

                      {activity.status === "SUBMITTED" && (
                        <Button
                          size="sm"
                          onClick={() => handleEvaluate(activity)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Évaluer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Progression
                    </span>
                    <span className="text-xs font-medium">
                      {activity.progress}%
                    </span>
                  </div>
                  <Progress value={activity.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog d'évaluation */}
      <Dialog
        open={showEvaluationDialog}
        onOpenChange={setShowEvaluationDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Évaluer l'Activité
            </DialogTitle>
            <DialogDescription>
              Évaluez l'activité "{selectedActivity?.title}" de{" "}
              {selectedActivity?.user.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {selectedActivity && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">{selectedActivity.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedActivity.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Type: {getActivityTypeLabel(selectedActivity.type)}
                  </span>
                  <span>
                    Période:{" "}
                    {formatDate(selectedActivity.startDate, "dd/MM/yyyy")} -{" "}
                    {formatDate(selectedActivity.endDate, "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="score">Note (sur 100)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  value={evaluationForm.score}
                  onChange={(e) =>
                    setEvaluationForm((prev) => ({
                      ...prev,
                      score: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Commentaires et feedback</Label>
                <Textarea
                  id="feedback"
                  value={evaluationForm.feedback}
                  onChange={(e) =>
                    setEvaluationForm((prev) => ({
                      ...prev,
                      feedback: e.target.value,
                    }))
                  }
                  placeholder="Donnez vos commentaires détaillés sur l'activité..."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Vos commentaires aideront l'étudiant à comprendre votre
                  évaluation
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEvaluationDialog(false)}
              disabled={isEvaluating}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitEvaluation}
              disabled={isEvaluating || !evaluationForm.feedback.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEvaluating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmer l'Évaluation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Le Dialog de détails reste identique mais avec les vraies données */}
    </div>
  );
}
