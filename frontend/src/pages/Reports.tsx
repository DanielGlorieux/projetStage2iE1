/*import React, { useState } from "react";
import { UserRole } from "../App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
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
} from "recharts";
import {
  Download,
  FileText,
  BarChart3,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReportsProps {
  userRole: UserRole;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: "performance" | "activities" | "progress" | "summary";
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annual";
  lastGenerated: string;
  recipients: string[];
}

// Templates de rapports mockés
const reportTemplates: ReportTemplate[] = [
  {
    id: "1",
    name: "Rapport mensuel de performance",
    description: "Performance globale de tous les boursiers sur le mois",
    type: "performance",
    frequency: "monthly",
    lastGenerated: "2024-08-01",
    recipients: ["direction@led.org", "coordinateurs@led.org"],
  },
  {
    id: "2",
    name: "Suivi hebdomadaire des activités",
    description: "État d'avancement des activités en cours",
    type: "activities",
    frequency: "weekly",
    lastGenerated: "2024-08-12",
    recipients: ["superviseurs@led.org"],
  },
  {
    id: "3",
    name: "Bilan trimestriel",
    description: "Analyse complète des progrès sur 3 mois",
    type: "summary",
    frequency: "quarterly",
    lastGenerated: "2024-07-01",
    recipients: ["partenaires@led.org", "direction@led.org"],
  },
];

// Données mockées pour les graphiques
const performanceData = [
  { month: "Jan", moyenne: 82, médiane: 85 },
  { month: "Fév", moyenne: 85, médiane: 87 },
  { month: "Mar", moyenne: 87, médiane: 89 },
  { month: "Avr", moyenne: 86, médiane: 88 },
  { month: "Mai", moyenne: 89, médiane: 91 },
  { month: "Jun", moyenne: 91, médiane: 93 },
];

const activitiesDistribution = [
  { name: "Académique", value: 45, color: "#0088FE" },
  { name: "Parascolaire", value: 30, color: "#00C49F" },
  { name: "Professionnel", value: 25, color: "#FFBB28" },
];

const progressData = [
  { period: "T1", completion: 78 },
  { period: "T2", completion: 85 },
  { period: "T3", completion: 82 },
  { period: "T4", completion: 91 },
];

export function Reports({ userRole }: ReportsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [generatingReport, setGeneratingReport] = useState(false);

  const generateReport = async (
    templateId: string,
    fileFormat: "pdf" | "csv" | "excel"
  ) => {
    setGeneratingReport(true);

    // Simulation de génération
    setTimeout(() => {
      const template = reportTemplates.find((t) => t.id === templateId);
      const fileName = `${template?.name}_${format(
        new Date(),
        "yyyy-MM-dd"
      )}.${fileFormat}`;

      // Simulation du téléchargement
      console.log(`Génération du rapport: ${fileName}`);
      setGeneratingReport(false);
    }, 2000);
  };

  const scheduleReport = (templateId: string) => {
    console.log(`Planification automatique du rapport: ${templateId}`);
  };

  const getFrequencyLabel = (frequency: ReportTemplate["frequency"]) => {
    switch (frequency) {
      case "daily":
        return "Quotidien";
      case "weekly":
        return "Hebdomadaire";
      case "monthly":
        return "Mensuel";
      case "quarterly":
        return "Trimestriel";
      case "annual":
        return "Annuel";
      default:
        return frequency;
    }
  };

  const getTypeIcon = (type: ReportTemplate["type"]) => {
    switch (type) {
      case "performance":
        return <TrendingUp className="w-4 h-4" />;
      case "activities":
        return <BookOpen className="w-4 h-4" />;
      case "progress":
        return <BarChart3 className="w-4 h-4" />;
      case "summary":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Rapports et analyses</h1>
          <p className="text-muted-foreground">
            Génération automatique de rapports et analyses décisionnelles
          </p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Nouveau rapport
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Modèles de rapport</TabsTrigger>
          <TabsTrigger value="analytics">Analyses en temps réel</TabsTrigger>
          <TabsTrigger value="scheduled">Rapports planifiés</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {getTypeIcon(template.type)}
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fréquence:</span>
                    <Badge variant="outline">
                      {getFrequencyLabel(template.frequency)}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      Dernière génération:
                    </span>
                    <br />
                    {format(new Date(template.lastGenerated), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">Générer en:</div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateReport(template.id, "pdf")}
                        disabled={generatingReport}
                      >
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateReport(template.id, "csv")}
                        disabled={generatingReport}
                      >
                        CSV
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateReport(template.id, "excel")}
                        disabled={generatingReport}
                      >
                        Excel
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => scheduleReport(template.id)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Planifier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Boursiers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">247</div>
                <p className="text-xs text-muted-foreground">+12 ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Score Moyen</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">87.2</div>
                <p className="text-xs text-green-600">+2.1 vs mois dernier</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Activités Actives</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">156</div>
                <p className="text-xs text-muted-foreground">23 en retard</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Taux de Réussite</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">92%</div>
                <p className="text-xs text-green-600">+5% vs trimestre</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des performances</CardTitle>
                <CardDescription>
                  Scores moyens et médians par mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="moyenne"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Moyenne"
                    />
                    <Line
                      type="monotone"
                      dataKey="médiane"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Médiane"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des activités</CardTitle>
                <CardDescription>
                  Répartition par type d'activité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activitiesDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {activitiesDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progression trimestrielle</CardTitle>
              <CardDescription>
                Taux de complétion des objectifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completion" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rapports automatisés</CardTitle>
              <CardDescription>
                Gérez vos rapports récurrents et leurs destinataires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        <span>{template.name}</span>
                        <Badge variant="secondary">
                          {getFrequencyLabel(template.frequency)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {template.recipients.length} destinataire(s)
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {generatingReport && (
        <div className="fixed bottom-4 right-4 bg-card p-4 rounded-lg shadow-lg border">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Génération du rapport en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
}*/

