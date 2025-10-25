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

import React, { useState, useEffect } from "react";
import { UserRole } from "../App";
import { userService } from "../services/users";
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
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  GraduationCap,
  TrendingUp,
  FileText,
} from "lucide-react";

interface ScholarManagementProps {
  userRole: UserRole;
}

interface Scholar {
  id: string;
  name: string;
  email: string;
  filiere: string;
  niveau: string;
  createdAt: string;
  stats: {
    totalActivities: number;
    completedActivities: number;
    completionRate: number;
    scores: {
      entrepreneuriat: number;
      leadership: number;
      digital: number;
    };
    globalScore: number;
  };
}

export function ScholarManagement({ userRole }: ScholarManagementProps) {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadScholars();
  }, [currentPage, searchTerm, selectedFiliere, selectedNiveau]);

  const loadScholars = async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {
        search: searchTerm || undefined,
        filiere: selectedFiliere || undefined,
        niveau: selectedNiveau || undefined,
        page: currentPage,
        limit: 20,
      };

      const response = await userService.getScholars(filters);

      if (response.success) {
        setScholars(response.data || []);
        setPagination(
          response.pagination || {
            total: 0,
            pages: 0,
            page: 1,
            limit: 20,
          }
        );
      } else {
        setError(response.error || "Erreur lors du chargement des données");
      }
    } catch (err) {
      setError("Erreur lors du chargement des étudiants");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === "filiere") {
      setSelectedFiliere(value);
    } else if (type === "niveau") {
      setSelectedNiveau(value);
    }
    setCurrentPage(1);
  };

  const getStatusBadge = (scholar: Scholar) => {
    if (scholar.stats.completionRate >= 80) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Actif
        </Badge>
      );
    } else if (scholar.stats.completionRate >= 50) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />À surveiller
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Alerte
        </Badge>
      );
    }
  };

  const getAlertes = (scholar: Scholar) => {
    if (scholar.stats.completionRate < 50) return "Taux faible";
    if (scholar.stats.globalScore < 60) return "Score faible";
    return "OK";
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des étudiants...</p>
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

  // Vue pour l'équipe LED
  if (userRole === "led_team") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Boursiers LED
          </h1>
          <p className="text-muted-foreground">
            Suivi et administration des étudiants du programme LED
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Étudiants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {pagination.total}
              </div>
              <p className="text-xs text-muted-foreground">
                étudiants inscrits
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Étudiants Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {scholars.filter((s) => s.stats.completionRate >= 80).length}
              </div>
              <p className="text-xs text-muted-foreground">
                performance élevée
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {scholars.length > 0
                  ? Math.round(
                      scholars.reduce(
                        (sum, s) => sum + s.stats.globalScore,
                        0
                      ) / scholars.length
                    )
                  : 0}
                /100
              </div>
              <p className="text-xs text-muted-foreground">
                toutes compétences
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {
                  scholars.filter(
                    (s) =>
                      s.stats.completionRate < 50 || s.stats.globalScore < 60
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                nécessitent un suivi
              </p>
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
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              {/* ✅ Correction du Select Filière */}
              <Select
                value={selectedFiliere}
                onValueChange={(value) =>
                  handleFilterChange("filiere", value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les filières" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les filières</SelectItem>
                  <SelectItem value="Génie Civil">Génie Civil</SelectItem>
                  <SelectItem value="Informatique">Informatique</SelectItem>
                  <SelectItem value="Eau et Assainissement">
                    Eau et Assainissement
                  </SelectItem>
                  <SelectItem value="Électronique">Électronique</SelectItem>
                  <SelectItem value="Génie Électrique">
                    Génie Électrique
                  </SelectItem>
                  <SelectItem value="Mines et Géologie">
                    Mines et Géologie
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* ✅ Correction du Select Niveau */}
              <Select
                value={selectedNiveau}
                onValueChange={(value) =>
                  handleFilterChange("niveau", value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="L1">Licence 1</SelectItem>
                  <SelectItem value="L2">Licence 2</SelectItem>
                  <SelectItem value="L3">Licence 3</SelectItem>
                  <SelectItem value="M1">Master 1</SelectItem>
                  <SelectItem value="M2">Master 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des étudiants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des Étudiants LED ({pagination.total})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Filière</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Score Global</TableHead>
                  <TableHead>Activités</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Alertes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholars.map((scholar) => (
                  <TableRow key={scholar.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
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
                          <p className="font-medium">{scholar.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {scholar.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{scholar.filiere || "Non spécifiée"}</TableCell>
                    <TableCell>{scholar.niveau || "Non spécifié"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold">
                          {scholar.stats.globalScore}/100
                        </div>
                        <Progress
                          value={scholar.stats.globalScore}
                          className="w-16 h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          Activités {scholar.stats.completedActivities}/
                          {scholar.stats.totalActivities}
                        </div>
                        <div className="text-muted-foreground">
                          {scholar.stats.completionRate}% complétées
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(scholar)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{getAlertes(scholar)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} sur {pagination.pages} (
                  {pagination.total} étudiants)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= pagination.pages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vue pour les superviseurs (simplifiée)
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
            <div className="text-2xl font-bold text-blue-600">
              {scholars.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Performance Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {scholars.length > 0
                ? Math.round(
                    scholars.reduce((sum, s) => sum + s.stats.globalScore, 0) /
                      scholars.length
                  )
                : 0}
              /100
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">À Évaluer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {scholars.reduce(
                (sum, s) =>
                  sum + (s.stats.totalActivities - s.stats.completedActivities),
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste simplifiée pour superviseurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scholars.map((scholar) => (
              <div
                key={scholar.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {scholar.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{scholar.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {scholar.filiere} • {scholar.niveau}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {scholar.stats.globalScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {scholar.stats.completedActivities}/
                    {scholar.stats.totalActivities} activités
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
