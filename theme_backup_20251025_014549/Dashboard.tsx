/*import React from "react";
import { UserRole } from "../App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  Target,
  Clock,
  Upload,
  AlertTriangle,
  CheckCircle,
  Star,
  Briefcase,
  Lightbulb,
} from "lucide-react";

interface DashboardProps {
  userRole: UserRole;
}

// Données mockées adaptées au contexte LED
const competencyProgressData = [
  { name: "Jan", entrepreneuriat: 65, leadership: 70, digital: 60 },
  { name: "Fév", entrepreneuriat: 72, leadership: 75, digital: 68 },
  { name: "Mar", entrepreneuriat: 78, leadership: 82, digital: 75 },
  { name: "Avr", entrepreneuriat: 85, leadership: 88, digital: 82 },
  { name: "Mai", entrepreneuriat: 88, leadership: 90, digital: 85 },
  { name: "Jun", entrepreneuriat: 92, leadership: 94, digital: 89 },
];

const activitiesTypeData = [
  { name: "Entrepreneuriat", value: 40, color: "#0088FE" },
  { name: "Leadership", value: 35, color: "#00C49F" },
  { name: "Digital", value: 25, color: "#FFBB28" },
];

const scholarPerformanceData = [
  { filiere: "Informatique", score: 88, count: 45 },
  { filiere: "Génie Civil", score: 85, count: 32 },
  { filiere: "Électronique", score: 90, count: 28 },
  { filiere: "Mécanique", score: 82, count: 38 },
  { filiere: "Architecture", score: 87, count: 25 },
];

const monthlySubmissionsData = [
  { month: "Jan", rapports: 85, retards: 12 },
  { month: "Fév", rapports: 92, retards: 8 },
  { month: "Mar", rapports: 88, retards: 15 },
  { month: "Avr", rapports: 95, retards: 5 },
  { month: "Mai", rapports: 89, retards: 18 },
  { month: "Jun", rapports: 98, retards: 3 },
];

export function Dashboard({ userRole }: DashboardProps) {
  const getStudentDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mon Tableau de Bord LED
        </h1>
        <p className="text-muted-foreground">
          Suivi de mes compétences en entrepreneuriat et leadership digital
        </p>
      </div>

      */ {
  /* KPIs Étudiants */
}
/*
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score Global LED
            </CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">92/100</div>
            <Progress value={92} className="w-full h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              +5 points ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rapports Soumis
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">18/20</div>
            <Progress value={90} className="w-full h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              90% de complétion
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités en Cours
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 mb-1">4</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">
                2 en retard
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prochaine Échéance
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Rapport Entrepreneuriat</div>
            <p className="text-xs text-red-600 font-medium">Dans 3 jours</p>
            <Badge variant="outline" className="text-xs mt-1">
              Priorité haute
            </Badge>
          </CardContent>
        </Card>
      </div>

      */ {
  /* Graphiques étudiants */
}
/*
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Évolution de mes Compétences LED
            </CardTitle>
            <CardDescription>
              Progression mensuelle par domaine de compétence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={competencyProgressData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200"
                />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="entrepreneuriat"
                  stroke="#0088FE"
                  strokeWidth={3}
                  name="Entrepreneuriat"
                />
                <Line
                  type="monotone"
                  dataKey="leadership"
                  stroke="#00C49F"
                  strokeWidth={3}
                  name="Leadership"
                />
                <Line
                  type="monotone"
                  dataKey="digital"
                  stroke="#FFBB28"
                  strokeWidth={3}
                  name="Digital"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Répartition de mes Activités
            </CardTitle>
            <CardDescription>
              Distribution par domaine de compétence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activitiesTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {activitiesTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      */ {
  /* Section activités récentes */
}
/*
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Mes Activités Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium">
                    Projet d'Innovation Technologique
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Entrepreneuriat • Échéance: 25/08/2025
                  </p>
                </div>
              </div>
              <Badge variant="default">En cours</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium">Formation Leadership Digital</p>
                  <p className="text-sm text-muted-foreground">
                    Leadership • Soumis le 15/08/2025
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">
                Complété
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getTeamDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de Bord LED - Gestion
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des boursiers et suivi des compétences LED
        </p>
      </div>

      */ {
  /* KPIs Gestionnaires */
}
/*
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Boursiers LED Actifs
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">168</div>
            <p className="text-xs text-green-600 font-medium">
              +15 ce semestre
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Réussite Global
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89%</div>
            <p className="text-xs text-green-600 font-medium">
              +3% vs période précédente
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rapports en Attente
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">28</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="destructive" className="text-xs">
                12 en retard
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertes Académiques
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">7</div>
            <p className="text-xs text-muted-foreground">
              Étudiants nécessitant un suivi
            </p>
          </CardContent>
        </Card>
      </div>

      */ {
  /* Graphiques gestionnaires */
}
/*
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              Performance par Filière
            </CardTitle>
            <CardDescription>
              Score moyen LED par filière d'études
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scholarPerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="filiere" type="category" width={100} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "score" ? `${value}/100` : value,
                    name === "score" ? "Score moyen" : "Nombre d'étudiants",
                  ]}
                />
                <Bar dataKey="score" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-500" />
              Suivi des Soumissions Mensuelles
            </CardTitle>
            <CardDescription>Rapports soumis vs retards</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlySubmissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="rapports"
                  stackId="1"
                  stroke="#00C49F"
                  fill="#00C49F"
                  fillOpacity={0.6}
                  name="Rapports soumis"
                />
                <Area
                  type="monotone"
                  dataKey="retards"
                  stackId="2"
                  stroke="#FF6B6B"
                  fill="#FF6B6B"
                  fillOpacity={0.6}
                  name="Retards"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      */ {
  /* Section étudiants à risque */
} /*
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Étudiants Nécessitant un Suivi Particulier
          </CardTitle>
          <CardDescription>
            Boursiers avec des difficultés ou retards significatifs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium">KONE Aminata</p>
                  <p className="text-sm text-muted-foreground">
                    Génie Civil • 3 rapports en retard
                  </p>
                </div>
              </div>
              <Badge variant="destructive">Critique</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium">OUEDRAOGO Boureima</p>
                  <p className="text-sm text-muted-foreground">
                    Informatique • Score LED faible (65/100)
                  </p>
                </div>
              </div>
              <Badge variant="secondary">À surveiller</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (userRole === "student") {
    return getStudentDashboard();
  }
  return getTeamDashboard();
}*/

