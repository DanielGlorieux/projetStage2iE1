import React, { useState, useEffect } from "react";
import {
  supervisorActivityService,
  type CreateActivityData,
  type SupervisorActivity,
} from "../services/supervisorActivityService";
import { apiClient } from "../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  email: string;
  filiere?: string;
  niveau?: string;
}

export function SupervisorActivityForm() {
  const [formData, setFormData] = useState<CreateActivityData>({
    title: "",
    type: "entrepreneuriat",
    description: "",
    deadline: "",
    studentIds: [],
    objectives: [],
    estimatedHours: 0,
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [myActivities, setMyActivities] = useState<SupervisorActivity[]>([]);
  const [newObjective, setNewObjective] = useState("");

  useEffect(() => {
    loadStudents();
    loadMyActivities();
  }, []);

  const loadStudents = async () => {
    const response = await apiClient.get<Student[]>("/users?role=student");
    if (response.success && response.data) {
      setStudents(response.data);
    }
  };

  const loadMyActivities = async () => {
    const response = await supervisorActivityService.getMyActivities();
    if (response.success && response.data) {
      setMyActivities(response.data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.studentIds.length === 0) {
      toast.error("Sélectionnez au moins un étudiant");
      return;
    }

    setLoading(true);
    const response = await supervisorActivityService.createActivity(formData);

    if (response.success) {
      toast.success(`Activité créée et assignée à ${formData.studentIds.length} étudiant(s)`);
      setFormData({
        title: "",
        type: "entrepreneuriat",
        description: "",
        deadline: "",
        studentIds: [],
        objectives: [],
        estimatedHours: 0,
      });
      loadMyActivities();
    } else {
      toast.error(response.error || "Erreur lors de la création");
    }
    setLoading(false);
  };

  const handleStudentToggle = (studentId: string) => {
    setFormData({
      ...formData,
      studentIds: formData.studentIds.includes(studentId)
        ? formData.studentIds.filter((id) => id !== studentId)
        : [...formData.studentIds, studentId],
    });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        objectives: [...(formData.objectives || []), newObjective],
      });
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives?.filter((_, i) => i !== index),
    });
  };

  const handleSendReminder = async (activityId: string) => {
    const response = await supervisorActivityService.sendReminder(activityId);
    if (response.success) {
      toast.success("Rappel envoyé avec succès");
    } else {
      toast.error("Erreur lors de l'envoi du rappel");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer une Activité</CardTitle>
          <CardDescription>
            Créez une activité et assignez-la aux étudiants sélectionnés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Ex: Projet Innovation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type d'activité *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrepreneuriat">Entrepreneuriat</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Date limite *</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Heures estimées</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  value={formData.estimatedHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedHours: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Ex: 20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={4}
                placeholder="Décrivez l'activité..."
              />
            </div>

            <div className="space-y-2">
              <Label>Objectifs</Label>
              <div className="flex gap-2">
                <Input
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Ajouter un objectif..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                />
                <Button type="button" onClick={addObjective} variant="outline">
                  Ajouter
                </Button>
              </div>
              {formData.objectives && formData.objectives.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.objectives.map((obj, index) => (
                    <Badge key={index} variant="secondary">
                      {obj}
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="ml-2 text-xs"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Étudiants à assigner *</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={formData.studentIds.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <label
                      htmlFor={`student-${student.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {student.name} ({student.email})
                      {student.filiere && (
                        <span className="text-muted-foreground ml-2">
                          - {student.filiere} {student.niveau}
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.studentIds.length} étudiant(s) sélectionné(s)
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Création..." : "Créer et Assigner l'Activité"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Liste des activités créées */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Activités Créées</CardTitle>
        </CardHeader>
        <CardContent>
          {myActivities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune activité créée
            </p>
          ) : (
            <div className="space-y-4">
              {myActivities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Assigné à: {activity.user.name}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge>{activity.type}</Badge>
                          <Badge variant="outline">{activity.status}</Badge>
                        </div>
                        <p className="text-sm mt-2">
                          Deadline:{" "}
                          {new Date(activity.deadline).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendReminder(activity.id)}
                        disabled={activity.status === "evaluated"}
                      >
                        Envoyer un rappel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
