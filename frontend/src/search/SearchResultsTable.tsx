import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Checkbox } from "../components/ui/checkbox";
import { StudentDetailsModal } from "./StudentDetailsModal";
import {
  Eye,
  Mail,
  User,
  GraduationCap,
  TrendingUp,
  Calendar,
  Activity,
} from "lucide-react";

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

interface SearchResultsTableProps {
  results: StudentResult[];
  selectedStudents: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export function SearchResultsTable({
  results = [], // ✅ Valeur par défaut pour éviter l'erreur
  selectedStudents = [], // ✅ Valeur par défaut
  onSelectionChange,
}: SearchResultsTableProps) {
  // ✅ Vérification de sécurité
  if (!Array.isArray(results)) {
    console.warn("SearchResultsTable: results is not an array", results);
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">
          Erreur de format des données
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-6">
        <User className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Aucun étudiant trouvé</p>
      </div>
    );
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(results.map((student) => student.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedStudents, studentId]);
    } else {
      onSelectionChange(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const getStatusBadge = (student: StudentResult) => {
    const completionRate =
      student.activitesTotal > 0
        ? (student.activitesCompletes / student.activitesTotal) * 100
        : 0;

    if (completionRate >= 80) {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    } else if (completionRate >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR");
    } catch {
      return "N/A";
    }
  };

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedStudentId, setSelectedStudentId] = React.useState<
    string | null
  >(null);

  const isAllSelected =
    results.length > 0 && selectedStudents.length === results.length;
  const isIndeterminate =
    selectedStudents.length > 0 && selectedStudents.length < results.length;

  return (
    <div className="space-y-4">
      {/* Header avec sélection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            // @ts-ignore - Propriété ref de Radix UI
            ref={null}
            onCheckedChange={handleSelectAll}
            aria-label="Sélectionner tous les étudiants"
          />
          <span className="text-sm text-muted-foreground">
            {selectedStudents.length > 0
              ? `${selectedStudents.length} étudiant(s) sélectionné(s)`
              : "Sélectionner tout"}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          {results.length} résultat(s)
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <span className="sr-only">Sélection</span>
              </TableHead>
              <TableHead>Étudiant</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Score Global</TableHead>
              <TableHead>Compétences</TableHead>
              <TableHead>Activités</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernier Accès</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/50">
                {/* Checkbox de sélection */}
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={(checked) =>
                      handleSelectStudent(student.id, checked as boolean)
                    }
                    aria-label={`Sélectionner ${student.nom}`}
                  />
                </TableCell>

                {/* Informations étudiant */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-sm">
                        {student.nom
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{student.nom}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {student.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Formation */}
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {student.filiere || "Non spécifiée"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {student.niveau || "Non spécifié"}
                    </p>
                  </div>
                </TableCell>

                {/* Score Global */}
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${getScoreColor(
                          student.scoreGlobal
                        )}`}
                      >
                        {student.scoreGlobal || 0}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /100
                      </span>
                    </div>
                    <Progress
                      value={student.scoreGlobal || 0}
                      className="w-20 h-2"
                    />
                  </div>
                </TableCell>

                {/* Compétences */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Entrepreneur</span>
                      <span
                        className={getScoreColor(
                          student.competences?.entrepreneuriat || 0
                        )}
                      >
                        {student.competences?.entrepreneuriat || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Leadership</span>
                      <span
                        className={getScoreColor(
                          student.competences?.leadership || 0
                        )}
                      >
                        {student.competences?.leadership || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Digital</span>
                      <span
                        className={getScoreColor(
                          student.competences?.digital || 0
                        )}
                      >
                        {student.competences?.digital || 0}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Activités */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span className="text-sm font-medium">
                        {student.activitesCompletes || 0}/
                        {student.activitesTotal || 0}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {student.activitesTotal > 0
                        ? Math.round(
                            ((student.activitesCompletes || 0) /
                              student.activitesTotal) *
                              100
                          )
                        : 0}
                      % complétées
                    </div>
                  </div>
                </TableCell>

                {/* Statut */}
                <TableCell>{getStatusBadge(student)}</TableCell>

                {/* Dernier Accès */}
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(student.dernierAcces)}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setDetailsOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de détails étudiant */}
      <StudentDetailsModal
        studentId={selectedStudentId}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />

      {/* Footer avec informations de sélection */}
      {selectedStudents.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedStudents.length} étudiant(s) sélectionné(s)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectionChange([])}
          >
            Désélectionner tout
          </Button>
        </div>
      )}
    </div>
  );
}
