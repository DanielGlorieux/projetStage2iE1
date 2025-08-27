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
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Download,
  Filter,
  MoreVertical,
  BookOpen,
  Briefcase,
  Trophy,
  Clock,
  CheckCircle,
} from "lucide-react";

interface ScholarManagementProps {
  userRole: UserRole;
}

interface Scholar {
  id: string;
  name: string;
  email: string;
  university: string;
  program: string;
  year: number;
  status: "active" | "pending" | "graduated" | "suspended";
  overallScore: number;
  academicActivities: number;
  extracurricularActivities: number;
  professionalActivities: number;
  lastActivity: string;
}

// Données mockées des boursiers
const mockScholars: Scholar[] = [
  {
    id: "1",
    name: "Alice Martin",
    email: "alice.martin@univ.fr",
    university: "Université Paris-Sorbonne",
    program: "Master Informatique",
    year: 2,
    status: "active",
    overallScore: 92,
    academicActivities: 15,
    extracurricularActivities: 8,
    professionalActivities: 5,
    lastActivity: "2024-08-12",
  },
  {
    id: "2",
    name: "Thomas Dubois",
    email: "thomas.dubois@univ.fr",
    university: "École Polytechnique",
    program: "Ingénieur Généraliste",
    year: 3,
    status: "active",
    overallScore: 88,
    academicActivities: 18,
    extracurricularActivities: 12,
    professionalActivities: 7,
    lastActivity: "2024-08-13",
  },
  {
    id: "3",
    name: "Sarah Leclerc",
    email: "sarah.leclerc@univ.fr",
    university: "Sciences Po Paris",
    program: "Master Relations Internationales",
    year: 1,
    status: "pending",
    overallScore: 75,
    academicActivities: 8,
    extracurricularActivities: 6,
    professionalActivities: 3,
    lastActivity: "2024-08-10",
  },
];