/*import React, { useState, useEffect } from "react";
import { UserRole } from "../App";
import { activityService } from "../services/activityService";
import { userService } from "../services/users";
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

interface DashboardProps {
  userRole: UserRole;
}

interface DashboardStats {
  students?: {
    total: number;
    withActivities: number;
    activeRate: number;
  };
  activities?: {
    total: number;
    byStatus: Record<string, number | undefined>;
    byType: Record<string, number | undefined>;
  };
  scores?: {
    averages: Record<string, number>;
    global: number;
  };
  recent?: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    user: string;
  }>;
}

interface UserStats {
  activitesTotal: number;
  activitesCompletes: number;
  scoresMoyens: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
}

export function Dashboard({ userRole }: DashboardProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [userRole]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      if (userRole === "student") {
        // Données pour étudiant
        const [activitiesResponse, profileResponse] = await Promise.all([
          activityService.getActivities(),
          userService.getProfile(),
        ]);

        if (activitiesResponse.success) {
          setRecentActivities(activitiesResponse.data.slice(0, 5));

          // Calculer les stats utilisateur
          const activities = activitiesResponse.data;
          const completed = activities.filter(
            (a: any) => a.status === "COMPLETED" || a.status === "EVALUATED"
          ).length;

          const scoresByType = {
            entrepreneuriat: 0,
            leadership: 0,
            digital: 0,
          };
          const countsByType = {
            entrepreneuriat: 0,
            leadership: 0,
            digital: 0,
          };

          activities.forEach((activity: any) => {
            if (activity.evaluations && activity.evaluations.length > 0) {
              const type = activity.type.toLowerCase();
              if (scoresByType.hasOwnProperty(type)) {
                scoresByType[type] += activity.evaluations[0].score;
                countsByType[type]++;
              }
            }
          });

          // Calculer les moyennes
          Object.keys(scoresByType).forEach((type) => {
            if (countsByType[type] > 0) {
              scoresByType[type] = Math.round(
                scoresByType[type] / countsByType[type]
              );
            }
          });

          setUserStats({
            activitesTotal: activities.length,
            activitesCompletes: completed,
            scoresMoyens: scoresByType,
          });
        }
      } else {
        // Données pour superviseurs/équipe LED
        const [statsResponse, activitiesResponse] = await Promise.all([
          searchService.getStats(),
          activityService.getActivities(),
        ]);

        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }

        if (activitiesResponse.success) {
          setRecentActivities(activitiesResponse.data.slice(0, 5));
        }
      }
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600";
      case "IN_PROGRESS":
        return "text-blue-600";
      case "SUBMITTED":
        return "text-orange-600";
      case "EVALUATED":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "Planifiée";
      case "IN_PROGRESS":
        return "En cours";
      case "COMPLETED":
        return "Complétée";
      case "SUBMITTED":
        return "Soumise";
      case "EVALUATED":
        return "Évaluée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStudentDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mon Tableau de Bord LED
        </h1>
        <p className="text-muted-foreground">
          Suivi de mes compétences en entrepreneuriat et leadership digital
        </p>
      </div>

      /*{/* KPIs Étudiants */ /*}*/ /*
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score Global LED
            </CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {userStats
                ? Math.round(
                    (userStats.scoresMoyens.entrepreneuriat +
                      userStats.scoresMoyens.leadership +
                      userStats.scoresMoyens.digital) /
                      3
                  )
                : 0}
              /100
            </div>
            <Progress
              value={
                userStats
                  ? Math.round(
                      (userStats.scoresMoyens.entrepreneuriat +
                        userStats.scoresMoyens.leadership +
                        userStats.scoresMoyens.digital) /
                        3
                    )
                  : 0
              }
              className="w-full h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Moyenne de vos compétences
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités Complètes
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userStats?.activitesCompletes || 0}/
              {userStats?.activitesTotal || 0}
            </div>
            <Progress
              value={
                userStats
                  ? (userStats.activitesCompletes / userStats.activitesTotal) *
                    100
                  : 0
              }
              className="w-full h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {userStats
                ? Math.round(
                    (userStats.activitesCompletes / userStats.activitesTotal) *
                      100
                  )
                : 0}
              % de complétion
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entrepreneuriat
            </CardTitle>
            <Briefcase className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {userStats?.scoresMoyens.entrepreneuriat || 0}/100
            </div>
            <Progress
              value={userStats?.scoresMoyens.entrepreneuriat || 0}
              className="w-full h-2"
            />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leadership</CardTitle>
            <Lightbulb className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {userStats?.scoresMoyens.leadership || 0}/100
            </div>
            <Progress
              value={userStats?.scoresMoyens.leadership || 0}
              className="w-full h-2"
            />
          </CardContent>
        </Card>
      </div>

      */ {
  /* Activités récentes */
}
/*
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Mes Activités Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTypeLabel(activity.type)} • Créée le{" "}
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {getStatusLabel(activity.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getTeamDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de Bord LED - Gestion
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des boursiers et suivi des compétences LED
        </p>
      </div>

      */ {
  /* KPIs Gestionnaires */
}
/*
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Étudiants Actifs
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats.students?.withActivities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              sur {dashboardStats.students?.total || 0} inscrits
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score Moyen Global
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardStats.scores?.global || 0}/100
            </div>
            <p className="text-xs text-muted-foreground">
              moyenne des compétences
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités Soumises
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardStats.activities?.byStatus?.SUBMITTED || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              en attente d'évaluation
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Activités
            </CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardStats.activities?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">activités créées</p>
          </CardContent>
        </Card>
      </div>

      */ {
  /* Activités récentes globales */
} /*
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Activités Récentes de la Plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.user?.name || "Utilisateur"} •{" "}
                        {getTypeLabel(activity.type)} •{" "}
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {getStatusLabel(activity.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (userRole === "student") {
    return getStudentDashboard();
  }
  return getTeamDashboard();
}*/

