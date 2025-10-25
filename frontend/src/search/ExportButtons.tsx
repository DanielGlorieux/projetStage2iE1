import React from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";

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

interface ExportButtonsProps {
  searchResults: StudentResult[];
  selectedStudents: string[];
}

export function ExportButtons({
  searchResults,
  selectedStudents,
}: ExportButtonsProps) {
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    const dataToExport =
      selectedStudents.length > 0
        ? searchResults.filter((student) =>
            selectedStudents.includes(student.id)
          )
        : searchResults;

    // TODO: Implémenter l'export via le service
    console.log(`Export ${format} de ${dataToExport.length} étudiants`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exporter
          {selectedStudents.length > 0 && (
            <span className="ml-1 text-xs">({selectedStudents.length})</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="w-4 h-4 mr-2" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <File className="w-4 h-4 mr-2" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
