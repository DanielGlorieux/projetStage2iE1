/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
export default App*/

import React, { useState, useEffect } from "react";
import { LoginPage } from "./pages/LoginPage";
import { Sidebar } from "./pages/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { ScholarManagement } from "./pages/ScholarManagement";
import { Reports } from "./pages/Reports";
import { Search } from "./pages/Search";
import { Settings } from "./pages/Settings";
import { ActivitySubmission } from "./pages/ActivitySubmission";
import { ActivityValidation } from "./pages/ActivityValidation";
import { Header } from "./components/ui/Header";
import { testConnection } from "./services/api";
import { useSidebar } from "./hooks/useSidebar"; // ✅ Import ajouté

export type UserRole = "student" | "led_team" | "supervisor";

console.log("🚀 App.tsx loaded");

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  filiere?: string;
  niveau?: string;
}

export default function App() {
  console.log("🎯 App component rendered");

  const [connectionStatus, setConnectionStatus] = useState<
    "loading" | "connected" | "error"
  >("loading");
  const [user, setUser] = useState<User | null>(null); // ✅ Correction variable
  const [currentView, setCurrentView] = useState("dashboard");
  const { isOpen, toggle, close, isMobile } = useSidebar(); // ✅ Hook correctement utilisé

  useEffect(() => {
    // Vérifier s'il y a un utilisateur en localStorage
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    // Test de connexion au démarrage
    testConnection()
      .then(() => {
        setConnectionStatus("connected");
        console.log("✅ Backend connecté");
      })
      .catch((error) => {
        setConnectionStatus("error");
        console.error("❌ Backend non accessible:", error);
      });
  }, []);

  // Debug des URLs
  console.log("Frontend URL:", window.location.origin);
  console.log(
    "API URL:",
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  );

  const handleLogin = (userData: User) => {
    setUser(userData); // ✅ Correction nom de fonction
    console.log("✅ Utilisateur connecté:", userData);
  };

  const handleLogout = () => {
    setUser(null); // ✅ Correction nom de fonction
    setCurrentView("dashboard");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("✅ Utilisateur déconnecté");
  };

  const renderCurrentView = () => {
    if (!user) return null;

    switch (currentView) {
      case "dashboard":
        return <Dashboard userRole={user.role} />;
      case "scholars":
        return <ScholarManagement userRole={user.role} />;
      case "reports":
        return <Reports userRole={user.role} />;
      case "search":
        return <Search userRole={user.role} />;
      case "settings":
        return <Settings userRole={user.role} />;
      case "activities":
        return <ActivitySubmission userRole={user.role} />;
      case "activity-validation":
        return <ActivityValidation userRole={user.role} />;
      default:
        return <Dashboard userRole={user.role} />;
    }
  };

  // Affichage de l'état de connexion
  if (connectionStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connexion au serveur...</p>
        </div>
      </div>
    );
  }

  if (connectionStatus === "error") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Erreur de connexion!</strong>
            <span className="block sm:inline">
              {" "}
              Impossible de se connecter au serveur.
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher la page de connexion
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
        userRole={user.role}
        currentPage={currentView}
        setCurrentPage={setCurrentView}
        isOpen={isOpen}
        onClose={close}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header mobile */}
        <Header onMenuClick={toggle} />

        {/* Contenu */}
        <main className={`flex-1 overflow-auto ${isMobile ? "p-4" : "p-6"}`}>
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}