/*-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/

/*import React, { useState, useEffect } from "react";
import { UserRole } from "../App";
import { activityService } from "../services/activityService";
import { userService } from "../services/users";
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
  Users,
  Target,
  BookOpen,
} from "lucide-react";

interface DashboardProps {
  userRole: UserRole;
}

// Define Activity interface
interface Activity {
  id: string;
  title: string;
  type: string;
  status: string;
  user?: {
    id: string;
    name: string;
  };
  evaluations?: Array<{
    score: number;
  }>;
}

interface DashboardStats {
  students?: {
    total: number;
    withActivities: number;
    activeRate: number;
  };
  activities?: {
    total: number;
    byStatus: Record<string, number | undefined>;
    byType: Record<string, number | undefined>;
  };
  scores?: {
    averages: Record<string, number>;
    global: number;
  };
  recent?: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    user: string;
  }>;
}

interface UserStats {
  activitesTotal: number;
  activitesCompletes: number;
  scoresMoyens: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
}

export function Dashboard({ userRole }: DashboardProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [userRole]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      if (userRole === "student") {
        // Données pour étudiant
        const [activitiesResponse, profileResponse] = await Promise.all([
          activityService.getActivities(),
          userService.getProfile(),
        ]);

        if (activitiesResponse.success && activitiesResponse.data) {
          setRecentActivities(activitiesResponse.data.slice(0, 5));

          // Calculer les stats utilisateur
          const activities: Activity[] = activitiesResponse.data;
          const completed = activities.filter(
            (a: Activity) =>
              a.status === "COMPLETED" || a.status === "EVALUATED"
          ).length;

          const scoresByType = {
            entrepreneuriat: 0,
            leadership: 0,
            digital: 0,
          };
          const countsByType = {
            entrepreneuriat: 0,
            leadership: 0,
            digital: 0,
          };

          activities.forEach((activity: Activity) => {
            if (activity.evaluations && activity.evaluations.length > 0) {
              const type =
                activity.type.toLowerCase() as keyof typeof scoresByType;
              if (scoresByType.hasOwnProperty(type)) {
                scoresByType[type] += activity.evaluations[0].score;
                countsByType[type]++;
              }
            }
          });

          // Calculer les moyennes
          Object.keys(scoresByType).forEach((type) => {
            const typedKey = type as keyof typeof scoresByType;
            if (countsByType[typedKey] > 0) {
              scoresByType[typedKey] = Math.round(
                scoresByType[typedKey] / countsByType[typedKey]
              );
            }
          });

          setUserStats({
            activitesTotal: activities.length,
            activitesCompletes: completed,
            scoresMoyens: scoresByType,
          });
        }
      } else {
        // Données pour superviseurs/équipe LED
        const [statsResponse, activitiesResponse] = await Promise.all([
          searchService.getStats(),
          activityService.getActivities(),
        ]);

        if (statsResponse.success) {
          setDashboardStats(statsResponse.data || {});
        }

        if (activitiesResponse.success && activitiesResponse.data) {
          setRecentActivities(activitiesResponse.data.slice(0, 5));
        }
      }
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600";
      case "IN_PROGRESS":
        return "text-blue-600";
      case "SUBMITTED":
        return "text-orange-600";
      case "EVALUATED":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PLANNED":
        return "Planifiée";
      case "IN_PROGRESS":
        return "En cours";
      case "COMPLETED":
        return "Complétée";
      case "SUBMITTED":
        return "Soumise";
      case "EVALUATED":
        return "Évaluée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStudentDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mon Tableau de Bord LED
        </h1>
        <p className="text-muted-foreground">
          Suivi de mes compétences en entrepreneuriat et leadership digital
        </p>
      </div>*/

