import React from "react";
import { Button } from "./button";
import { Menu, Bell, User } from "lucide-react";
import { useMobile } from "../../hooks/useMobile";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title = "Plateforme LED" }: HeaderProps) {
  const isMobile = useMobile();

  if (!isMobile) return null;

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="p-1 h-auto"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="font-semibold text-gray-900 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
