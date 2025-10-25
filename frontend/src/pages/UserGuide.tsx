import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Progress } from "../components/ui/progress";
import {
  Book,
  Play,
  Download,
  Search,
  ChevronRight,
  Clock,
  Users,
  Star,
  FileText,
  Video,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Target,
  Lightbulb,
  Monitor,
  Award,
  BarChart3,
  Settings,
} from "lucide-react";

interface UserGuideProps {
  onBackToLogin?: () => void;
}

export function UserGuide({ onBackToLogin }: UserGuideProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const guideSections = [
    {
      id: "getting-started",
      title: "Premiers pas",
      description: "Découvrez les bases de la plateforme LED",
      icon: Target,
      color: "bg-blue-500",
      progress: 0,
      guides: [
        {
          id: "login",
          title: "Se connecter à la plateforme",
          duration: "3 min",
          type: "video",
          completed: false,
        },
        {
          id: "profile-setup",
          title: "Configurer son profil",
          duration: "5 min",
          type: "article",
          completed: false,
        },
        {
          id: "dashboard-overview",
          title: "Comprendre le tableau de bord",
          duration: "4 min",
          type: "video",
          completed: false,
        },
      ],
    },
    {
      id: "activities",
      title: "Gestion des activités",
      description: "Créer et gérer vos réalisations LED",
      icon: Lightbulb,
      color: "bg-green-500",
      progress: 0,
      guides: [
        {
          id: "create-activity",
          title: "Créer une nouvelle activité",
          duration: "8 min",
          type: "video",
          completed: false,
        },
        {
          id: "activity-types",
          title: "Types d'activités LED",
          duration: "6 min",
          type: "article",
          completed: false,
        },
        {
          id: "upload-documents",
          title: "Joindre des documents",
          duration: "4 min",
          type: "video",
          completed: false,
        },
        {
          id: "edit-activity",
          title: "Modifier une activité",
          duration: "3 min",
          type: "article",
          completed: false,
        },
      ],
    },
    {
      id: "evaluation",
      title: "Processus d'évaluation",
      description: "Comprendre l'évaluation de vos activités",
      icon: Award,
      color: "bg-purple-500",
      progress: 0,
      guides: [
        {
          id: "submission-process",
          title: "Processus de soumission",
          duration: "5 min",
          type: "article",
          completed: false,
        },
        {
          id: "evaluation-criteria",
          title: "Critères d'évaluation",
          duration: "7 min",
          type: "video",
          completed: false,
        },
        {
          id: "feedback-understanding",
          title: "Comprendre les retours",
          duration: "4 min",
          type: "article",
          completed: false,
        },
      ],
    },
    {
      id: "advanced",
      title: "Fonctionnalités avancées",
      description: "Maîtrisez toutes les fonctionnalités",
      icon: Settings,
      color: "bg-orange-500",
      progress: 0,
      guides: [
        {
          id: "reports-analytics",
          title: "Rapports et analytics",
          duration: "6 min",
          type: "video",
          completed: false,
        },
        {
          id: "collaboration",
          title: "Collaboration et partage",
          duration: "5 min",
          type: "article",
          completed: false,
        },
        {
          id: "export-data",
          title: "Exporter ses données",
          duration: "3 min",
          type: "video",
          completed: false,
        },
      ],
    },
  ];

  const quickActions = [
    {
      title: "Manuel PDF complet",
      description: "Téléchargez le guide complet en PDF",
      icon: FileText,
      action: "download",
      color: "bg-red-500",
    },
    {
      title: "Vidéos tutoriels",
      description: "Regardez nos tutoriels vidéo",
      icon: Video,
      action: "watch",
      color: "bg-blue-500",
    },
    {
      title: "FAQ interactive",
      description: "Consultez les questions fréquentes",
      icon: HelpCircle,
      action: "faq",
      color: "bg-green-500",
    },
  ];

  const filteredSections = guideSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.guides.some((guide) =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleGuideClick = (guideId: string) => {
    setActiveGuide(guideId);
    // Ici vous pourriez ouvrir un modal ou naviguer vers le guide
  };

  const toggleGuideCompletion = (sectionId: string, guideId: string) => {
    // Logique pour marquer un guide comme complété
    console.log(
      `Toggling completion for guide ${guideId} in section ${sectionId}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* ✅ Ajouter un header avec bouton de retour */}
      {onBackToLogin && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <Button
            variant="outline"
            onClick={onBackToLogin}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Guide d'utilisation LED
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Apprenez à utiliser efficacement la plateforme LED avec nos guides
            détaillés et tutoriels interactifs.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher dans les guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sections de guides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredSections.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center`}
                  >
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
                <Progress value={section.progress} className="h-2" />
                <div className="text-sm text-gray-500">
                  {section.progress}% complété
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {section.guides.map((guide) => (
                    <div
                      key={guide.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleGuideClick(guide.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {guide.type === "video" ? (
                          <Video className="w-4 h-4 text-blue-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-green-600" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {guide.title}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {guide.duration}
                            <Badge variant="outline" className="text-xs">
                              {guide.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGuideCompletion(section.id, guide.id);
                        }}
                      >
                        {guide.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Play className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section ressources supplémentaires */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-600" />
              Ressources complémentaires
            </CardTitle>
            <CardDescription>
              Documents et ressources utiles pour approfondir vos connaissances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Download className="w-6 h-6" />
                <span className="text-sm">Modèles de rapports</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <FileText className="w-6 h-6" />
                <span className="text-sm">Critères d'évaluation</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">Exemples de projets</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Communauté</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