{
  /* KPIs Étudiants */
} /*
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score Global LED
            </CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {userStats
                ? Math.round(
                    (userStats.scoresMoyens.entrepreneuriat +
                      userStats.scoresMoyens.leadership +
                      userStats.scoresMoyens.digital) /
                      3
                  )
                : 0}
              /100
            </div>
            <Progress
              value={
                userStats
                  ? Math.round(
                      (userStats.scoresMoyens.entrepreneuriat +
                        userStats.scoresMoyens.leadership +
                        userStats.scoresMoyens.digital) /
                        3
                    )
                  : 0
              }
              className="w-full h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Moyenne de vos compétences
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités Complètes
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userStats?.activitesCompletes || 0}/
              {userStats?.activitesTotal || 0}
            </div>
            <Progress
              value={
                userStats && userStats.activitesTotal > 0
                  ? (userStats.activitesCompletes / userStats.activitesTotal) *
                    100
                  : 0
              }
              className="w-full h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {userStats && userStats.activitesTotal > 0
                ? Math.round(
                    (userStats.activitesCompletes / userStats.activitesTotal) *
                      100
                  )
                : 0}
              % de complétion
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entrepreneuriat
            </CardTitle>
            <Briefcase className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {userStats?.scoresMoyens.entrepreneuriat || 0}/100
            </div>
            <Progress
              value={userStats?.scoresMoyens.entrepreneuriat || 0}
              className="w-full h-2"
            />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leadership</CardTitle>
            <Lightbulb className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {userStats?.scoresMoyens.leadership || 0}/100
            </div>
            <Progress
              value={userStats?.scoresMoyens.leadership || 0}
              className="w-full h-2"
            />
          </CardContent>
        </Card>
      </div>*/

