import React, { useState } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";

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
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    const dataToExport =
      selectedStudents.length > 0
        ? searchResults.filter((student) =>
            selectedStudents.includes(student.id)
          )
        : searchResults;

    setIsExporting(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("token");

      // Envoyer les IDs des étudiants à exporter
      const studentIds = dataToExport.map((student) => student.id);

      const response = await fetch(`${API_BASE_URL}/search/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          studentIds,
          format 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur d'export: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `recherche_etudiants_${timestamp}.${format === 'excel' ? 'xlsx' : format}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`Export ${format} réussi: ${dataToExport.length} étudiants`);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alert("Erreur lors de l'export. Veuillez réessayer.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Exporter
              {selectedStudents.length > 0 && (
                <span className="ml-1 text-xs">({selectedStudents.length})</span>
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")} disabled={isExporting}>
          <FileText className="w-4 h-4 mr-2" />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")} disabled={isExporting}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")} disabled={isExporting}>
          <File className="w-4 h-4 mr-2" />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
