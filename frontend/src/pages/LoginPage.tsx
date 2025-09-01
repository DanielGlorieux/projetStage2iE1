/*import React, { useState } from "react";
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

interface LoginPageProps {
  onLogin: (user: User) => void;
}
interface LoginForm {
  email: string;
  password: string;
  role: UserRole | "";
}

// --- mockUsers comme avant ---
const mockUsers: Record<string, { password: string; user: User }> = {
  "a.kone@2ie-edu.org": {
    password: "led2024",
    user: {
      id: "1",
      name: "Aminata KONE",
      role: "led_team",
      email: "a.kone@2ie-edu.org",
    },
  },
  "marie.sanogo.et@2ie-edu.org": {
    password: "etudiant2024",
    user: {
      id: "3",
      name: "Marie SANOGO",
      role: "student",
      email: "marie.sanogo.et@2ie-edu.org",
    },
  },
  "prof.traore@2ie-edu.org": {
    password: "prof2024",
    user: {
      id: "6",
      name: "Prof. Mamadou TRAORE",
      role: "supervisor",
      email: "prof.traore@2ie-edu.org",
    },
  },
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.email && !formData.email.includes("@2ie-edu.org")) {
      setError(
        "Veuillez utiliser votre adresse email institutionnelle 2iE (@2ie-edu.org)"
      );
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      if (loginMode === "login") {
        const userRecord = mockUsers[formData.email];
        if (userRecord && userRecord.password === formData.password) {
          onLogin(userRecord.user);
        } else {
          setError("Email institutionnel ou mot de passe incorrect");
        }
      } else {
        if (formData.email && formData.password && formData.role) {
          const newUser: User = {
            id: Date.now().toString(),
            name: formData.email
              .split("@")[0]
              .replace(/\./g, " ")
              .toUpperCase(),
            role: formData.role as UserRole,
            email: formData.email,
          };
          onLogin(newUser);
        } else {
          setError("Veuillez remplir tous les champs");
        }
      }
      setIsLoading(false);
    }, 1000);
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
      */ {
  /* Contenu principal en 2 colonnes */
}
/*
      <div className="flex flex-1 items-center justify-center px-6 pt-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-22 w-full max-w-6xl items-center">
          */ {
  /* Colonne gauche : logo + texte */
}
/*
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

          */ {
  /* Colonne droite : formulaire */
}
/*
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
                */ {
  /* Email */
}
/*
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

                */ {
  /* Mot de passe */
}
/*
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

                */ {
  /* Rôle (inscription uniquement) */
}
/*
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

                */ {
  /* Erreur */
}
/*
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                */ {
  /* Bouton */
}
/*
                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
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

      */ {
  /* Comptes de démo */
} /*
      {/*<div className="px-6 max-w-2xl mx-auto w-full mb-6">
        <Card className="bg-gray-50/80 backdrop-blur-sm border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" /> Comptes de démonstration
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div className="bg-white p-2 rounded border">
              👥 Équipe LED :{" "}
              <span className="font-mono">a.kone@2ie-edu.org / led2024</span>
            </div>
            <div className="bg-white p-2 rounded border">
              🎓 Étudiant :{" "}
              <span className="font-mono">
                marie.sanogo.et@2ie-edu.org / etudiant2024
              </span>
            </div>
            <div className="bg-white p-2 rounded border">
              👨‍🏫 Encadrant :{" "}
              <span className="font-mono">
                prof.traore@2ie-edu.org / prof2024
              </span>
            </div>
          </CardContent>
        </Card>
      */ /*</div>*/ /*}*/

{
  /* Footer */
} /*
      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white/40">
        <p>
          © 2024 Institut International d'Ingénierie de l'Eau et de
          l'Environnement (2iE)
        </p>
        <p>
          Plateforme de suivi des compétences Leadership, Entrepreneuriat &
          Digital
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-blue-600">
          <a href="#" className="hover:underline">
            Support technique
          </a>
          <a href="#" className="hover:underline">
            Guide d'utilisation
          </a>
          <a href="#" className="hover:underline">
            Contact LED
          </a>
        </div>
      </footer>
    </div>
  );
}*/

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

interface LoginPageProps {
  onLogin: (user: User) => void;
}

interface LoginForm {
  email: string;
  password: string;
  role: UserRole | "";
  name?: string;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");

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
          <a href="#" className="hover:underline">
            Support technique
          </a>
          <a href="#" className="hover:underline">
            Guide d'utilisation
          </a>
          <a href="#" className="hover:underline">
            Contact LED
          </a>
        </div>
      </footer>
    </div>
  );
}