{
  /* Activités récentes */
} /*
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Mes Activités Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: Activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTypeLabel(activity.type)} • Créée le{" "}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {getStatusLabel(activity.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getTeamDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de Bord LED - Gestion
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des boursiers et suivi des compétences LED
        </p>
      </div>*/

{
  /* KPIs Gestionnaires */
} /*
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Étudiants Actifs
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats.students?.withActivities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              sur {dashboardStats.students?.total || 0} inscrits
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score Moyen Global
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardStats.scores?.global || 0}/100
            </div>
            <p className="text-xs text-muted-foreground">
              moyenne des compétences
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités Soumises
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardStats.activities?.byStatus?.SUBMITTED || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              en attente d'évaluation
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Activités
            </CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardStats.activities?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">activités créées</p>
          </CardContent>
        </Card>
      </div>*/

{
  /* Activités récentes globales */
} /*
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Activités Récentes de la Plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: Activity) => {
                // Cast to Activity for user property access
                const dashboardActivity = activity;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {dashboardActivity.user?.name || "Utilisateur"} •{" "}
                          {getTypeLabel(activity.type)} •{" "}*/
{
  /*{formatDate(activity.startDate)}*/
} /*
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {getStatusLabel(activity.status)}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (userRole === "student") {
    return getStudentDashboard();
  }
  return getTeamDashboard();
}*/



import React, { useState, useEffect } from "react";
import { UserRole } from "../App";
import { activityService, Activity } from "../services/activityService";

interface ActivityWithEvaluations extends Activity {
  evaluations?: Array<{
    score: number;
    [key: string]: any;
  }>;
  createdAt?: string;
}
import { userService } from "../services/users";
import { searchService } from "../services/searchService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  Target,
  Clock,
  Upload,
  AlertTriangle,
  CheckCircle,
  Star,
  Briefcase,
  Lightbulb,
} from "lucide-react";

interface DashboardProps {
  userRole: UserRole;
}

interface DashboardStats {
  students?: {
    total: number;
    withActivities: number;
    activeRate: number;
  };
  activities?: {
    total: number;
    byStatus: Record<string, number | undefined>;
    byType: Record<string, number | undefined>;
  };
  scores?: {
    averages: Record<string, number>;
    global: number;
  };
  recent?: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    user: string;
  }>;
}

interface UserStats {
  activitesTotal: number;
  activitesCompletes: number;
  scoresMoyens: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
}

