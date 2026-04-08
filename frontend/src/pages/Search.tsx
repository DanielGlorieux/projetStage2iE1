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
