import React, { useState, useEffect } from "react";
import { UserRole } from "../App";
import { userService } from "../services/users";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  User,
  Edit,
  Save,
  X,
  GraduationCap,
  Mail,
  Building,
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ProfileProps {
  userRole: UserRole;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  filiere?: string;
  niveau?: string;
  createdAt: string;
  updatedAt: string;
}

const FILIERES = [
  "Génie Civil",
  "Informatique",
  "Électronique",
  "Mécanique",
  "Architecture",
  "Eau et Assainissement",
  "Génie Industriel",
  "Télécommunications",
];

const NIVEAUX = ["L1", "L2", "L3", "M1", "M2", "Doctorat"];

export function Profile({ userRole }: ProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await userService.getProfile();

      if (response.success && response.data) {
        setProfile(response.data);
        setEditedProfile(response.data);
      } else {
        setError("Erreur lors du chargement du profil");
      }
    } catch (err) {
      setError("Impossible de charger le profil");
      console.error("Erreur chargement profil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      setSaving(true);
      setError("");

      const response = await userService.updateProfile({
        name: editedProfile.name,
        filiere: editedProfile.filiere,
        niveau: editedProfile.niveau,
      });

      if (response.success) {
        setProfile(editedProfile);
        setIsEditing(false);
        setSuccess("Profil mis à jour avec succès !");

        // Mettre à jour le localStorage si nécessaire
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          const updatedUser = {
            ...user,
            name: editedProfile.name,
            filiere: editedProfile.filiere,
            niveau: editedProfile.niveau,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        setError(response.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError("Impossible de mettre à jour le profil");
      console.error("Erreur mise à jour profil:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        setSuccess("Mot de passe modifié avec succès !");
        setShowPasswordDialog(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.error || "Erreur lors du changement de mot de passe");
      }
    } catch (err) {
      setError("Impossible de changer le mot de passe");
      console.error("Erreur changement mot de passe:", err);
    } finally {
      setSaving(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student":
        return "Étudiant LED";
      case "led_team":
        return "Équipe LED";
      case "supervisor":
        return "Superviseur";
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "led_team":
        return "bg-green-100 text-green-800 border-green-200";
      case "supervisor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Impossible de charger le profil
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et paramètres
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        )}
      </div>

      {/* Messages d'état */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Informations Générales</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Carte principale du profil */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-lg font-bold">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.name}
                  </h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <Badge className={`mt-2 ${getRoleBadgeColor(profile.role)}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {getRoleLabel(profile.role)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom complet */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom complet
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProfile?.name || ""}
                      onChange={(e) =>
                        setEditedProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                name: e.target.value,
                              }
                            : null
                        )
                      }
                      placeholder="Votre nom complet"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Adresse email
                  </Label>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-xs text-muted-foreground">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                {/* Filière */}
                {userRole === "student" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="filiere"
                      className="flex items-center gap-2"
                    >
                      <Building className="h-4 w-4" />
                      Filière d'études
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editedProfile?.filiere || ""}
                        onValueChange={(value) =>
                          setEditedProfile((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  filiere: value,
                                }
                              : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre filière" />
                        </SelectTrigger>
                        <SelectContent>
                          {FILIERES.map((filiere) => (
                            <SelectItem key={filiere} value={filiere}>
                              {filiere}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profile.filiere || "Non renseigné"}
                      </p>
                    )}
                  </div>
                )}

                {/* Niveau */}
                {userRole === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="niveau" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Niveau d'études
                    </Label>
                    {isEditing ? (
                      <Select
                        value={editedProfile?.niveau || ""}
                        onValueChange={(value) =>
                          setEditedProfile((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  niveau: value,
                                }
                              : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {NIVEAUX.map((niveau) => (
                            <SelectItem key={niveau} value={niveau}>
                              {niveau}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {profile.niveau || "Non renseigné"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Informations de compte */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations de compte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Compte créé le :</span>{" "}
                    {formatDate(profile.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Dernière modification :</span>{" "}
                    {formatDate(profile.updatedAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte et changez votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Mot de passe</h4>
                  <p className="text-sm text-muted-foreground">
                    Dernière modification : {formatDate(profile.updatedAt)}
                  </p>
                </div>
                <Button
                  onClick={() => setShowPasswordDialog(true)}
                  variant="outline"
                >
                  Changer le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog changement de mot de passe */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre mot de passe actuel et le nouveau mot de passe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
            >
              Annuler
            </Button>
            <Button onClick={handlePasswordChange} disabled={saving}>
              {saving ? "Modification..." : "Changer le mot de passe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