export function Dashboard({ userRole }: DashboardProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<
    ActivityWithEvaluations[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [userRole]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      if (userRole === "student") {
        // Données pour étudiant
        const [activitiesResponse] = await Promise.all([
          activityService.getActivities(),
        ]);

        if (activitiesResponse.success && activitiesResponse.data) {
          // Calculer les stats utilisateur
          const activities: ActivityWithEvaluations[] = activitiesResponse.data;
          const completed = activities.filter(
            (a: ActivityWithEvaluations) =>
              a.status === "completed" || a.status === "evaluated"
          ).length;

          const scoresByType = {
            entrepreneuriat: 0,
            leadership: 0,
            digital: 0,
          };

          const countsByType = {
            entrepreneuriat: 0,
            leadership: 0,
            digital: 0,
          };

          activities.forEach((activity: ActivityWithEvaluations) => {
            if (activity.evaluations && activity.evaluations.length > 0) {
              const type =
                activity.type.toLowerCase() as keyof typeof scoresByType;
              if (scoresByType.hasOwnProperty(type)) {
                scoresByType[type] += activity.evaluations[0].score;
                countsByType[type]++;
              }
            }
          });

          // Calculer les moyennes
          Object.keys(scoresByType).forEach((type) => {
            const typedKey = type as keyof typeof scoresByType;
            if (countsByType[typedKey] > 0) {
              scoresByType[typedKey] = Math.round(
                scoresByType[typedKey] / countsByType[typedKey]
              );
            }
          });

          setUserStats({
            activitesTotal: activities.length,
            activitesCompletes: completed,
            scoresMoyens: scoresByType,
          });

          setRecentActivities(activities.slice(0, 5));
        }
      } else {
        // Données pour superviseurs/équipe LED
        const [statsResponse, activitiesResponse] = await Promise.all([
          searchService.getStats(),
          activityService.getActivities(),
        ]);

        if (statsResponse.success) {
          setDashboardStats(statsResponse.data || {});
        }

        if (activitiesResponse.success && activitiesResponse.data) {
          setRecentActivities(activitiesResponse.data.slice(0, 5));
        }
      }
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "evaluated":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "planned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "evaluated":
        return "Évalué";
      case "in_progress":
        return "En cours";
      case "submitted":
        return "Soumis";
      case "planned":
        return "Planifié";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const getStudentDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mon Tableau de Bord LED
        </h1>
        <p className="text-muted-foreground">
          Suivi de mes compétences en entrepreneuriat et leadership digital
        </p>
      </div>

      {/* KPIs Étudiants */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score Global LED
            </CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {userStats
                ? Math.round(
                    (userStats.scoresMoyens.entrepreneuriat +
                      userStats.scoresMoyens.leadership +
                      userStats.scoresMoyens.digital) /
                      3
                  )
                : 0}
              /100
            </div>
            <Progress
              value={
                userStats
                  ? Math.round(
                      (userStats.scoresMoyens.entrepreneuriat +
                        userStats.scoresMoyens.leadership +
                        userStats.scoresMoyens.digital) /
                        3
                    )
                  : 0
              }
              className="w-full h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Moyenne de vos compétences
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités Complètes
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userStats?.activitesCompletes || 0}/
              {userStats?.activitesTotal || 0}
            </div>
            <Progress
              value={
                userStats && userStats.activitesTotal > 0
                  ? (userStats.activitesCompletes / userStats.activitesTotal) *
                    100
                  : 0
              }
              className="w-full h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {userStats && userStats.activitesTotal > 0
                ? Math.round(
                    (userStats.activitesCompletes / userStats.activitesTotal) *
                      100
                  )
                : 0}
              % de complétion
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entrepreneuriat
            </CardTitle>
            <Briefcase className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {userStats?.scoresMoyens.entrepreneuriat || 0}/100
            </div>
            <Progress
              value={userStats?.scoresMoyens.entrepreneuriat || 0}
              className="w-full h-2"
            />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leadership</CardTitle>
            <Lightbulb className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {userStats?.scoresMoyens.leadership || 0}/100
            </div>
            <Progress
              value={userStats?.scoresMoyens.leadership || 0}
              className="w-full h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Mes Activités Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: ActivityWithEvaluations) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {getTypeLabel(activity.type)} • Créée le{" "}
                        {activity.createdAt
                          ? formatDate(activity.createdAt)
                          : "Date inconnue"}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {getStatusLabel(activity.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getTeamDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de Bord LED - Gestion
        </h1>
        <p className="text-muted-foreground">
          Vue d'ensemble des boursiers et suivi des compétences LED
        </p>
      </div>

      {/* KPIs Gestionnaires */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Étudiants Actifs
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats.students?.withActivities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              sur {dashboardStats.students?.total || 0} inscrits
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score Moyen Global
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dashboardStats.scores?.global || 0}/100
            </div>
            <p className="text-xs text-muted-foreground">
              moyenne des compétences
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités Soumises
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardStats.activities?.byStatus?.submitted || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              en attente d'évaluation
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Activités
            </CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardStats.activities?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">activités créées</p>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes globales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Activités Récentes de la Plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.user?.name || "Utilisateur"} •{" "}
                        {getTypeLabel(activity.type)} •{" "}
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {getStatusLabel(activity.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (userRole === "student") {
    return getStudentDashboard();
  }
  return getTeamDashboard();
}
