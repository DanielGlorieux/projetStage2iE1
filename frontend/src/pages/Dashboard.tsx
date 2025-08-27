import React from "react";
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

      {/* Graphiques étudiants */}
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

      {/* Section activités récentes */}
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

      {/* KPIs Gestionnaires */}
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

      {/* Graphiques gestionnaires */}
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

      {/* Section étudiants à risque */}
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
}
