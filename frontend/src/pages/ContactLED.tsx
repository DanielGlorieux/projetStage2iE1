import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
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
import { Badge } from "../components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Users,
  Building,
  Globe,
  MessageSquare,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface ContactLEDProps {
  onBackToLogin?: () => void;
}

export function ContactLED({ onBackToLogin }: ContactLEDProps) {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    university: "",
    level: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    { value: "general", label: "Demande générale" },
    { value: "application", label: "Candidature LED" },
    { value: "partnership", label: "Partenariat" },
    { value: "technical", label: "Support technique" },
    { value: "press", label: "Presse & médias" },
    { value: "other", label: "Autre" },
  ];

  const teamMembers = [
    {
      name: "Dr. Kouakou KOFFI",
      role: "Directeur du Programme LED",
      email: "directeur.led@2ie-edu.org",
      phone: "+226 25 49 28 00",
      image: "/api/placeholder/150/150",
    },
    {
      name: "Mme. Aminata TRAORE",
      role: "Coordinatrice Pédagogique",
      email: "coordinatrice.led@2ie-edu.org",
      phone: "+226 25 49 28 01",
      image: "/api/placeholder/150/150",
    },
    {
      name: "M. Moussa SANGARE",
      role: "Responsable Technique",
      email: "technique.led@2ie-edu.org",
      phone: "+226 25 49 28 02",
      image: "/api/placeholder/150/150",
    },
  ];

  const offices = [
    {
      city: "Ouagadougou",
      country: "Burkina Faso",
      address: "Rue de la Science, Secteur 4",
      postal: "01 BP 594 Ouagadougou 01",
      phone: "+226 25 49 28 00",
      email: "contact@2ie-edu.org",
      type: "Campus principal",
    },
    {
      city: "Lomé",
      country: "Togo",
      address: "Boulevard du 13 Janvier",
      postal: "BP 2972 Lomé",
      phone: "+228 22 25 89 00",
      email: "lome@2ie-edu.org",
      type: "Antenne",
    },
    {
      city: "Casablanca",
      country: "Maroc",
      address: "Technopark, Route de Nouasseur",
      postal: "20000 Casablanca",
      phone: "+212 5 22 52 95 00",
      email: "casablanca@2ie-edu.org",
      type: "Bureau de liaison",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      setContactForm({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
        university: "",
        level: "",
      });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            Contactez le Programme LED
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous sommes là pour vous accompagner dans votre parcours LED.
            N'hésitez pas à nous contacter pour toute question ou demande
            d'information.
          </p>
        </div>

        {/* Alert succès */}
        {submitSuccess && (
          <Alert className="border-green-200 bg-green-50 max-w-2xl mx-auto">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Votre message a été envoyé avec succès ! Nous vous répondrons dans
              les plus brefs délais.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Envoyez-nous un message
              </CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons
                rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">Université/École</Label>
                    <Input
                      id="university"
                      value={contactForm.university}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          university: e.target.value,
                        }))
                      }
                      placeholder="Ex: Université de Ouagadougou"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Niveau d'études</Label>
                    <Select
                      value={contactForm.level}
                      onValueChange={(value) =>
                        setContactForm((prev) => ({ ...prev, level: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="licence">Licence</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="doctorat">Doctorat</SelectItem>
                        <SelectItem value="professionnel">
                          Professionnel
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Sujet de votre demande *</Label>
                  <Select
                    value={contactForm.category}
                    onValueChange={(value) =>
                      setContactForm((prev) => ({ ...prev, category: value }))
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
                  <Label htmlFor="subject">Objet du message *</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Résumé de votre demande..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Décrivez votre demande en détail..."
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
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            {/* Contact principal */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Email principal</p>
                    <p className="text-sm text-gray-600">led@2ie-edu.org</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-gray-600">+226 25 49 28 00</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-gray-600">
                      Institut International d'Ingénierie de l'Eau et de
                      l'Environnement
                      <br />
                      Rue de la Science, Secteur 4<br />
                      01 BP 594 Ouagadougou 01, Burkina Faso
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Heures d'ouverture</p>
                    <p className="text-sm text-gray-600">
                      Lun-Ven: 8h00 - 17h00 (GMT+0)
                      <br />
                      Sam: 8h00 - 12h00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Équipe LED */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Équipe du Programme LED
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {member.role}
                        </p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Liens utiles */}
            <Card>
              <CardHeader>
                <CardTitle>Liens utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://www.2ie-edu.org', '_blank')}
                  title="Visiter le site web de 2iE"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Site web 2iE
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://calendly.com/led-2ie', '_blank')}
                  title="Prendre un rendez-vous"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Prendre rendez-vous
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://maps.google.com/?q=2iE+Ouagadougou', '_blank')}
                  title="Voir la localisation sur Google Maps"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Localisation campus
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bureaux internationaux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Nos bureaux
            </CardTitle>
            <CardDescription>
              Retrouvez-nous dans nos différents bureaux en Afrique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offices.map((office, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {office.city}
                      </h3>
                      <Badge variant="outline">{office.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{office.country}</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                      <div>
                        <p>{office.address}</p>
                        <p>{office.postal}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p>{office.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p>{office.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
