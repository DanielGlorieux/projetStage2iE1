import React, { useState } from "react";
import { UserRole } from "../App";
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
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Settings as SettingsIcon,
  Users,
  Bell,
  Database,
  Shield,
  Mail,
  Clock,
  FileText,
  Palette,
} from "lucide-react";

interface SettingsProps {
  userRole: UserRole;
}

export function Settings({ userRole }: SettingsProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true,
    deadlines: true,
    newScholars: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    autoReports: true,
    dataRetention: "24",
    backupFrequency: "daily",
    maintenanceMode: false,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Paramètres</h1>
        <p className="text-muted-foreground">
          Configuration de la plateforme LED
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="auto">Automatique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Formats d'export
              </CardTitle>
              <CardDescription>
                Configuration des exports de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Format par défaut</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="include-metadata" defaultChecked />
                <Label htmlFor="include-metadata">
                  Inclure les métadonnées
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="compress-files" />
                <Label htmlFor="compress-files">Compresser les fichiers</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Préférences de notification
              </CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez être averti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <div className="text-sm text-muted-foreground">
                    Recevez les notifications importantes par email
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications push</Label>
                  <div className="text-sm text-muted-foreground">
                    Notifications dans le navigateur
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports automatiques</Label>
                  <div className="text-sm text-muted-foreground">
                    Recevoir les rapports générés automatiquement
                  </div>
                </div>
                <Switch
                  checked={notifications.reports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, reports: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Échéances importantes</Label>
                  <div className="text-sm text-muted-foreground">
                    Alertes pour les dates limites
                  </div>
                </div>
                <Switch
                  checked={notifications.deadlines}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, deadlines: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>Gérez les accès et permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rôles disponibles</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h4>Étudiant</h4>
                      <p className="text-sm text-muted-foreground">
                        Accès aux données personnelles
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <h4>Équipe LED</h4>
                      <p className="text-sm text-muted-foreground">
                        Gestion complète des boursiers
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <h4>Encadrant</h4>
                      <p className="text-sm text-muted-foreground">
                        Supervision et validation
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Paramètres d'inscription</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-approve" />
                  <Label htmlFor="auto-approve">Approbation automatique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="email-verification" defaultChecked />
                  <Label htmlFor="email-verification">
                    Vérification email requise
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Configuration système
              </CardTitle>
              <CardDescription>
                Paramètres techniques de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports automatiques</Label>
                  <div className="text-sm text-muted-foreground">
                    Génération automatique des rapports périodiques
                  </div>
                </div>
                <Switch
                  checked={systemSettings.autoReports}
                  onCheckedChange={(checked) =>
                    setSystemSettings({
                      ...systemSettings,
                      autoReports: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Rétention des données (mois)</Label>
                <Select
                  value={systemSettings.dataRetention}
                  onValueChange={(value) =>
                    setSystemSettings({
                      ...systemSettings,
                      dataRetention: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 mois</SelectItem>
                    <SelectItem value="24">24 mois</SelectItem>
                    <SelectItem value="36">36 mois</SelectItem>
                    <SelectItem value="infinite">Illimité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fréquence de sauvegarde</Label>
                <Select
                  value={systemSettings.backupFrequency}
                  onValueChange={(value) =>
                    setSystemSettings({
                      ...systemSettings,
                      backupFrequency: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode maintenance</Label>
                  <div className="text-sm text-muted-foreground">
                    Désactive temporairement l'accès utilisateur
                  </div>
                </div>
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSystemSettings({
                      ...systemSettings,
                      maintenanceMode: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Paramètres de sécurité et de confidentialité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">
                  Authentification à deux facteurs
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="session-timeout" defaultChecked />
                <Label htmlFor="session-timeout">
                  Expiration de session automatique
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="audit-log" defaultChecked />
                <Label htmlFor="audit-log">Journalisation des activités</Label>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Politique de mot de passe</Label>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Minimum 8 caractères</div>
                  <div>• Au moins une majuscule</div>
                  <div>• Au moins un chiffre</div>
                  <div>• Renouvellement tous les 90 jours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button>Sauvegarder les modifications</Button>
      </div>
    </div>
  );
}
