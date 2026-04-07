import React, { useState, useEffect } from "react";
import { searchService, SearchFilters, StudentResult } from "../services/searchService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { SearchFiltersPanel } from "../search/SearchFiltersPanel";
import { SearchResultsTable } from "../search/SearchResultsTable";
import { ExportButtons } from "../search/ExportButtons";
import {
  RefreshCw,
  AlertTriangle,
  Users,
  Search as SearchIcon,
} from "lucide-react";
import { toast } from "sonner";

type UserRole =
  | "student"
  | "led_team"
  | "supervisor"
  | "super_admin_entrepreneuriat"
  | "super_admin_leadership"
  | "super_admin_digital";

interface SearchProps {
  userRole: UserRole;
}

export function Search({ userRole }: SearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    nom: "",
    email: "",
    filiere: [],
    niveau: [],
    scoreMin: undefined,
    scoreMax: undefined,
    statut: [],
    typeActivite: [],
    periodeDebut: "",
    periodeFin: "",
    keywords: "",
  });

  const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [availableFilters, setAvailableFilters] = useState({
    filieres: [] as string[],
    niveaux: [] as string[],
    statuts: [] as string[],
    typesActivite: [] as string[],
  });

  useEffect(() => {
    loadAvailableFilters();
  }, []);

  const loadAvailableFilters = async () => {
    const response = await searchService.getFilters();
    if (response.success && response.data) {
      setAvailableFilters(response.data);
    } else {
      // Valeurs par défaut si l'API échoue
      setAvailableFilters({
        filieres: ["Informatique", "Génie Civil", "Électronique", "Énergies Renouvelables"],
        niveaux: ["L1", "L2", "L3", "M1", "M2"],
        statuts: ["planned", "in_progress", "completed", "submitted", "evaluated"],
        typesActivite: ["entrepreneuriat", "leadership", "digital"],
      });
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await searchService.searchStudents(filters);

      if (response.success && response.data) {
        const results = Array.isArray(response.data) ? response.data : [];
        setSearchResults(results);

        if (results.length === 0) {
          toast.info("Aucun étudiant trouvé avec ces critères");
        } else {
          toast.success(`${results.length} étudiant(s) trouvé(s)`);
        }
      } else {
        toast.error("Erreur lors de la recherche");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast.error("Une erreur est survenue lors de la recherche");
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
      scoreMin: undefined,
      scoreMax: undefined,
      statut: [],
      typeActivite: [],
      periodeDebut: "",
      periodeFin: "",
      keywords: "",
    });
    setSearchResults([]);
    setHasSearched(false);
    setSelectedStudents([]);
    toast.info("Filtres réinitialisés");
  };

  // Vérifier les permissions
  const hasSearchAccess = ["led_team", "supervisor", "super_admin_entrepreneuriat", "super_admin_leadership", "super_admin_digital"].includes(userRole);

  if (!hasSearchAccess) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Accès restreint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cette fonctionnalité est réservée à l'équipe LED, aux superviseurs et aux super administrateurs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <SearchIcon className="h-7 w-7" />
          Recherche Avancée
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Recherchez et filtrez les étudiants selon plusieurs critères - nom, email, filière, scores, activités et mots-clés
        </p>
      </div>

      {/* Layout responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Panneau de filtres - Sticky sur desktop */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <SearchFiltersPanel
              filters={filters}
              onFilterChange={setFilters}
              onSearch={handleSearch}
              onReset={handleResetFilters}
              availableFilters={availableFilters}
              isSearching={isSearching}
            />
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-3">
          <Card className="shadow-sm border-2">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Users className="h-5 w-5" />
                    Résultats de recherche
                  </CardTitle>
                  <CardDescription>
                    {hasSearched
                      ? `${searchResults.length} étudiant(s) trouvé(s)`
                      : "Utilisez les filtres pour lancer une recherche"}
                  </CardDescription>
                </div>
                {searchResults.length > 0 && (
                  <ExportButtons
                    searchResults={searchResults}
                    selectedStudents={selectedStudents}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* État: Recherche en cours */}
              {isSearching && (
                <div className="text-center py-12 animate-in fade-in duration-200">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary" />
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    Recherche en cours...
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Veuillez patienter
                  </p>
                </div>
              )}

              {/* État: Aucun résultat */}
              {!isSearching && hasSearched && searchResults.length === 0 && (
                <div className="text-center py-12 animate-in fade-in duration-200">
                  <div className="bg-orange-50 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Aucun étudiant trouvé</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Aucun étudiant ne correspond aux critères spécifiés.
                    Essayez de modifier vos filtres ou de réduire le nombre de critères.
                  </p>
                </div>
              )}

              {/* État: Pas encore cherché */}
              {!isSearching && !hasSearched && (
                <div className="text-center py-12 animate-in fade-in duration-200">
                  <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <SearchIcon className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Prêt à rechercher</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Sélectionnez vos critères de recherche dans le panneau de filtres,
                    puis cliquez sur "Rechercher" pour afficher les résultats.
                  </p>
                </div>
              )}

              {/* État: Résultats disponibles */}
              {!isSearching && searchResults.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <SearchResultsTable
                    results={searchResults}
                    selectedStudents={selectedStudents}
                    onSelectionChange={setSelectedStudents}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
