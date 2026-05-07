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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            alert(`Voir détails: ${scholar.name}`);
                          }}
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            alert(`Éditer: ${scholar.name}`);
                          }}
                          title="Modifier le boursier"
                        >
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
