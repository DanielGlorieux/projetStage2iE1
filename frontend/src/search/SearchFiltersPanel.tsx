import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { SearchFilters } from "../services/searchService";

interface SearchFiltersPanelProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  availableFilters: {
    filieres: string[];
    niveaux: string[];
    statuts: string[];
    typesActivite: string[];
  };
  isSearching?: boolean;
}

export function SearchFiltersPanel({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  availableFilters,
  isSearching = false,
}: SearchFiltersPanelProps) {
  const handleCheckboxChange = (
    field: "filiere" | "niveau" | "statut" | "typeActivite",
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[field] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v: string) => v !== value);
    onFilterChange({ ...filters, [field]: newValues });
  };

  return (
    <Card className="border-2 shadow-sm">
      <CardContent className="pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Filtres de recherche</h3>
        </div>

        {/* Nom et Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'étudiant</Label>
            <Input
              id="nom"
              placeholder="Ex: Dupont..."
              value={filters.nom || ""}
              onChange={(e) => onFilterChange({ ...filters, nom: e.target.value })}
              className="transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ex: etudiant@2ie.org..."
              value={filters.email || ""}
              onChange={(e) => onFilterChange({ ...filters, email: e.target.value })}
              className="transition-all"
            />
          </div>
        </div>

        {/* Recherche par mots-clés */}
        <div className="space-y-2">
          <Label htmlFor="keywords" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Mots-clés des activités
          </Label>
          <Input
            id="keywords"
            placeholder="Ex: innovation, startup, leadership..."
            value={filters.keywords || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, keywords: e.target.value })
            }
            className="transition-all"
          />
          <p className="text-xs text-muted-foreground">
            Recherche dans les titres, descriptions et mots-clés des activités
          </p>
        </div>

        {/* Plage de scores */}
        <div className="space-y-2">
          <Label>Plage de scores</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="number"
                placeholder="Min (0)"
                min="0"
                max="100"
                value={filters.scoreMin ?? ""}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    scoreMin: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="transition-all"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max (100)"
                min="0"
                max="100"
                value={filters.scoreMax ?? ""}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    scoreMax: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="transition-all"
              />
            </div>
          </div>
          {(filters.scoreMin !== undefined || filters.scoreMax !== undefined) && (
            <p className="text-xs text-muted-foreground">
              Score: {filters.scoreMin || 0} - {filters.scoreMax || 100}
            </p>
          )}
        </div>

        {/* Filière */}
        {availableFilters.filieres.length > 0 && (
          <div className="space-y-2">
            <Label>Filière</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {availableFilters.filieres.map((filiere) => (
                <div key={filiere} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filiere-${filiere}`}
                    checked={filters.filiere?.includes(filiere)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("filiere", filiere, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`filiere-${filiere}`}
                    className="text-sm cursor-pointer hover:text-primary transition-colors"
                  >
                    {filiere}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Niveau */}
        {availableFilters.niveaux.length > 0 && (
          <div className="space-y-2">
            <Label>Niveau</Label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.niveaux.map((niveau) => (
                <div key={niveau} className="flex items-center space-x-2">
                  <Checkbox
                    id={`niveau-${niveau}`}
                    checked={filters.niveau?.includes(niveau)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("niveau", niveau, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`niveau-${niveau}`}
                    className="text-sm cursor-pointer hover:text-primary transition-colors"
                  >
                    {niveau}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Type d'activité */}
        {availableFilters.typesActivite.length > 0 && (
          <div className="space-y-2">
            <Label>Type d'activité</Label>
            <div className="flex flex-wrap gap-3">
              {availableFilters.typesActivite.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.typeActivite?.includes(type)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("typeActivite", type, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm capitalize cursor-pointer hover:text-primary transition-colors"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statut */}
        {availableFilters.statuts.length > 0 && (
          <div className="space-y-2">
            <Label>Statut des activités</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableFilters.statuts.map((statut) => (
                <div key={statut} className="flex items-center space-x-2">
                  <Checkbox
                    id={`statut-${statut}`}
                    checked={filters.statut?.includes(statut)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("statut", statut, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`statut-${statut}`}
                    className="text-sm capitalize cursor-pointer hover:text-primary transition-colors"
                  >
                    {statut.replace("_", " ")}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Période */}
        <div className="space-y-2">
          <Label>Période</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="date"
                value={filters.periodeDebut || ""}
                onChange={(e) =>
                  onFilterChange({ ...filters, periodeDebut: e.target.value })
                }
                className="transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">Date de début</p>
            </div>
            <div>
              <Input
                type="date"
                value={filters.periodeFin || ""}
                onChange={(e) =>
                  onFilterChange({ ...filters, periodeFin: e.target.value })
                }
                className="transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">Date de fin</p>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={onSearch}
            disabled={isSearching}
            className="flex-1 transition-all hover:scale-105"
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? "Recherche..." : "Rechercher"}
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            disabled={isSearching}
            className="transition-all hover:scale-105"
          >
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