export function ScholarManagement({ userRole }: ScholarManagementProps) {
  const [scholars, setScholars] = useState(mockScholars);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredScholars = scholars.filter((scholar) => {
    const matchesSearch =
      scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || scholar.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Scholar["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Actif</Badge>;
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "graduated":
        return <Badge variant="outline">Diplômé</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspendu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const ScholarDetailsModal = ({ scholar }: { scholar: Scholar }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {scholar.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {scholar.name}
        </DialogTitle>
        <DialogDescription>
          {scholar.program} - {scholar.university}
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="academic">Académique</TabsTrigger>
          <TabsTrigger value="extracurricular">Parascolaire</TabsTrigger>
          <TabsTrigger value="professional">Professionnel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Score Global</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-2">{scholar.overallScore}/100</div>
                <Progress value={scholar.overallScore} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center space-y-0">
                <CardTitle className="text-sm">Académique</CardTitle>
                <BookOpen className="h-4 w-4 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{scholar.academicActivities}</div>
                <p className="text-xs text-muted-foreground">activités</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center space-y-0">
                <CardTitle className="text-sm">Parascolaire</CardTitle>
                <Trophy className="h-4 w-4 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {scholar.extracurricularActivities}
                </div>
                <p className="text-xs text-muted-foreground">activités</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center space-y-0">
                <CardTitle className="text-sm">Professionnel</CardTitle>
                <Briefcase className="h-4 w-4 ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{scholar.professionalActivities}</div>
                <p className="text-xs text-muted-foreground">activités</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Email:</strong> {scholar.email}
              </div>
              <div>
                <strong>Université:</strong> {scholar.university}
              </div>
              <div>
                <strong>Programme:</strong> {scholar.program}
              </div>
              <div>
                <strong>Année:</strong> {scholar.year}ème année
              </div>
              <div>
                <strong>Statut:</strong> {getStatusBadge(scholar.status)}
              </div>
              <div>
                <strong>Dernière activité:</strong> {scholar.lastActivity}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Activités académiques</CardTitle>
              <CardDescription>
                Cours, examens, projets de recherche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Projet de fin d'études</span>
                  </div>
                  <Badge>Terminé</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span>Mémoire de recherche</span>
                  </div>
                  <Badge variant="secondary">En cours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extracurricular">
          <Card>
            <CardHeader>
              <CardTitle>Activités parascolaires</CardTitle>
              <CardDescription>Associations, sport, bénévolat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Présidence association étudiante</span>
                  </div>
                  <Badge>Terminé</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <Card>
            <CardHeader>
              <CardTitle>Expériences professionnelles</CardTitle>
              <CardDescription>
                Stages, emplois, projets professionnels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span>Stage chez TechCorp</span>
                  </div>
                  <Badge variant="secondary">En cours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestion des boursiers</h1>
          <p className="text-muted-foreground">
            Gérez et suivez la progression de tous les boursiers LED
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau boursier
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, ou université..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-border rounded-md bg-background"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="graduated">Diplômé</option>
                <option value="suspended">Suspendu</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Plus de filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Boursiers ({filteredScholars.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Boursier</TableHead>
                <TableHead>Université</TableHead>
                <TableHead>Programme</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Activités</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScholars.map((scholar) => (
                <TableRow key={scholar.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {scholar.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{scholar.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {scholar.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{scholar.university}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{scholar.program}</div>
                    <div className="text-xs text-muted-foreground">
                      {scholar.year}ème année
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {scholar.overallScore}/100
                      </span>
                      <Progress value={scholar.overallScore} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div>Académique: {scholar.academicActivities}</div>
                      <div>
                        Parascolaire: {scholar.extracurricularActivities}
                      </div>
                      <div>Professionnel: {scholar.professionalActivities}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(scholar.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedScholar(scholar)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {selectedScholar && (
                          <ScholarDetailsModal scholar={selectedScholar} />
                        )}
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Award,
  Clock,
} from "lucide-react";

interface ScholarManagementProps {
  userRole: UserRole;
}

// Interface pour les données des étudiants
interface Scholar {
  id: string;
  name: string;
  email: string;
  filiere: string;
  niveau: string;
  scoreGlobal: number;
  rapportsSoumis: number;
  rapportsTotal: number;
  activitesEnCours: number;
  statut: "actif" | "suspendu" | "diplome";
  dernierAcces: string;
  prochaineDue: string;
  alertes: number;
}

// Données de démonstration
const mockScholars: Scholar[] = [
  {
    id: "1",
    name: "Marie SANOGO",
    email: "marie.sanogo.et@2ie-edu.org",
    filiere: "Informatique",
    niveau: "Master 1",
    scoreGlobal: 92,
    rapportsSoumis: 18,
    rapportsTotal: 20,
    activitesEnCours: 2,
    statut: "actif",
    dernierAcces: "2025-08-18",
    prochaineDue: "2025-08-25",
    alertes: 0,
  },
  {
    id: "2",
    name: "Aminata KONE",
    email: "aminata.kone.et@2ie-edu.org",
    filiere: "Génie Civil",
    niveau: "Master 2",
    scoreGlobal: 65,
    rapportsSoumis: 12,
    rapportsTotal: 20,
    activitesEnCours: 5,
    statut: "actif",
    dernierAcces: "2025-08-15",
    prochaineDue: "2025-08-20",
    alertes: 3,
  },
  {
    id: "3",
    name: "Ibrahim OUEDRAOGO",
    email: "ibrahim.ouedraogo.et@2ie-edu.org",
    filiere: "Électronique",
    niveau: "Licence 3",
    scoreGlobal: 88,
    rapportsSoumis: 16,
    rapportsTotal: 18,
    activitesEnCours: 1,
    statut: "actif",
    dernierAcces: "2025-08-19",
    prochaineDue: "2025-08-28",
    alertes: 0,
  },
];

export function ScholarManagement({ userRole }: ScholarManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("all");
  const [selectedStatut, setSelectedStatut] = useState("all");
  const [selectedScholar, setSelectedScholar] = useState<Scholar | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Filtrage des étudiants
  const filteredScholars = mockScholars.filter((scholar) => {
    const matchesSearch =
      scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFiliere =
      selectedFiliere === "all" || scholar.filiere === selectedFiliere;
    const matchesStatut =
      selectedStatut === "all" || scholar.statut === selectedStatut;

    return matchesSearch && matchesFiliere && matchesStatut;
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "suspendu":
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      case "diplome":
        return <Badge className="bg-blue-100 text-blue-800">Diplômé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const ScholarDetailsDialog = ({ scholar }: { scholar: Scholar }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-600 text-white">
              {scholar.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          Profil de {scholar.name}
        </DialogTitle>
        <DialogDescription>
          Détails complets et suivi des performances LED
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="progress">Progression</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{scholar.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-green-500" />
                  <span className="text-sm">
                    {scholar.filiere} - {scholar.niveau}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">
                    Dernier accès: {scholar.dernierAcces}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">
                    Prochaine échéance: {scholar.prochaineDue}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance LED</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Score Global LED
                    </span>
                    <span
                      className={`text-sm font-bold ${getScoreColor(
                        scholar.scoreGlobal
                      )}`}
                    >
                      {scholar.scoreGlobal}/100
                    </span>
                  </div>
                  <Progress
                    value={scholar.scoreGlobal}
                    className="w-full h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Rapports Soumis</span>
                    <span className="text-sm font-bold text-blue-600">
                      {scholar.rapportsSoumis}/{scholar.rapportsTotal}
                    </span>
                  </div>
                  <Progress
                    value={
                      (scholar.rapportsSoumis / scholar.rapportsTotal) * 100
                    }
                    className="w-full h-2"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">
                    Activités en cours
                  </span>
                  <Badge variant="outline">{scholar.activitesEnCours}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Compétences</CardTitle>
              <CardDescription>
                Progression mensuelle dans les 3 domaines LED
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Entrepreneuriat</span>
                    <span className="text-sm font-bold text-blue-600">
                      88/100
                    </span>
                  </div>
                  <Progress value={88} className="w-full h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Leadership</span>
                    <span className="text-sm font-bold text-green-600">
                      92/100
                    </span>
                  </div>
                  <Progress value={92} className="w-full h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Digital</span>
                    <span className="text-sm font-bold text-purple-600">
                      85/100
                    </span>
                  </div>
                  <Progress value={85} className="w-full h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activités Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Projet Innovation Tech</p>
                      <p className="text-sm text-muted-foreground">
                        Entrepreneuriat • Échéance: 25/08/2025
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">En cours</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">Formation Leadership</p>
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
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications et Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              {scholar.alertes > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="font-medium text-red-800">
                        3 rapports en retard
                      </p>
                      <p className="text-sm text-red-600">
                        Action requise immédiatement
                      </p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer un rappel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">Aucune alerte</p>
                    <p className="text-sm text-green-600">
                      Étudiant à jour dans ses obligations
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  if (userRole === "led_team") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Boursiers LED
          </h1>
          <p className="text-muted-foreground">
            Suivi et management des étudiants bénéficiaires
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Boursiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">168</div>
              <p className="text-xs text-green-600">+15 nouveaux</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Étudiants Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-xs text-muted-foreground">93% du total</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Alertes Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-xs text-red-600">Nécessitent un suivi</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">84/100</div>
              <p className="text-xs text-green-600">+2 vs mois précédent</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Rechercher un étudiant</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Filière</Label>
                <Select
                  value={selectedFiliere}
                  onValueChange={setSelectedFiliere}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les filières</SelectItem>
                    <SelectItem value="Informatique">Informatique</SelectItem>
                    <SelectItem value="Génie Civil">Génie Civil</SelectItem>
                    <SelectItem value="Électronique">Électronique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={selectedStatut}
                  onValueChange={setSelectedStatut}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                    <SelectItem value="diplome">Diplômé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouveau boursier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des étudiants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des Boursiers ({filteredScholars.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Filière/Niveau</TableHead>
                  <TableHead>Score LED</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Alertes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScholars.map((scholar) => (
                  <TableRow key={scholar.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">
                            {scholar.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{scholar.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {scholar.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{scholar.filiere}</p>
                        <p className="text-sm text-muted-foreground">
                          {scholar.niveau}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${getScoreColor(
                            scholar.scoreGlobal
                          )}`}
                        >
                          {scholar.scoreGlobal}
                        </span>
                        <span className="text-muted-foreground">/100</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Rapports</span>
                          <span>
                            {scholar.rapportsSoumis}/{scholar.rapportsTotal}
                          </span>
                        </div>
                        <Progress
                          value={
                            (scholar.rapportsSoumis / scholar.rapportsTotal) *
                            100
                          }
                          className="w-16 h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{getStatutBadge(scholar.statut)}</TableCell>
                    <TableCell>
                      {scholar.alertes > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {scholar.alertes} alerte
                          {scholar.alertes > 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-green-600 text-xs"
                        >
                          OK
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Dialog
                          open={showDetailsDialog}
                          onOpenChange={setShowDetailsDialog}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedScholar(scholar)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedScholar && (
                            <ScholarDetailsDialog scholar={selectedScholar} />
                          )}
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vue pour les superviseurs
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Étudiants LED</h1>
        <p className="text-muted-foreground">
          Étudiants sous votre encadrement
        </p>
      </div>

      {/* Vue simplifiée pour les superviseurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Étudiants Encadrés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">Actifs cette année</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87/100</div>
            <p className="text-xs text-green-600">Excellent niveau</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">À Évaluer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">5</div>
            <p className="text-xs text-muted-foreground">Rapports en attente</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste de mes Étudiants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Score LED</TableHead>
                <TableHead>Dernière Activité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScholars.slice(0, 3).map((scholar) => (
                <TableRow key={scholar.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {scholar.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{scholar.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {scholar.filiere}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-bold ${getScoreColor(
                        scholar.scoreGlobal
                      )}`}
                    >
                      {scholar.scoreGlobal}/100
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{scholar.dernierAcces}</span>
                  </TableCell>
                  <TableCell>{getStatutBadge(scholar.statut)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
