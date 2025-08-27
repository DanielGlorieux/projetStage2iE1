import React from "react";
//import { SearchFilters } from "../../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import {
  Briefcase,
  Lightbulb,
  Monitor,
  Clock,
  CheckCircle,
  Send,
  Award,
  X,
} from "lucide-react";
//import { FILIERES, NIVEAUX, ACTIVITY_TYPES } from "../../constants/activityTypes";
import { Filter, Search as SearchIcon, RefreshCw } from "lucide-react";

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

interface SearchFiltersPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearching: boolean;
}

const ACTIVITY_TYPES = [
  {
    value: "entrepreneuriat",
    label: "Entrepreneuriat & Innovation",
    icon: Briefcase,
    color: "bg-blue-500",
    description:
      "Projets d'innovation, création d'entreprise, développement de produits",
  },
  {
    value: "leadership",
    label: "Leadership & Management",
    icon: Lightbulb,
    color: "bg-green-500",
    description:
      "Formation en leadership, gestion d'équipe, conduite du changement",
  },
  {
    value: "digital",
    label: "Transformation Digitale",
    icon: Monitor,
    color: "bg-purple-500",
    description: "Technologies numériques, développement, innovation digitale",
  },
];

const FILIERES = [
  "Informatique",
  "Génie Civil",
  "Électronique",
  "Énergies Renouvelables",
  "Génie Rural et Environnement",
];

const NIVEAUX = ["Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2"];

export function SearchFiltersPanel({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  isSearching,
}: SearchFiltersPanelProps) {
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleMultiSelectChange = (
    key: keyof SearchFilters,
    value: string,
    checked: boolean
  ) => {
    const currentArray = filters[key] as string[];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter((item) => item !== value);
    onFiltersChange({ ...filters, [key]: newArray });
  };

  return (
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
              onChange={(e) => handleFilterChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titreActivite">Titre d'activité</Label>
            <Input
              id="titreActivite"
              placeholder="Rechercher dans les activités..."
              value={filters.titreActivite}
              onChange={(e) =>
                handleFilterChange("titreActivite", e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Filières d'études</Label>
          <div className="space-y-2">
            {FILIERES.map((filiere) => (
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
            {NIVEAUX.map((niveau) => (
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
          <Label>Types d'activités</Label>
          <div className="space-y-2">
            {ACTIVITY_TYPES.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.typeActivite.includes(type.value)}
                  onCheckedChange={(checked) =>
                    handleMultiSelectChange(
                      "typeActivite",
                      type.value,
                      checked as boolean
                    )
                  }
                />
                <Label htmlFor={`type-${type.value}`} className="text-sm">
                  {type.label}
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
              <div key={statut.value} className="flex items-center space-x-2">
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
                <Label htmlFor={`statut-${statut.value}`} className="text-sm">
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
              onChange={(e) => handleFilterChange("periodeFin", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <Button onClick={onSearch} disabled={isSearching} className="w-full">
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

          <Button variant="outline" onClick={onReset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
