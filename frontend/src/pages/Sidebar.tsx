import React from "react";
import { User, UserRole } from "../App";
import { Button } from "../components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import Logo2iE from "../components/image/Logo2iEBon.png";
import {
  LayoutDashboard,
  Users,
  FileText,
  Search,
  Settings,
  GraduationCap,
  TrendingUp,
  Bell,
  LogOut,
  Upload,
  Target,
  BarChart3,
  User as UserIcon,
  Calendar,
  Award,
  Lightbulb,
  Building,
  BookOpen,
  Download,
  CheckCircle,
  Star,
} from "lucide-react";
interface SidebarProps {
  user: User;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({
  user,
  currentView,
  onViewChange,
  onLogout,
}: SidebarProps) {
  const getNavigationItems = (role: UserRole) => {
    const baseItems = [
      {
        id: "dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        description: "Vue d'ensemble",
      },
    ];

    if (role === "student") {
      return [
        ...baseItems,
        {
          id: "profile",
          label: "Mon profil LED",
          icon: UserIcon,
          description: "Informations personnelles",
        },
        {
          id: "activities",
          label: "Mes activités",
          icon: BookOpen,
          description: "Gestion des activités",
        },
        /*{
          id: "submissions",
          label: "Mes rapports",
          icon: Upload,
          description: "Soumission et suivi",
        },*/
        {
          id: "progress",
          label: "Ma progression",
          icon: TrendingUp,
          description: "Évolution des compétences",
        },
        {
          id: "calendar",
          label: "Échéances",
          icon: Calendar,
          description: "Dates importantes",
        },
        /*{
          id: "achievements",
          label: "Mes réalisations",
          icon: Award,
          description: "Certifications et badges",
        },*/
      ];
    }

    if (role === "led_team") {
      return [
        ...baseItems,
        {
          id: "activity-validation",
          label: "Validation d'activités",
          icon: CheckCircle,
          description: "Évaluer les soumissions",
        },
        {
          id: "search",
          label: "Recherche multicritère",
          icon: Search,
          description: "Filtrage avancé",
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: Bell,
          description: "Communication",
        },
        {
          id: "exports",
          label: "Exports de données",
          icon: Download,
          description: "PDF, CSV, Excel",
        },
        {
          id: "settings",
          label: "Configuration",
          icon: Settings,
          description: "Paramètres système",
        },
      ];
    }

    if (role === "supervisor") {
      return [
        ...baseItems,
        /*{
          id: "my-students",
          label: "Mes étudiants",
          icon: GraduationCap,
          description: "Étudiants encadrés",
        },*/
        {
          id: "activity-validation",
          label: "Évaluation activités",
          icon: Star,
          description: "Noter les projets",
        },
        {
          id: "search",
          label: "Recherche étudiants",
          icon: Search,
          description: "Recherche et filtres",
        },
        {
          id: "reports",
          label: "Rapports de suivi",
          icon: BarChart3,
          description: "Progression des étudiants",
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: Bell,
          description: "Alertes et messages",
        },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems(user.role);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "student":
        return "Étudiant boursier LED";
      case "led_team":
        return "Équipe LED";
      case "supervisor":
        return "Enseignant/Encadrant";
      default:
        return "Utilisateur";
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
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

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-3 h-3" />;
      case "led_team":
        return <Lightbulb className="w-3 h-3" />;
      case "supervisor":
        return <Building className="w-3 h-3" />;
      default:
        return <UserIcon className="w-3 h-3" />;
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header avec branding LED/2iE */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={Logo2iE}
              alt="Logo 2iE"
              className="h-25 w-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Platforme de suivi des compétences 2iE
            </h1>
            <p className="text-xs text-gray-600">
              2iE - Excellence & Innovation
            </p>
          </div>
        </div>

        {/* Profil utilisateur */}
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate mb-2">{user.email}</p>
            <Badge
              className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(user.role)}`}
            >
              {getRoleIcon(user.role)}
              <span className="ml-1">{getRoleLabel(user.role)}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-3 ${
                currentView === item.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{item.label}</div>
                <div
                  className={`text-xs ${
                    currentView === item.id ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {item.description}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Section statistiques rapides pour étudiants */}
        {user.role === "student" && (
          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">
              Mes stats rapides
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Score LED global</span>
                <span className="font-semibold text-blue-600">92/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rapports soumis</span>
                <span className="font-semibold text-green-600">18/20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Activités en cours</span>
                <span className="font-semibold text-orange-600">4</span>
              </div>
            </div>
          </div>
        )}

        {/* Section statistiques pour équipe LED */}
        {user.role === "led_team" && (
          <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">
              Vue d'ensemble
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Boursiers actifs</span>
                <span className="font-semibold text-blue-600">168</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux de réussite</span>
                <span className="font-semibold text-green-600">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rapports en attente</span>
                <span className="font-semibold text-red-600">28</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer avec déconnexion */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </Button>

        <Separator />

        <div className="text-center space-y-1">
          <p className="text-xs text-gray-500">LED Platform v2.0</p>
          <p className="text-xs text-gray-400">2iE © 2024</p>
          <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
            <a href="#" className="hover:underline">
              Support
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="hover:underline">
              Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
