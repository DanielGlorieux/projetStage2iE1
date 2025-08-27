import React from "react";
//import { StudentResult } from "../../types";
import { Button } from "../components/ui/button";
import { exportToCSV, exportToPDF, exportToExcel } from "../utils/export";
import { Download, FileSpreadsheet, FileImage, FileText } from "lucide-react";

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

interface ExportButtonsProps {
  searchResults: StudentResult[];
  selectedStudents: string[];
}

export function ExportButtons({
  searchResults,
  selectedStudents,
}: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToCSV(searchResults, selectedStudents)}
      >
        <FileText className="w-4 h-4 mr-2" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToExcel(searchResults, selectedStudents)}
      >
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToPDF(searchResults, selectedStudents)}
      >
        <FileImage className="w-4 h-4 mr-2" />
        PDF
      </Button>
    </div>
  );
}
