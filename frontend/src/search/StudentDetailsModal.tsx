import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { userService } from "../services/users";
import { Calendar, Mail, GraduationCap, Activity, X } from "lucide-react";
import { Button } from "../components/ui/button";

interface StudentDetailsModalProps {
  studentId: string | null;
  open: boolean;
  onClose: () => void;
}

export function StudentDetailsModal({
  studentId,
  open,
  onClose,
}: StudentDetailsModalProps) {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && studentId) {
      setLoading(true);
      userService.getUserById(studentId).then((res) => {
        setStudent(res.data);
        setLoading(false);
      });
    }
  }, [studentId, open]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Détails de l'étudiant</DialogTitle>
        </DialogHeader>
        {loading && <div>Chargement...</div>}
        {!loading && student && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-lg">{student.name}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {student.email}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  {student.filiere || "Non spécifiée"}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  {student.niveau || "Non spécifié"}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(student.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Score global</div>
              <Progress
                value={student.stats?.globalScore || 0}
                className="w-full h-2"
              />
              <div className="text-sm mt-1">
                {student.stats?.globalScore || 0}/100
              </div>
            </div>
            <div>
              <div className="font-medium mb-2">Compétences</div>
              <div className="flex gap-4">
                <Badge>
                  Entrepreneuriat: {student.stats?.scores?.entrepreneuriat || 0}
                </Badge>
                <Badge>
                  Leadership: {student.stats?.scores?.leadership || 0}
                </Badge>
                <Badge>Digital: {student.stats?.scores?.digital || 0}</Badge>
              </div>
            </div>
            <Button onClick={onClose} className="mt-4 w-full">
              <X className="w-4 h-4 mr-2" />
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
