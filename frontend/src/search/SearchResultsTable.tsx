import React from "react";
//import { StudentResult } from "../../types";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Eye,
  Mail,
  Phone,
  Award,
  GraduationCap,
  TrendingUp,
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
  activitesRecentes: Array<{
    titre: string;
    type: string;
    score?: number;
    dateSubmission: string;
  }>;
}

interface SearchResultsTableProps {
  results: StudentResult[];
  selectedStudents: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function SearchResultsTable({
  results,
  selectedStudents,
  onSelectionChange,
}: SearchResultsTableProps) {
  const toggleStudentSelection = (studentId: string) => {
    onSelectionChange(
      selectedStudents.includes(studentId)
        ? selectedStudents.filter((id) => id !== studentId)
        : [...selectedStudents, studentId]
    );
  };

  const selectAllStudents = () => {
    onSelectionChange(results.map((student) => student.id));
  };

  const deselectAllStudents = () => {
    onSelectionChange([]);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            selectedStudents.length === results.length && results.length > 0
          }
          onCheckedChange={(checked) => {
            if (checked) {
              selectAllStudents();
            } else {
              deselectAllStudents();
            }
          }}
        />
        <span className="text-sm text-muted-foreground">
          {selectedStudents.length > 0
            ? `${selectedStudents.length} étudiant(s) sélectionné(s)`
            : "Sélectionner tout"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sélection</TableHead>
              <TableHead>Étudiant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Filière</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Score LED</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Progression</TableHead>
              <TableHead>Compétences</TableHead>
              <TableHead>Activités récentes</TableHead>
              <TableHead>Dernier accès</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudentSelection(student.id)}
                  />
                </TableCell>
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
                  <Badge variant="outline">{student.scoreGlobal}/100</Badge>
                </TableCell>
                <TableCell>{getStatutBadge(student.statut)}</TableCell>
                <TableCell>
                  <div className="w-32">
                    <Progress
                      value={
                        (student.activitesCompletes / student.activitesTotal) *
                        100
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      {student.activitesCompletes}/{student.activitesTotal}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-yellow-500" />
                      Entrepreneuriat: {student.competences.entrepreneuriat}%
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
                <TableCell>
                  <div className="space-y-1 text-xs max-w-48">
                    {student.activitesRecentes
                      .slice(0, 2)
                      .map((activite, index) => (
                        <div key={index} className="truncate">
                          <span className="font-medium">{activite.titre}</span>
                          {activite.score && (
                            <span className="text-muted-foreground ml-1">
                              ({activite.score}/20)
                            </span>
                          )}
                        </div>
                      ))}
                    {student.activitesRecentes.length > 2 && (
                      <div className="text-muted-foreground">
                        +{student.activitesRecentes.length - 2} autres
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {student.dernierAcces}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
