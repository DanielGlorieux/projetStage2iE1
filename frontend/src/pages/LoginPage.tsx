import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { UserRole, User } from "../App";
import Logo2iE from "../components/image/Logo2iEBon.png";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  GraduationCap,
  Users,
  Shield,
  Lightbulb,
} from "lucide-react";
import { authService } from "../services/authService";
import { Support } from "./Support";
import { UserGuide } from "./UserGuide";
import { ContactLED } from "./ContactLED";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigate?: (view: string) => void;
}

interface LoginForm {
  email: string;
  password: string;
  role: UserRole | "";
  name?: string;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "error"
  >("checking");

  useEffect(() => {
    console.log("🔑 LoginPage mounted");

    // Test de connexion au backend
    fetch("http://localhost:5000/health")
      .then((response) => {
        if (response.ok) {
          setBackendStatus("connected");
          console.log("✅ Backend connected");
        } else {
          throw new Error("Backend not responding");
        }
      })
      .catch((error) => {
        setBackendStatus("error");
        console.error("❌ Backend connection failed:", error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.email && !formData.email.includes("@2ie-edu.org")) {
      setError("Veuillez utiliser votre adresse email institutionnelle 2iE");
      setIsLoading(false);
      return;
    }

    try {
      let response;

      if (loginMode === "login") {
        response = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        if (!formData.role) {
          setError("Veuillez sélectionner votre statut");
          setIsLoading(false);
          return;
        }

        response = await authService.register({
          email: formData.email,
          password: formData.password,
          role: formData.role as string,
          name: formData.email.split("@")[0].replace(/\./g, " ").toUpperCase(),
        });
      }

      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);
        onLogin(response.data.user);
      } else {
        setError(response.error || "Erreur de connexion");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "led_team":
        return <Lightbulb className="w-4 h-4" />;
      case "supervisor":
        return <Shield className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "student":
        return "Étudiant boursier LED";
      case "led_team":
        return "Équipe LED";
      case "supervisor":
        return "Enseignant/Encadrant";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="flex flex-1 items-center justify-center px-6 pt-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-22 w-full max-w-6xl items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <img src={Logo2iE} alt="Logo 2iE" className="h-28 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900 leading-snug">
              Plateforme de suivi des compétences <br />
              Leadership, Entrepreneuriat & Digital (LED)
            </h1>
            <p className="text-lg text-blue-600 font-semibold">
              2iE - Leadership, Entrepreneuriat & Digital
            </p>
            <p className="text-sm text-gray-600">
              Institut International d'Ingénierie de l'Eau et de l'Environnement
            </p>
          </div>
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {loginMode === "login" ? "Connexion" : "Inscription"}
              </CardTitle>
              <CardDescription className="text-base">
                {loginMode === "login"
                  ? "Accédez à votre espace de suivi des compétences LED"
                  : "Créez votre compte sur la plateforme LED"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email institutionnel 2iE</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="prenom.nom.et@2ie-edu.org"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10 h-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {loginMode === "register" && (
                  <div>
                    <Label htmlFor="role">Votre statut</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                      required
                    >
                      <SelectTrigger className="h-11 mt-1">
                        <SelectValue placeholder="Sélectionnez votre statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          {getRoleLabel("student")}
                        </SelectItem>
                        <SelectItem value="led_team">
                          {getRoleLabel("led_team")}
                        </SelectItem>
                        <SelectItem value="supervisor">
                          {getRoleLabel("supervisor")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading
                    ? loginMode === "login"
                      ? "Connexion..."
                      : "Inscription..."
                    : loginMode === "login"
                    ? "Se connecter à LED"
                    : "Créer mon compte LED"}
                </Button>
              </form>
              <Separator />
              <div className="text-center">
                {loginMode === "login" ? (
                  <p className="text-sm">
                    Première connexion ?{" "}
                    <button
                      onClick={() => setLoginMode("register")}
                      className="text-blue-600 hover:underline"
                    >
                      Créer un compte
                    </button>
                  </p>
                ) : (
                  <p className="text-sm">
                    Déjà inscrit ?{" "}
                    <button
                      onClick={() => setLoginMode("login")}
                      className="text-blue-600 hover:underline"
                    >
                      Se connecter
                    </button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white/40">
        <p>© 2025 2iE</p>
        <p>
          Plateforme de suivi des compétences en Leadership, Entrepreneuriat &
          Digital
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-blue-600">
          <button
            onClick={() => {
              console.log("🔗 Clic sur Support");
              onNavigate?.("support");
            }}
            className="hover:underline cursor-pointer"
          >
            Support technique
          </button>
          <button
            onClick={() => {
              console.log("🔗 Clic sur Guide");
              onNavigate?.("guide");
            }}
            className="hover:underline cursor-pointer"
          >
            Guide d'utilisation
          </button>
          <button
            onClick={() => {
              console.log("🔗 Clic sur Contact");
              onNavigate?.("contact");
            }}
            className="hover:underline cursor-pointer"
          >
            Contact LED
          </button>
        </div>
      </footer>
    </div>
  );
}
