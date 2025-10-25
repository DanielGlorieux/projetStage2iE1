import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress as ProgressBar } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Award,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Briefcase,
  Lightbulb,
  Monitor,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
  Star,
} from "lucide-react";
import { activityService, Activity } from "../services/activityService";

interface ActivityWithEvaluations extends Activity {
  evaluations?: Array<{
    score: number;
    maxScore: number;
    feedback?: string;
    evaluatedAt?: string;
  }>;
  createdAt?: string;
}

interface ProgressStats {
  totalActivities: number;
  completedActivities: number;
  evaluatedActivities: number;
  averageScore: number;
  scoresByType: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
  activityCounts: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
  statusCounts: {
    planned: number;
    in_progress: number;
    completed: number;
    submitted: number;
    evaluated: number;
  };
  monthlyProgress: Array<{
    month: string;
    activites: number;
    evaluees: number;
  }>;
  timeInvested: number;
}

export function StudentProgress() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [activities, setActivities] = useState<ActivityWithEvaluations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const response = await activityService.getActivities();

      if (response.success && response.data) {
        const activitiesData: ActivityWithEvaluations[] = response.data;
        setActivities(activitiesData);

        // Calculer les statistiques
        const completed = activitiesData.filter(
          (a) => a.status === "completed" || a.status === "evaluated"
        ).length;

        const evaluated = activitiesData.filter(
          (a) => a.status === "evaluated" && a.evaluations
        ).length;

        // Scores par type
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
        const activityCounts = {
          entrepreneuriat: 0,
          leadership: 0,
          digital: 0,
        };

        let totalScore = 0;
        let scoreCount = 0;
        let totalTime = 0;

        activitiesData.forEach((activity) => {
          const type = activity.type as keyof typeof activityCounts;
          activityCounts[type]++;

          if (activity.actualHours) {
            totalTime += activity.actualHours;
          }

          if (activity.evaluations && activity.evaluations.length > 0) {
            const evaluation = activity.evaluations[0];
            const score = (evaluation.score / evaluation.maxScore) * 100;
            
            if (scoresByType.hasOwnProperty(type)) {
              scoresByType[type] += score;
              countsByType[type]++;
              totalScore += score;
              scoreCount++;
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

        const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

        // Compter par statut
        const statusCounts = {
          planned: activitiesData.filter((a) => a.status === "planned").length,
          in_progress: activitiesData.filter((a) => a.status === "in_progress")
            .length,
          completed: activitiesData.filter((a) => a.status === "completed")
            .length,
          submitted: activitiesData.filter((a) => a.status === "submitted")
            .length,
          evaluated: activitiesData.filter((a) => a.status === "evaluated")
            .length,
        };

        // Progression mensuelle (6 derniers mois)
        const monthlyProgress = calculateMonthlyProgress(activitiesData);

        setStats({
          totalActivities: activitiesData.length,
          completedActivities: completed,
          evaluatedActivities: evaluated,
          averageScore,
          scoresByType,
          activityCounts,
          statusCounts,
          monthlyProgress,
          timeInvested: totalTime,
        });
      }
    } catch (err) {
      console.error("Erreur chargement progression:", err);
      setError("Erreur lors du chargement de vos données");
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyProgress = (
    activities: ActivityWithEvaluations[]
  ): Array<{ month: string; activites: number; evaluees: number }> => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("fr-FR", { month: "short" });

      const monthActivities = activities.filter((a) => {
        const createdDate = a.createdAt ? new Date(a.createdAt) : null;
        if (!createdDate) return false;
        const activityMonthKey = `${createdDate.getFullYear()}-${String(
          createdDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return activityMonthKey === monthKey;
      });

      const evaluatedCount = monthActivities.filter(
        (a) => a.status === "evaluated"
      ).length;

      months.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        activites: monthActivities.length,
        evaluees: evaluatedCount,
      });
    }

    return months;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Chargement de votre progression...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Données pour le graphique radar des compétences
  const radarData = [
    {
      competence: "Entrepreneuriat",
      score: stats.scoresByType.entrepreneuriat,
      fullMark: 100,
    },
    {
      competence: "Leadership",
      score: stats.scoresByType.leadership,
      fullMark: 100,
    },
    {
      competence: "Digital",
      score: stats.scoresByType.digital,
      fullMark: 100,
    },
  ];

  // Données pour le graphique circulaire des types d'activités
  const pieData = [
    {
      name: "Entrepreneuriat",
      value: stats.activityCounts.entrepreneuriat,
      color: "#3b82f6",
    },
    {
      name: "Leadership",
      value: stats.activityCounts.leadership,
      color: "#10b981",
    },
    {
      name: "Digital",
      value: stats.activityCounts.digital,
      color: "#8b5cf6",
    },
  ];

  // Données pour le graphique de statut
  const statusData = [
    { name: "Planifiées", value: stats.statusCounts.planned, color: "#6b7280" },
    {
      name: "En cours",
      value: stats.statusCounts.in_progress,
      color: "#f59e0b",
    },
    {
      name: "Terminées",
      value: stats.statusCounts.completed,
      color: "#3b82f6",
    },
    {
      name: "Soumises",
      value: stats.statusCounts.submitted,
      color: "#8b5cf6",
    },
    {
      name: "Évaluées",
      value: stats.statusCounts.evaluated,
      color: "#10b981",
    },
  ].filter((item) => item.value > 0);

  const completionRate =
    stats.totalActivities > 0
      ? Math.round((stats.completedActivities / stats.totalActivities) * 100)
      : 0;

  const evaluationRate =
    stats.totalActivities > 0
      ? Math.round((stats.evaluatedActivities / stats.totalActivities) * 100)
      : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          Ma Progression LED
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Analysez votre évolution en Leadership, Entrepreneuriat & Digital
        </p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.averageScore}/100
            </div>
            <ProgressBar value={stats.averageScore} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Moyenne de vos évaluations
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Complétion
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completionRate}%
            </div>
            <ProgressBar value={completionRate} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedActivities} sur {stats.totalActivities} activités
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activités Évaluées
            </CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {evaluationRate}%
            </div>
            <ProgressBar value={evaluationRate} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.evaluatedActivities} activités notées
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Temps Investi
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.timeInvested}h
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Heures investies au total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique Radar - Compétences LED */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-500" />
              Compétences LED
            </CardTitle>
            <CardDescription>
              Vos scores moyens par domaine de compétence
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.evaluatedActivities > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="competence"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-center">
                  Aucune activité évaluée pour le moment
                </p>
                <p className="text-sm text-center mt-2">
                  Les scores apparaîtront après vos premières évaluations
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Graphique Circulaire - Répartition par type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-500" />
              Répartition des Activités
            </CardTitle>
            <CardDescription>
              Distribution de vos activités par type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.totalActivities > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <ActivityIcon className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-center">Aucune activité créée</p>
                <p className="text-sm text-center mt-2">
                  Commencez par créer votre première activité
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progression mensuelle et statuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de progression mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Progression Mensuelle
            </CardTitle>
            <CardDescription>
              Nombre d'activités créées et évaluées par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="activites"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Activités créées"
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="evaluees"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Activités évaluées"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique de statut */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              État des Activités
            </CardTitle>
            <CardDescription>
              Statut actuel de vos activités
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.totalActivities > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <BarChart3 className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-center">Aucune donnée disponible</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Détails des scores par compétence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entrepreneuriat
            </CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.scoresByType.entrepreneuriat}/100
            </div>
            <ProgressBar
              value={stats.scoresByType.entrepreneuriat}
              className="h-2 mb-2"
            />
            <p className="text-xs text-muted-foreground">
              {stats.activityCounts.entrepreneuriat} activité(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leadership</CardTitle>
            <Lightbulb className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.scoresByType.leadership}/100
            </div>
            <ProgressBar
              value={stats.scoresByType.leadership}
              className="h-2 mb-2"
            />
            <p className="text-xs text-muted-foreground">
              {stats.activityCounts.leadership} activité(s)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital</CardTitle>
            <Monitor className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.scoresByType.digital}/100
            </div>
            <ProgressBar
              value={stats.scoresByType.digital}
              className="h-2 mb-2"
            />
            <p className="text-xs text-muted-foreground">
              {stats.activityCounts.digital} activité(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Message d'encouragement */}
      {stats.totalActivities > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {completionRate >= 80
                    ? "Excellent travail ! 🎉"
                    : completionRate >= 50
                    ? "Bon progrès ! 💪"
                    : "Continuez vos efforts ! 🚀"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {completionRate >= 80
                    ? "Vous excellez dans votre parcours LED ! Continuez sur cette lancée et n'hésitez pas à explorer de nouveaux défis."
                    : completionRate >= 50
                    ? "Vous êtes sur la bonne voie. N'oubliez pas de soumettre vos activités terminées pour obtenir vos évaluations."
                    : "Chaque activité compte ! Concentrez-vous sur la complétion de vos projets en cours pour améliorer vos compétences LED."}
                </p>
                {stats.statusCounts.in_progress > 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    💡 Vous avez {stats.statusCounts.in_progress} activité(s) en
                    cours. Finalisez-les pour améliorer votre taux de
                    complétion !
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



