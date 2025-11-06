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
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import {
  Search as SearchIcon,
  Filter,
  X,
  Download,
  Calendar,
  BookOpen,
  Briefcase,
  Trophy,
} from "lucide-react";

interface SearchProps {
  userRole: UserRole;
}

interface SearchFilters {
  searchTerm: string;
  universities: string[];
  programs: string[];
  years: number[];
  status: string[];
  scoreRange: { min: number; max: number };
  activityTypes: string[];
  dateRange: { start: string; end: string };
}

interface SearchResult {
  id: string;
  name: string;
  email: string;
  university: string;
  program: string;
  year: number;
  status: string;
  score: number;
  activities: string[];
  lastUpdate: string;
}

// Données mockées pour les options de filtre
const universities = [
  "Université Paris-Sorbonne",
  "École Polytechnique",
  "Sciences Po Paris",
  "Université Lyon 1",
  "INSA Lyon",
  "Université Bordeaux",
];

const programs = [
  "Master Informatique",
  "Ingénieur Généraliste",
  "Master Relations Internationales",
  "Master Finance",
  "Doctorat Sciences",
  "Master Marketing",
];

// Résultats de recherche mockés
const mockResults: SearchResult[] = [
  {
    id: "1",
    name: "Alice Martin",
    email: "alice.martin@univ.fr",
    university: "Université Paris-Sorbonne",
    program: "Master Informatique",
    year: 2,
    status: "active",
    score: 92,
    activities: ["Académique", "Professionnel"],
    lastUpdate: "2024-08-12",
  },
  {
    id: "2",
    name: "Thomas Dubois",
    email: "thomas.dubois@univ.fr",
    university: "École Polytechnique",
    program: "Ingénieur Généraliste",
    year: 3,
    status: "active",
    score: 88,
    activities: ["Académique", "Parascolaire", "Professionnel"],
    lastUpdate: "2024-08-13",
  },
];

