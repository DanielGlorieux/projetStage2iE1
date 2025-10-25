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
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { ArrowLeft } from "lucide-react";
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Download,
  ExternalLink,
  Search,
  Book,
  Video,
  FileText,
  Headphones,
} from "lucide-react";

interface SupportProps {
  onBackToLogin?: () => void;
}

export function Support({ onBackToLogin }: SupportProps) {
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { value: "technical", label: "Problème technique" },
    { value: "account", label: "Compte utilisateur" },
    { value: "activities", label: "Gestion des activités" },
    { value: "evaluation", label: "Évaluation" },
    { value: "other", label: "Autre" },
  ];

  const priorities = [
    { value: "low", label: "Basse", color: "bg-green-100 text-green-800" },
    {
      value: "medium",
      label: "Normale",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "Élevée", color: "bg-red-100 text-red-800" },
  ];

  const faqItems = [
    {
      question: "Comment soumettre une nouvelle activité LED ?",
      answer:
        "Allez dans la section 'Mes Réalisations', cliquez sur 'Nouvelle Réalisation' et remplissez le formulaire avec tous les détails de votre projet.",
      category: "activities",
    },
    {
      question: "Pourquoi mon activité n'apparaît pas ?",
      answer:
        "Vérifiez que vous avez bien sauvegardé votre activité. Si le problème persiste, contactez le support technique.",
      category: "technical",
    },
    {
      question: "Comment modifier mon profil ?",
      answer:
        "Accédez à la section 'Profil' depuis le menu principal pour modifier vos informations personnelles.",
      category: "account",
    },
    {
      question: "Quand seront évaluées mes activités ?",
      answer:
        "Les activités sont évaluées dans un délai de 7 à 14 jours ouvrables après soumission.",
      category: "evaluation",
    },
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi du ticket
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      setTicketForm({
        subject: "",
        category: "",
        priority: "medium",
        description: "",
        email: "",
      });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaq = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* ✅ Ajouter un header avec bouton de retour */}
      {onBackToLogin && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
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
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Technique LED
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous sommes là pour vous aider. Trouvez des réponses à vos questions
            ou contactez notre équipe de support.
          </p>
        </div>

        {/* Alert succès */}
        {submitSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Votre ticket a été créé avec succès ! Nous vous répondrons dans
              les plus brefs délais.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-2 h-auto p-2">
            <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="flex items-center gap-2 py-3"
            >
              <MessageSquare className="w-4 h-4" />
              Créer un ticket
            </TabsTrigger>
            <TabsTrigger
              value="guides"
              className="flex items-center gap-2 py-3"
            >
              <Book className="w-4 h-4" />
              Guides
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="flex items-center gap-2 py-3"
            >
              <Clock className="w-4 h-4" />
              Statut système
            </TabsTrigger>
          </TabsList>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Questions fréquemment posées
                </CardTitle>
                <CardDescription>
                  Trouvez rapidement des réponses aux questions les plus
                  courantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barre de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher dans la FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {filteredFaq.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-gray-600">{item.answer}</p>
                      <Badge variant="outline" className="mt-2">
                        {
                          categories.find((c) => c.value === item.category)
                            ?.label
                        }
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Créer un ticket */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulaire de ticket */}
              <Card>
                <CardHeader>
                  <CardTitle>Créer un ticket de support</CardTitle>
                  <CardDescription>
                    Décrivez votre problème et nous vous aiderons rapidement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email de contact</Label>
                      <Input
                        id="email"
                        type="email"
                        value={ticketForm.email}
                        onChange={(e) =>
                          setTicketForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        value={ticketForm.subject}
                        onChange={(e) =>
                          setTicketForm((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="Résumé du problème..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={ticketForm.category}
                        onValueChange={(value) =>
                          setTicketForm((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select
                        value={ticketForm.priority}
                        onValueChange={(value) =>
                          setTicketForm((prev) => ({
                            ...prev,
                            priority: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                            >
                              <Badge className={priority.color}>
                                {priority.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Description détaillée</Label>
                      <Textarea
                        id="description"
                        value={ticketForm.description}
                        onChange={(e) =>
                          setTicketForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Décrivez votre problème en détail..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>Envoi en cours...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Créer le ticket
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Informations de contact */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Autres moyens de contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">
                          support@led-2ie.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <p className="text-sm text-gray-600">
                          +226 25 49 28 00
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Heures de support</p>
                        <p className="text-sm text-gray-600">
                          Lun-Ven: 8h00 - 18h00 (GMT+0)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Temps de réponse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Priorité élevée</span>
                        <Badge className="bg-red-100 text-red-800">
                          2-4 heures
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Priorité normale</span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          24-48 heures
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Priorité basse</span>
                        <Badge className="bg-green-100 text-green-800">
                          3-5 jours
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Guides */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Video className="w-8 h-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">Guide vidéo</CardTitle>
                      <CardDescription>Tutoriels vidéo</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Découvrez comment utiliser la plateforme LED avec nos
                    tutoriels vidéo.
                  </p>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Voir les vidéos
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <CardTitle className="text-lg">
                        Manuel utilisateur
                      </CardTitle>
                      <CardDescription>Guide complet PDF</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Manuel détaillé pour utiliser toutes les fonctionnalités.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Headphones className="w-8 h-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">
                        Formation en ligne
                      </CardTitle>
                      <CardDescription>
                        Sessions d'accompagnement
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Participez à nos sessions de formation en ligne.
                  </p>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    S'inscrire
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statut système */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Statut des services
                </CardTitle>
                <CardDescription>
                  État en temps réel de nos services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Plateforme principale</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Opérationnel
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Base de données</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Opérationnel
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Service de fichiers</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Maintenance
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Notifications</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Opérationnel
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
