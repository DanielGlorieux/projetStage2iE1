import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Trophy, Star, Sparkles, Award } from "lucide-react";

interface CongratulationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  activityTitle: string;
  score?: number;
  type: "entrepreneuriat" | "leadership" | "digital";
}

export function CongratulationsPopup({
  isOpen,
  onClose,
  activityTitle,
  score,
  type,
}: CongratulationsPopupProps) {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfetti(true);
      const timer = setTimeout(() => setConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getTypeColor = () => {
    switch (type) {
      case "entrepreneuriat":
        return "text-blue-600";
      case "leadership":
        return "text-purple-600";
      case "digital":
        return "text-green-600";
      default:
        return "text-primary";
    }
  };

  const getTypeEmoji = () => {
    switch (type) {
      case "entrepreneuriat":
        return "💼";
      case "leadership":
        return "🎯";
      case "digital":
        return "💻";
      default:
        return "🎓";
    }
  };

  const getMessage = () => {
    if (!score) return "Félicitations pour avoir terminé cette activité !";

    if (score >= 90) {
      return "Performance exceptionnelle ! Vous êtes un exemple à suivre !";
    } else if (score >= 80) {
      return "Excellent travail ! Continuez comme ça !";
    } else if (score >= 70) {
      return "Très bon travail ! Vous progressez bien !";
    } else if (score >= 60) {
      return "Bon travail ! Continuez vos efforts !";
    } else {
      return "Bravo pour avoir complété cette activité !";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="relative">
          {confetti && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-bounce">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          )}

          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className={`relative ${confetti ? "animate-bounce" : ""}`}>
                <Trophy className={`h-20 w-20 ${getTypeColor()}`} />
                <div className="absolute -top-2 -right-2">
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500 animate-pulse" />
                </div>
              </div>
            </div>

            <DialogTitle className="text-center text-2xl">
              Félicitations ! {getTypeEmoji()}
            </DialogTitle>

            <DialogDescription className="text-center space-y-4">
              <p className="text-lg font-medium text-foreground">
                {getMessage()}
              </p>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="font-semibold">Activité complétée :</p>
                <p className="text-sm">{activityTitle}</p>

                {score !== undefined && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Award className={`h-5 w-5 ${getTypeColor()}`} />
                    <span className={`text-3xl font-bold ${getTypeColor()}`}>
                      {score}/100
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium">Compétence développée :</p>
                <div className={`inline-block px-4 py-2 rounded-full ${getTypeColor()} bg-opacity-10`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center mt-6">
            <Button onClick={onClose} size="lg" className="w-full">
              Continuer mon parcours
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