import React, { useState } from "react";
import { UserRole } from "../App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Target,
  Award,
  Filter,
  RefreshCw,
  Eye,
} from "lucide-react";

interface ReportsProps {
  userRole: UserRole;
}

// Données de démonstration
const competencyEvolutionData = [
  { month: "Sept", entrepreneuriat: 68, leadership: 72, digital: 65 },
  { month: "Oct", entrepreneuriat: 75, leadership: 78, digital: 72 },
  { month: "Nov", entrepreneuriat: 82, leadership: 85, digital: 78 },
  { month: "Déc", entrepreneuriat: 88, leadership: 90, digital: 85 },
  { month: "Jan", entrepreneuriat: 92, leadership: 92, digital: 88 },
];

const submissionsByFieldData = [
  { filiere: "Informatique", soumis: 42, enAttente: 8, enRetard: 3 },
  { filiere: "Génie Civil", soumis: 38, enAttente: 6, enRetard: 2 },
  { filiere: "Électronique", soumis: 28, enAttente: 4, enRetard: 1 },
];

const activitiesDistributionData = [
  { name: "Entrepreneuriat", value: 45, color: "#0088FE" },
  { name: "Leadership", value: 35, color: "#00C49F" },
  { name: "Digital", value: 30, color: "#FFBB28" },
];

export function Reports({ userRole }: ReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("semestre_actuel");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportReport = async (format: string, type: string) => {
    setIsGenerating(true);
    // Simulation de génération de rapport
    setTimeout(() => {
      console.log(`Génération du rapport ${type} en format ${format}`);
      setIsGenerating(false);
    }, 2000);
  };

  const getStudentReports = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mes Rapports et Statistiques
        </h1>
        <p className="text-muted-foreground">
          Visualisez votre progression et exportez vos réalisations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Score LED Actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">92/100</div>
            <Progress value={92} className="w-full h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              Excellent niveau atteint
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Taux de Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">90%</div>
            <Progress value={90} className="w-full h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              18/20 rapports soumis
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">
              Classement LED
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              15/168
            </div>
            <Badge
              variant="outline"
              className="text-purple-600 border-purple-200"
            >
              Top 10%
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Excellente performance
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evolution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="evolution">Évolution des Compétences</TabsTrigger>
          <TabsTrigger value="activities">Répartition Activités</TabsTrigger>
          <TabsTrigger value="exports">Exports et Certificats</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Mon Évolution LED
              </CardTitle>
              <CardDescription>
                Progression de mes compétences sur les 5 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={competencyEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
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
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Répartition de mes Activités LED
              </CardTitle>
              <CardDescription>
                Distribution par domaine de compétence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={activitiesDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {activitiesDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-500" />
                Exporter mes Réalisations
              </CardTitle>
              <CardDescription>
                Téléchargez vos rapports et certificats au format de votre choix
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="period">Période</Label>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semestre_actuel">
                        Semestre actuel
                      </SelectItem>
                      <SelectItem value="annee_complete">
                        Année complète
                      </SelectItem>
                      <SelectItem value="depuis_debut">
                        Depuis le début
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="format">Format d'export</Label>
                  <Select
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleExportReport(selectedFormat, "complet")}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le rapport complet
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleExportReport(selectedFormat, "competences")
                    }
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Certificat de compétences
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleExportReport(selectedFormat, "activites")
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Liste des activités
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const getTeamReports = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Rapports et Analytics LED
        </h1>
        <p className="text-muted-foreground">
          Analyse détaillée des performances et indicateurs clés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Boursiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">168</div>
            <p className="text-xs text-green-600">+15 ce semestre</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de Réussite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89%</div>
            <p className="text-xs text-green-600">+3% vs période précédente</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rapports en Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">28</div>
            <p className="text-xs text-red-600">12 en retard</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Score Moyen LED
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">84/100</div>
            <p className="text-xs text-green-600">+2 points</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="submissions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions">Soumissions par Filière</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="exports">Exports Administratifs</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Suivi des Soumissions par Filière
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={submissionsByFieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="filiere" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="soumis" fill="#00C49F" name="Soumis" />
                  <Bar dataKey="enAttente" fill="#FFBB28" name="En attente" />
                  <Bar dataKey="enRetard" fill="#FF6B6B" name="En retard" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Tendances d'Évolution LED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={competencyEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="entrepreneuriat"
                    stroke="#0088FE"
                    strokeWidth={2}
                    name="Entrepreneuriat (moyenne)"
                  />
                  <Line
                    type="monotone"
                    dataKey="leadership"
                    stroke="#00C49F"
                    strokeWidth={2}
                    name="Leadership (moyenne)"
                  />
                  <Line
                    type="monotone"
                    dataKey="digital"
                    stroke="#FFBB28"
                    strokeWidth={2}
                    name="Digital (moyenne)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-500" />
                Exports Administratifs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() =>
                    handleExportReport("excel", "dashboard_complet")
                  }
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Rapport de synthèse complet
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportReport("csv", "liste_boursiers")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Liste complète des boursiers
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportReport("pdf", "performances")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Rapport de performances
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportReport("excel", "statistiques")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Statistiques détaillées
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (userRole === "student") {
    return getStudentReports();
  }

  return getTeamReports();
}
