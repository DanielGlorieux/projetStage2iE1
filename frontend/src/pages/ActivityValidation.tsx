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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
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
import { GradeBadge, GradingScale } from "../components/GradeBadge";

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

      console.log("🔍 loadActivities - Filters:", filters);

      const response = await activityService.getActivities(filters);

      console.log("📥 loadActivities - Response:", response);
      console.log("📊 loadActivities - Data count:", response.data?.length || 0);

      if (response.success && response.data) {
        console.log("✅ Activities received:", response.data.length);
        console.log("📋 Sample activity:", response.data[0]);
        
        // Filtrer les activités pouvant être évaluées
        // On inclut: submitted, evaluated, completed, in_progress
        const evaluableActivities = response.data.filter(
          (activity: ServiceActivity) =>
            activity.status === "submitted" || 
            activity.status === "evaluated" ||
            activity.status === "completed" ||
            activity.status === "in_progress"
        );
        
        console.log("✅ Evaluable activities:", evaluableActivities.length);
        console.log("📋 Filtered activities:", evaluableActivities);
        
        setActivities(evaluableActivities);
      } else {
        console.error("❌ Error in response:", response.error);
        setError("Erreur lors du chargement des activités");
      }
    } catch (err) {
      console.error("❌ Exception in loadActivities:", err);
      setError("Erreur de connexion au serveur");
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

  const handleDownloadDocument = async (documentUrl: string, filename: string) => {
    const result = await activityService.downloadDocument(documentUrl, filename);
    if (!result.success) {
      setError(result.error || "Erreur lors du téléchargement");
      setTimeout(() => setError(""), 5000);
    }
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
          status: "evaluated", // ✅ Minuscule pour Prisma
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
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "submitted":
        return "bg-orange-500";
      case "evaluated":
        return "bg-green-500";
      case "planned":
        return "bg-gray-500";
      case "in_progress":
        return "bg-blue-500";
      case "completed":
        return "bg-purple-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "submitted":
        return "Soumise";
      case "evaluated":
        return "Évaluée";
      case "planned":
        return "Planifiée";
      case "in_progress":
        return "En cours";
      case "completed":
        return "Complétée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    const typeLower = type?.toLowerCase() || "";
    switch (typeLower) {
      case "entrepreneuriat":
        return "Entrepreneuriat";
      case "leadership":
        return "Leadership";
      case "digital":
        return "Digital";
      default:
        return type;
    }
  };

  const getStatsForStatus = (status: string) => {
    if (!stats) return 0;
    // Convertir en minuscules pour correspondre au format de la base
    const statusKey = status.toLowerCase();
    return stats.activities?.byStatus?.[statusKey] || 0;
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
              {getStatsForStatus("submitted")}
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
              {getStatsForStatus("in_progress")}
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
              {getStatsForStatus("evaluated")}
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
            <SelectItem value="submitted">Soumises</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
            <SelectItem value="completed">Complétées</SelectItem>
            <SelectItem value="evaluated">Évaluées</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="entrepreneuriat">Entrepreneuriat</SelectItem>
            <SelectItem value="leadership">Leadership</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
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

                      {/* Indicateur de documents */}
                      {activity.documents && activity.documents.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit mb-3">
                          <FileText className="w-3 h-3" />
                          <span className="font-medium">
                            {activity.documents.length} document{activity.documents.length > 1 ? 's' : ''} joint{activity.documents.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {activity.evaluations &&
                        activity.evaluations.length > 0 && (
                          <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-600" />
                                Évaluation
                              </span>
                              <div className="flex items-center gap-2">
                                <GradeBadge
                                  score={activity.evaluations[0].score}
                                  size="md"
                                />
                              </div>
                            </div>
                            {activity.evaluations[0].feedback && (
                              <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                                {activity.evaluations[0].feedback}
                              </p>
                            )}
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

                      {/* Bouton Évaluer pour les activités évaluables */}
                      {(activity.status === "submitted" || 
                        activity.status === "completed" ||
                        activity.status === "in_progress") && (
                        <Button
                          size="sm"
                          onClick={() => handleEvaluate(activity)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {activity.status === "in_progress" ? "Feedback" : "Évaluer"}
                        </Button>
                      )}
                      
                      {/* Bouton Voir l'évaluation pour les activités évaluées */}
                      {activity.status === "evaluated" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewDetails(activity)}
                          className="bg-green-100 hover:bg-green-200 text-green-800"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          Voir Note
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
              {/* Documents justificatifs */}
              {selectedActivity && 
                selectedActivity.documents && 
                selectedActivity.documents.length > 0 ? (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents Justificatifs ({selectedActivity.documents.length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedActivity.documents.map((docUrl, index) => {
                      const filename = docUrl.split("/").pop() || `document-${index + 1}`;
                      const fileExtension = filename.split('.').pop()?.toLowerCase();
                      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '');
                      const isPdf = fileExtension === 'pdf';
                      const isDoc = ['doc', 'docx'].includes(fileExtension || '');
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded border hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isImage && (
                              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            {isPdf && (
                              <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            {isDoc && (
                              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            {!isImage && !isPdf && !isDoc && (
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-gray-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{filename}</p>
                              <p className="text-xs text-muted-foreground">
                                {fileExtension?.toUpperCase()} • Cliquez pour télécharger
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(docUrl, filename)}
                            className="flex-shrink-0 hover:bg-blue-50"
                          >
                            <Download className="w-4 h-4 text-blue-600" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                    💡 Consultez les documents avant d'évaluer l'activité
                  </p>
                </div>
              ) : selectedActivity && (
                <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <FileText className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">Aucun document justificatif</p>
                      <p className="text-xs">L'étudiant n'a pas encore soumis de documents pour cette activité</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Échelle de notation de référence */}
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-semibold mb-3 text-sm">
                  Échelle de Notation Américaine
                </h4>
                <GradingScale />
              </div>

              {/* Saisie de la note */}
              <div className="space-y-2">
                <Label htmlFor="score">
                  Score Numérique (0-100)
                </Label>
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
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-muted-foreground">
                  Entrez un score de 0 à 100. La note lettre sera calculée
                  automatiquement.
                </p>
              </div>

              {/* Prévisualisation de la note lettre */}
              {evaluationForm.score > 0 && (
                <div className="border-2 border-blue-300 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Note attribuée :
                    </span>
                    <GradeBadge
                      score={evaluationForm.score}
                      showDetails={true}
                      size="lg"
                    />
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-gray-600">
                      Cette note sera visible par l'étudiant et comptera dans
                      son GPA global.
                    </p>
                  </div>
                </div>
              )}

              {/* Commentaires */}
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
                  évaluation et à progresser.
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

      {/* Dialog de détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Détails de l'Activité
            </DialogTitle>
            <DialogDescription>
              Consultez les détails complets de l'activité
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-6">
              {/* Informations de l'étudiant */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold text-lg">
                    {selectedActivity.user.name
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
                      {selectedActivity.user.name}
                    </span>
                    <span>{selectedActivity.user.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{selectedActivity.user.filiere}</span>
                    <span>{selectedActivity.user.niveau}</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {getActivityTypeLabel(selectedActivity.type)}
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

              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description du Projet
                </h4>
                <p className="text-muted-foreground">
                  {selectedActivity.description}
                </p>
              </div>

              {/* Période et progression */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Période de Réalisation
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    Du {formatDate(selectedActivity.startDate, "dd/MM/yyyy")} au{" "}
                    {formatDate(selectedActivity.endDate, "dd/MM/yyyy")}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Progression</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Avancement</span>
                      <span className="font-medium">
                        {selectedActivity.progress}%
                      </span>
                    </div>
                    <Progress value={selectedActivity.progress} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Objectifs */}
              {selectedActivity.objectives &&
                selectedActivity.objectives.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Objectifs
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedActivity.objectives.map((obj, index) => (
                        <li key={index}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Résultats */}
              {selectedActivity.outcomes &&
                selectedActivity.outcomes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Résultats Obtenus
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedActivity.outcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Documents justificatifs */}
              {selectedActivity.documents && 
                selectedActivity.documents.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents Justificatifs ({selectedActivity.documents.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedActivity.documents.map((docUrl, index) => {
                      const filename = docUrl.split("/").pop() || `document-${index + 1}`;
                      const fileExtension = filename.split('.').pop()?.toLowerCase();
                      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '');
                      const isPdf = fileExtension === 'pdf';
                      const isDoc = ['doc', 'docx'].includes(fileExtension || '');
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
                        >
                          {isImage && (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                          )}
                          {isPdf && (
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-200">
                              <FileText className="w-6 h-6 text-red-600" />
                            </div>
                          )}
                          {isDoc && (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                          )}
                          {!isImage && !isPdf && !isDoc && (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200">
                              <FileText className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{filename}</p>
                            <p className="text-xs text-muted-foreground">{fileExtension?.toUpperCase()}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(docUrl, filename)}
                            className="flex-shrink-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Évaluation */}
              {selectedActivity.evaluations &&
                selectedActivity.evaluations.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Évaluation
                    </h4>
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
                      {/* Note principale avec GradeBadge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-lg">Note obtenue</span>
                        <div className="flex items-center gap-3">
                          <Award className="w-6 h-6 text-yellow-500" />
                          <GradeBadge
                            score={selectedActivity.evaluations[0].score}
                            showDetails={true}
                            size="lg"
                          />
                        </div>
                      </div>

                      {/* Score numérique séparé */}
                      <div className="mb-4 p-3 bg-white rounded-md border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Score numérique</span>
                          <span className="text-xl font-bold text-blue-600">
                            {selectedActivity.evaluations[0].score}/100
                          </span>
                        </div>
                      </div>

                      {selectedActivity.evaluations[0].feedback && (
                        <div className="mb-3 p-3 bg-white rounded-md border">
                          <span className="font-medium text-sm mb-2 block text-gray-700">
                            Commentaires du superviseur :
                          </span>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedActivity.evaluations[0].feedback}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Évalué par{" "}
                          {selectedActivity.evaluations[0].evaluator.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Le{" "}
                          {formatDate(
                            selectedActivity.evaluations[0].createdAt,
                            "dd/MM/yyyy HH:mm"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
            >
              Fermer
            </Button>
            {selectedActivity &&
              selectedActivity.status !== "evaluated" &&
              (selectedActivity.status === "submitted" ||
                selectedActivity.status === "completed" ||
                selectedActivity.status === "in_progress") && (
                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    handleEvaluate(selectedActivity);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Évaluer Maintenant
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Le Dialog de détails est maintenant complet */}
    </div>
  );
}

