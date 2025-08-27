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

import React, { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { Sidebar } from "./pages/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { ScholarManagement } from "./pages/ScholarManagement";
import { Reports } from "./pages/Reports";
import { Search } from "./pages/Search";
import { Settings } from "./pages/Settings";
import { ActivitySubmission } from "./pages/ActivitySubmission";
import { ActivityValidation } from "./pages/ActivityValidation";
//import { SettingsProvider } from "./contexts/SettingsContext";

export type UserRole = "student" | "led_team" | "supervisor";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("dashboard");
  };

  const renderCurrentView = () => {
    if (!currentUser) return null;

    switch (currentView) {
      case "dashboard":
        return <Dashboard userRole={currentUser.role} />;
      case "scholars":
        return <ScholarManagement userRole={currentUser.role} />;
      case "reports":
        return <Reports userRole={currentUser.role} />;
      case "search":
        return <Search userRole={currentUser.role} />;
      case "settings":
        return <Settings userRole={currentUser.role} />;
      case "activities":
        return <ActivitySubmission userRole={currentUser.role} />;
      case "activity-validation":
        return <ActivityValidation userRole={currentUser.role} />;
      default:
        return <Dashboard userRole={currentUser.role} />;
    }
  };

  // Si l'utilisateur n'est pas connecté, afficher la page de connexion
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        user={currentUser}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">{renderCurrentView()}</main>
    </div>
  );
}