export function Search({ userRole }: SearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    universities: [],
    programs: [],
    years: [],
    status: [],
    scoreRange: { min: 0, max: 100 },
    activityTypes: [],
    dateRange: { start: "", end: "" },
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulation d'une recherche
    setTimeout(() => {
      setResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      universities: [],
      programs: [],
      years: [],
      status: [],
      scoreRange: { min: 0, max: 100 },
      activityTypes: [],
      dateRange: { start: "", end: "" },
    });
    setResults([]);
  };

  const exportResults = () => {
    // Simulation d'export
    const csvContent = results
      .map(
        (r) => `${r.name},${r.email},${r.university},${r.program},${r.score}`
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "boursiers-recherche.csv";
    a.click();
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case "Académique":
        return <BookOpen className="w-3 h-3" />;
      case "Parascolaire":
        return <Trophy className="w-3 h-3" />;
      case "Professionnel":
        return <Briefcase className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Recherche multicritère</h1>
          <p className="text-muted-foreground">
            Recherchez et filtrez les boursiers selon vos critères
          </p>
        </div>
        {results.length > 0 && (
          <Button onClick={exportResults} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter ({results.length})
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Critères de recherche
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvancedFilters ? "Masquer" : "Afficher"} filtres avancés
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, université, programme..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Recherche..." : "Rechercher"}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Effacer
            </Button>
          </div>

          {showAdvancedFilters && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Universités</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {universities.map((uni) => (
                      <div key={uni} className="flex items-center space-x-2">
                        <Checkbox
                          checked={filters.universities.includes(uni)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                universities: [...filters.universities, uni],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                universities: filters.universities.filter(
                                  (u) => u !== uni
                                ),
                              });
                            }
                          }}
                        />
                        <label className="text-sm">{uni}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Programmes d'études</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {programs.map((program) => (
                      <div
                        key={program}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={filters.programs.includes(program)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                programs: [...filters.programs, program],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                programs: filters.programs.filter(
                                  (p) => p !== program
                                ),
                              });
                            }
                          }}
                        />
                        <label className="text-sm">{program}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Statut</label>
                  <div className="space-y-2">
                    {["active", "pending", "graduated", "suspended"].map(
                      (status) => (
                        <div
                          key={status}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={filters.status.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({
                                  ...filters,
                                  status: [...filters.status, status],
                                });
                              } else {
                                setFilters({
                                  ...filters,
                                  status: filters.status.filter(
                                    (s) => s !== status
                                  ),
                                });
                              }
                            }}
                          />
                          <label className="text-sm capitalize">
                            {status === "active"
                              ? "Actif"
                              : status === "pending"
                              ? "En attente"
                              : status === "graduated"
                              ? "Diplômé"
                              : "Suspendu"}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Plage de scores</label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="100"
                      value={filters.scoreRange.min}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          scoreRange: {
                            ...filters.scoreRange,
                            min: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">à</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max="100"
                      value={filters.scoreRange.max}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          scoreRange: {
                            ...filters.scoreRange,
                            max: parseInt(e.target.value) || 100,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Types d'activités</label>
                  <div className="flex flex-wrap gap-2">
                    {["Académique", "Parascolaire", "Professionnel"].map(
                      (type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            checked={filters.activityTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({
                                  ...filters,
                                  activityTypes: [
                                    ...filters.activityTypes,
                                    type,
                                  ],
                                });
                              } else {
                                setFilters({
                                  ...filters,
                                  activityTypes: filters.activityTypes.filter(
                                    (t) => t !== type
                                  ),
                                });
                              }
                            }}
                          />
                          <label className="text-sm flex items-center gap-1">
                            {getActivityIcon(type)}
                            {type}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de recherche ({results.length})</CardTitle>
            <CardDescription>
              Boursiers correspondant à vos critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg">{result.name}</h3>
                        <Badge
                          variant={
                            result.status === "active" ? "default" : "secondary"
                          }
                        >
                          {result.status === "active" ? "Actif" : "En attente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {result.email}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{result.university}</span>
                        <span>•</span>
                        <span>{result.program}</span>
                        <span>•</span>
                        <span>Année {result.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Activités:</span>
                        <div className="flex gap-1">
                          {result.activities.map((activity) => (
                            <Badge
                              key={activity}
                              variant="outline"
                              className="text-xs"
                            >
                              {getActivityIcon(activity)}
                              <span className="ml-1">{activity}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl">{result.score}/100</div>
                      <div className="text-xs text-muted-foreground">
                        Mis à jour: {result.lastUpdate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && filters.searchTerm && !isSearching && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="text-muted-foreground">
              Aucun résultat trouvé pour vos critères de recherche.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}*/

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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Search as SearchIcon,
  Filter,
  RefreshCw,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Award,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";

interface SearchProps {
  userRole: UserRole;
}

interface SearchFilters {
  nom: string;
  email: string;
  filiere: string[];
  niveau: string[];
  scoreMin: number;
  scoreMax: number;
  statut: string[];
  typeActivite: string[];
  periodeDebut: string;
  periodeFin: string;
}

interface StudentResult {
  id: string;
  nom: string;
  email: string;
  filiere: string;
  niveau: string;
  scoreGlobal: number;
  statut: string;
  dernierAcces: string;
  activitesCompletes: number;
  activitesTotal: number;
  competences: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
}

// Données de démonstration pour les résultats de recherche
const mockResults: StudentResult[] = [
  {
    id: "1",
    nom: "Marie SANOGO",
    email: "marie.sanogo.et@2ie-edu.org",
    filiere: "Informatique",
    niveau: "Master 1",
    scoreGlobal: 92,
    statut: "actif",
    dernierAcces: "2025-08-18",
    activitesCompletes: 18,
    activitesTotal: 20,
    competences: { entrepreneuriat: 88, leadership: 95, digital: 92 },
  },
  {
    id: "2",
    nom: "Ibrahim TRAORE",
    email: "ibrahim.traore.et@2ie-edu.org",
    filiere: "Génie Civil",
    niveau: "Master 2",
    scoreGlobal: 85,
    statut: "actif",
    dernierAcces: "2025-08-17",
    activitesCompletes: 16,
    activitesTotal: 18,
    competences: { entrepreneuriat: 82, leadership: 88, digital: 85 },
  },
  {
    id: "3",
    nom: "Fatima OUEDRAOGO",
    email: "fatima.ouedraogo.et@2ie-edu.org",
    filiere: "Électronique",
    niveau: "Licence 3",
    scoreGlobal: 78,
    statut: "actif",
    dernierAcces: "2025-08-19",
    activitesCompletes: 14,
    activitesTotal: 16,
    competences: { entrepreneuriat: 75, leadership: 80, digital: 78 },
  },
];

export function Search({ userRole }: SearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    nom: "",
    email: "",
    filiere: [],
    niveau: [],
    scoreMin: 0,
    scoreMax: 100,
    statut: [],
    typeActivite: [],
    periodeDebut: "",
    periodeFin: "",
  });

  const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);

    // Simulation de recherche
    setTimeout(() => {
      // Filtrer les résultats selon les critères
      const filteredResults = mockResults.filter((student) => {
        const matchesNom =
          !filters.nom ||
          student.nom.toLowerCase().includes(filters.nom.toLowerCase());
        const matchesEmail =
          !filters.email ||
          student.email.toLowerCase().includes(filters.email.toLowerCase());
        const matchesFiliere =
          filters.filiere.length === 0 ||
          filters.filiere.includes(student.filiere);
        const matchesNiveau =
          filters.niveau.length === 0 ||
          filters.niveau.includes(student.niveau);
        const matchesScore =
          student.scoreGlobal >= filters.scoreMin &&
          student.scoreGlobal <= filters.scoreMax;
        const matchesStatut =
          filters.statut.length === 0 ||
          filters.statut.includes(student.statut);

        return (
          matchesNom &&
          matchesEmail &&
          matchesFiliere &&
          matchesNiveau &&
          matchesScore &&
          matchesStatut
        );
      });

      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleResetFilters = () => {
    setFilters({
      nom: "",
      email: "",
      filiere: [],
      niveau: [],
      scoreMin: 0,
      scoreMax: 100,
      statut: [],
      typeActivite: [],
      periodeDebut: "",
      periodeFin: "",
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiSelectChange = (
    key: keyof SearchFilters,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter((item) => item !== value),
    }));
  };

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

  const exportResults = () => {
    console.log("Export des résultats de recherche");
    // Logique d'export
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Recherche Multicritère
        </h1>
        <p className="text-muted-foreground">
          Recherchez et filtrez les étudiants selon vos critères spécifiques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Critères de Recherche
              </CardTitle>
              <CardDescription>
                Affinez votre recherche avec les filtres ci-dessous
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de l'étudiant</Label>
                  <Input
                    id="nom"
                    placeholder="Saisir le nom..."
                    value={filters.nom}
                    onChange={(e) => handleFilterChange("nom", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Saisir l'email..."
                    value={filters.email}
                    onChange={(e) =>
                      handleFilterChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Filières d'études</Label>
                <div className="space-y-2">
                  {[
                    "Informatique",
                    "Génie Civil",
                    "Électronique",
                    "Énergies Renouvelables",
                  ].map((filiere) => (
                    <div key={filiere} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filiere-${filiere}`}
                        checked={filters.filiere.includes(filiere)}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange(
                            "filiere",
                            filiere,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`filiere-${filiere}`} className="text-sm">
                        {filiere}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Niveaux d'études</Label>
                <div className="space-y-2">
                  {[
                    "Licence 1",
                    "Licence 2",
                    "Licence 3",
                    "Master 1",
                    "Master 2",
                  ].map((niveau) => (
                    <div key={niveau} className="flex items-center space-x-2">
                      <Checkbox
                        id={`niveau-${niveau}`}
                        checked={filters.niveau.includes(niveau)}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange(
                            "niveau",
                            niveau,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`niveau-${niveau}`} className="text-sm">
                        {niveau}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Score LED Global</Label>
                <div className="px-3">
                  <Slider
                    value={[filters.scoreMin, filters.scoreMax]}
                    onValueChange={(value) => {
                      handleFilterChange("scoreMin", value[0]);
                      handleFilterChange("scoreMax", value[1]);
                    }}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{filters.scoreMin}</span>
                    <span>{filters.scoreMax}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Statut</Label>
                <div className="space-y-2">
                  {[
                    { value: "actif", label: "Actif" },
                    { value: "suspendu", label: "Suspendu" },
                    { value: "diplome", label: "Diplômé" },
                  ].map((statut) => (
                    <div
                      key={statut.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`statut-${statut.value}`}
                        checked={filters.statut.includes(statut.value)}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange(
                            "statut",
                            statut.value,
                            checked as boolean
                          )
                        }
                      />
                      <Label
                        htmlFor={`statut-${statut.value}`}
                        className="text-sm"
                      >
                        {statut.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Période d'activité</Label>
                <div className="space-y-2">
                  <Input
                    type="date"
                    placeholder="Date de début"
                    value={filters.periodeDebut}
                    onChange={(e) =>
                      handleFilterChange("periodeDebut", e.target.value)
                    }
                  />
                  <Input
                    type="date"
                    placeholder="Date de fin"
                    value={filters.periodeFin}
                    onChange={(e) =>
                      handleFilterChange("periodeFin", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="w-4 h-4 mr-2" />
                      Lancer la recherche
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Résultats de recherche
                </CardTitle>
                <CardDescription>
                  {hasSearched
                    ? `${searchResults.length} étudiant(s) trouvé(s)`
                    : "Lancez une recherche pour afficher les résultats"}
                </CardDescription>
              </div>
              {searchResults.length > 0 && (
                <Button variant="outline" onClick={exportResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isSearching && (
                <div className="text-center py-6">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recherche en cours...
                  </p>
                </div>
              )}

              {!isSearching && hasSearched && searchResults.length === 0 && (
                <div className="text-center py-6">
                  <AlertTriangle className="w-6 h-6 mx-auto text-red-500" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucun étudiant trouvé
                  </p>
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Filière</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Progression</TableHead>
                        <TableHead>Compétences</TableHead>
                        <TableHead>Dernier accès</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={`https://ui-avatars.com/api/?name=${student.nom}`}
                              />
                              <AvatarFallback>{student.nom[0]}</AvatarFallback>
                            </Avatar>
                            <span>{student.nom}</span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {student.email}
                          </TableCell>
                          <TableCell>{student.filiere}</TableCell>
                          <TableCell>{student.niveau}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {student.scoreGlobal}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatutBadge(student.statut)}
                          </TableCell>
                          <TableCell>
                            <div className="w-32">
                              <Progress
                                value={
                                  (student.activitesCompletes /
                                    student.activitesTotal) *
                                  100
                                }
                              />
                              <span className="text-xs text-muted-foreground">
                                {student.activitesCompletes}/
                                {student.activitesTotal}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <Award className="w-3 h-3 text-yellow-500" />
                                Entrepreneuriat:{" "}
                                {student.competences.entrepreneuriat}%
                              </div>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-3 h-3 text-blue-500" />
                                Leadership: {student.competences.leadership}%
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-green-500" />
                                Digital: {student.competences.digital}%
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {student.dernierAcces}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => {
                                  // Créer un alert simple avec les infos de l'étudiant
                                  alert(`Détails de ${student.nom}\n\nEmail: ${student.email}\nFilière: ${student.filiere}\nNiveau: ${student.niveau}\nScore: ${student.scoreGlobal}%`);
                                }}
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => window.location.href = `mailto:${student.email}`}
                                title="Envoyer un email"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => {
                                  // Copier l'email dans le presse-papiers
                                  navigator.clipboard.writeText(student.email);
                                  alert(`Email copié: ${student.email}`);
                                }}
                                title="Copier l'email"
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}*/

/*-------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------*/

/*import React, { useState } from "react";
//import { UserRole, SearchFilters, StudentResult } from "../types";
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
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { SearchFiltersPanel } from "../search/SearchFiltersPanel";
import { SearchResultsTable } from "../search/SearchResultsTable";
import { ExportButtons } from "../search/ExportButtons";
//import { MOCK_STUDENTS } from "../data/mockData";
//import { FILIERES, NIVEAUX } from "../constants/activityTypes";
import {
  Search as SearchIcon,
  Filter,
  RefreshCw,
  AlertTriangle,
  Users,
} from "lucide-react";

const FILIERES = [
  "Informatique",
  "Génie Civil",
  "Électronique",
  "Énergies Renouvelables",
  "Génie Rural et Environnement",
];

const NIVEAUX = ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];

type UserRole = "student" | "led_team" | "supervisor";

interface SearchFilters {
  nom: string;
  email: string;
  filiere: string[];
  niveau: string[];
  scoreMin: number;
  scoreMax: number;
  statut: string[];
  typeActivite: string[];
  titreActivite: string;
  periodeDebut: string;
  periodeFin: string;
}

interface StudentResult {
  id: string;
  nom: string;
  email: string;
  filiere: string;
  niveau: string;
  scoreGlobal: number;
  statut: string;
  dernierAcces: string;
  activitesCompletes: number;
  activitesTotal: number;
  competences: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
  activitesRecentes: Array<{
    titre: string;
    type: string;
    score?: number;
    dateSubmission: string;
  }>;
}

const MOCK_STUDENTS: StudentResult[] = [
  {
    id: "1",
    nom: "Marie SANOGO",
    email: "marie.sanogo.et@2ie-edu.org",
    filiere: "Informatique",
    niveau: "Master 1",
    scoreGlobal: 92,
    statut: "actif",
    dernierAcces: "2025-08-18",
    activitesCompletes: 18,
    activitesTotal: 20,
    competences: { entrepreneuriat: 88, leadership: 95, digital: 92 },
    activitesRecentes: [
      {
        titre: "Application de Gestion de l'Eau Intelligente",
        type: "entrepreneuriat",
        score: 18,
        dateSubmission: "2025-08-15",
      },
      {
        titre: "Formation Leadership Digital",
        type: "leadership",
        score: 19,
        dateSubmission: "2025-08-10",
      },
    ],
  },
  {
    id: "2",
    nom: "Ibrahim TRAORE",
    email: "ibrahim.traore.et@2ie-edu.org",
    filiere: "Génie Civil",
    niveau: "Master 2",
    scoreGlobal: 85,
    statut: "actif",
    dernierAcces: "2025-08-17",
    activitesCompletes: 16,
    activitesTotal: 18,
    competences: { entrepreneuriat: 82, leadership: 88, digital: 85 },
    activitesRecentes: [
      {
        titre: "Projet Innovation Construction Durable",
        type: "entrepreneuriat",
        score: 16,
        dateSubmission: "2025-08-12",
      },
      {
        titre: "Management d'Équipe Multiculturelle",
        type: "leadership",
        score: 17,
        dateSubmission: "2025-08-08",
      },
    ],
  },
  {
    id: "3",
    nom: "Fatou KONE",
    email: "fatou.kone.et@2ie-edu.org",
    filiere: "Électronique",
    niveau: "Licence 3",
    scoreGlobal: 95,
    statut: "actif",
    dernierAcces: "2025-08-19",
    activitesCompletes: 22,
    activitesTotal: 22,
    competences: { entrepreneuriat: 96, leadership: 94, digital: 95 },
    activitesRecentes: [
      {
        titre: "Startup IoT Agricole",
        type: "entrepreneuriat",
        score: 20,
        dateSubmission: "2025-08-16",
      },
      {
        titre: "Plateforme Digitale Collaborative",
        type: "digital",
        score: 19,
        dateSubmission: "2025-08-14",
      },
    ],
  },
];

interface SearchProps {
  userRole: UserRole;
}

export function Search({ userRole }: SearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    nom: "",
    email: "",
    filiere: [],
    niveau: [],
    scoreMin: 0,
    scoreMax: 100,
    statut: [],
    typeActivite: [],
    titreActivite: "",
    periodeDebut: "",
    periodeFin: "",
  });

  const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      const filteredResults = MOCK_STUDENTS.filter((student) => {
        const matchesNom =
          !filters.nom ||
          student.nom.toLowerCase().includes(filters.nom.toLowerCase());
        const matchesEmail =
          !filters.email ||
          student.email.toLowerCase().includes(filters.email.toLowerCase());
        const matchesFiliere =
          filters.filiere.length === 0 ||
          filters.filiere.includes(student.filiere);
        const matchesNiveau =
          filters.niveau.length === 0 ||
          filters.niveau.includes(student.niveau);
        const matchesScore =
          student.scoreGlobal >= filters.scoreMin &&
          student.scoreGlobal <= filters.scoreMax;
        const matchesStatut =
          filters.statut.length === 0 ||
          filters.statut.includes(student.statut);

        const matchesTitreActivite =
          !filters.titreActivite ||
          student.activitesRecentes.some((activite) =>
            activite.titre
              .toLowerCase()
              .includes(filters.titreActivite.toLowerCase())
          );

        const matchesTypeActivite =
          filters.typeActivite.length === 0 ||
          student.activitesRecentes.some((activite) =>
            filters.typeActivite.includes(activite.type)
          );

        return (
          matchesNom &&
          matchesEmail &&
          matchesFiliere &&
          matchesNiveau &&
          matchesScore &&
          matchesStatut &&
          matchesTitreActivite &&
          matchesTypeActivite
        );
      });

      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleResetFilters = () => {
    setFilters({
      nom: "",
      email: "",
      filiere: [],
      niveau: [],
      scoreMin: 0,
      scoreMax: 100,
      statut: [],
      typeActivite: [],
      titreActivite: "",
      periodeDebut: "",
      periodeFin: "",
    });
    setSearchResults([]);
    setHasSearched(false);
    setSelectedStudents([]);
  };

  if (userRole !== "led_team" && userRole !== "supervisor") {
    return (
      <div className="p-6">
        <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-4" />
        <p className="text-center text-muted-foreground">
          Cette fonctionnalité est réservée à l'équipe LED et aux superviseurs.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Recherche Multicritère
        </h1>
        <p className="text-muted-foreground">
          Recherchez et filtrez les étudiants selon vos critères spécifiques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SearchFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            onReset={handleResetFilters}
            isSearching={isSearching}
          />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Résultats de recherche
                </CardTitle>
                <CardDescription>
                  {hasSearched
                    ? `${searchResults.length} étudiant(s) trouvé(s)`
                    : "Lancez une recherche pour afficher les résultats"}
                </CardDescription>
              </div>
              {searchResults.length > 0 && (
                <ExportButtons
                  searchResults={searchResults}
                  selectedStudents={selectedStudents}
                />
              )}
            </CardHeader>
            <CardContent>
              {isSearching && (
                <div className="text-center py-6">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recherche en cours...
                  </p>
                </div>
              )}

              {!isSearching && hasSearched && searchResults.length === 0 && (
                <div className="text-center py-6">
                  <AlertTriangle className="w-6 h-6 mx-auto text-red-500" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucun étudiant trouvé
                  </p>
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <SearchResultsTable
                  results={searchResults}
                  selectedStudents={selectedStudents}
                  onSelectionChange={setSelectedStudents}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}*/

import React, { useState, useEffect } from "react";
import { searchService } from "../services/searchService";
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
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { SearchFiltersPanel } from "../search/SearchFiltersPanel";
import { SearchResultsTable } from "../search/SearchResultsTable";
import { ExportButtons } from "../search/ExportButtons";
import {
  Search as SearchIcon,
  Filter,
  RefreshCw,
  AlertTriangle,
  Users,
} from "lucide-react";

type UserRole = "student" | "led_team" | "supervisor";

interface SearchFilters {
  nom: string;
  email: string;
  filiere: string[];
  niveau: string[];
  scoreMin: number;
  scoreMax: number;
  statut: string[];
  typeActivite: string[];
  titreActivite: string;
  periodeDebut: string;
  periodeFin: string;
}

interface StudentResult {
  id: string;
  nom: string;
  email: string;
  filiere: string;
  niveau: string;
  scoreGlobal: number;
  statut: string;
  dernierAcces: string;
  activitesCompletes: number;
  activitesTotal: number;
  competences: {
    entrepreneuriat: number;
    leadership: number;
    digital: number;
  };
  activitesRecentes?: Array<{
    titre: string;
    type: string;
    score?: number;
    dateSubmission: string;
  }>;
}

interface SearchProps {
  userRole: UserRole;
}

export function Search({ userRole }: SearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    nom: "",
    email: "",
    filiere: [],
    niveau: [],
    scoreMin: 0,
    scoreMax: 100,
    statut: [],
    typeActivite: [],
    titreActivite: "",
    periodeDebut: "",
    periodeFin: "",
  });

  const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [availableFilters, setAvailableFilters] = useState({
    filieres: [],
    niveaux: [],
    statuts: [],
    typesActivite: [],
  });

  useEffect(() => {
    loadAvailableFilters();
  }, []);

  const loadAvailableFilters = async () => {
    const response = await searchService.getFilters();
    if (response.success) {
      setAvailableFilters(response.data);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      // Préparer les filtres pour l'API
      const searchFilters = {
        nom: filters.nom || undefined,
        email: filters.email || undefined,
        filiere: filters.filiere.length > 0 ? filters.filiere : undefined,
        niveau: filters.niveau.length > 0 ? filters.niveau : undefined,
        scoreMin: filters.scoreMin,
        scoreMax: filters.scoreMax,
        statut: filters.statut.length > 0 ? filters.statut : undefined,
        typeActivite:
          filters.typeActivite.length > 0 ? filters.typeActivite : undefined,
        periodeDebut: filters.periodeDebut || undefined,
        periodeFin: filters.periodeFin || undefined,
      };

      console.log("Recherche avec filtres:", searchFilters);

      const response = await searchService.searchStudents(searchFilters);

      if (response.success) {
        const results = Array.isArray(response.data) ? response.data : [];
        console.log("Résultats reçus:", results);
        setSearchResults(results);
      } else {
        console.error("Erreur de recherche:", response.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      nom: "",
      email: "",
      filiere: [],
      niveau: [],
      scoreMin: 0,
      scoreMax: 100,
      statut: [],
      typeActivite: [],
      titreActivite: "",
      periodeDebut: "",
      periodeFin: "",
    });
    setSearchResults([]);
    setHasSearched(false);
    setSelectedStudents([]);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiSelectChange = (
    key: keyof SearchFilters,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter((item) => item !== value),
    }));
  };

  if (userRole !== "led_team" && userRole !== "supervisor") {
    return (
      <div className="p-6">
        <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-4" />
        <p className="text-center text-muted-foreground">
          Cette fonctionnalité est réservée à l'équipe LED et aux superviseurs.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Recherche Multicritère
        </h1>
        <p className="text-muted-foreground">
          Recherchez et filtrez les étudiants selon vos critères spécifiques
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau de filtres */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Critères de Recherche
              </CardTitle>
              <CardDescription>
                Affinez votre recherche avec les filtres ci-dessous
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recherche textuelle */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de l'étudiant</Label>
                  <Input
                    id="nom"
                    placeholder="Saisir le nom... (ex: ILBOUDO)"
                    value={filters.nom}
                    onChange={(e) => handleFilterChange("nom", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Saisir l'email..."
                    value={filters.email}
                    onChange={(e) =>
                      handleFilterChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Filières */}
              <div className="space-y-3">
                <Label>Filières d'études</Label>
                <div className="space-y-2">
                  {(availableFilters.filieres.length > 0
                    ? availableFilters.filieres
                    : [
                        "Informatique",
                        "Génie Civil",
                        "Électronique",
                        "Énergies Renouvelables",
                      ]
                  ).map((filiere) => (
                    <div key={filiere} className="flex items-center space-x-2">
                      <Checkbox
                        id={`filiere-${filiere}`}
                        checked={filters.filiere.includes(filiere)}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange(
                            "filiere",
                            filiere,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`filiere-${filiere}`} className="text-sm">
                        {filiere}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Niveaux */}
              <div className="space-y-3">
                <Label>Niveaux d'études</Label>
                <div className="space-y-2">
                  {(availableFilters.niveaux.length > 0
                    ? availableFilters.niveaux
                    : ["L1", "L2", "L3", "M1", "M2"]
                  ).map((niveau) => (
                    <div key={niveau} className="flex items-center space-x-2">
                      <Checkbox
                        id={`niveau-${niveau}`}
                        checked={filters.niveau.includes(niveau)}
                        onCheckedChange={(checked) =>
                          handleMultiSelectChange(
                            "niveau",
                            niveau,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`niveau-${niveau}`} className="text-sm">
                        {niveau}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score */}
              <div className="space-y-3">
                <Label>Score LED Global</Label>
                <div className="px-3">
                  <Slider
                    value={[filters.scoreMin, filters.scoreMax]}
                    onValueChange={(value) => {
                      handleFilterChange("scoreMin", value[0]);
                      handleFilterChange("scoreMax", value[1]);
                    }}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{filters.scoreMin}</span>
                    <span>{filters.scoreMax}</span>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-2 pt-4">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="w-4 h-4 mr-2" />
                      Lancer la recherche
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Résultats de recherche
                </CardTitle>
                <CardDescription>
                  {hasSearched
                    ? `${searchResults.length} étudiant(s) trouvé(s)`
                    : "Lancez une recherche pour afficher les résultats"}
                </CardDescription>
              </div>
              {searchResults.length > 0 && (
                <ExportButtons
                  searchResults={searchResults}
                  selectedStudents={selectedStudents}
                />
              )}
            </CardHeader>
            <CardContent>
              {isSearching && (
                <div className="text-center py-6">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recherche en cours...
                  </p>
                </div>
              )}

              {!isSearching && hasSearched && searchResults.length === 0 && (
                <div className="text-center py-6">
                  <AlertTriangle className="w-6 h-6 mx-auto text-red-500" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucun étudiant trouvé avec les critères spécifiés.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Vérifiez l'orthographe ou réduisez les filtres.
                  </p>
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <SearchResultsTable
                  results={searchResults || []}
                  selectedStudents={selectedStudents || []}
                  onSelectionChange={setSelectedStudents}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
