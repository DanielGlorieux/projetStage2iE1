import React from 'react';
import { Badge } from '../components/ui/badge';
import { 
  Award,
  TrendingUp, 
  TrendingDown,
  Minus 
} from 'lucide-react';

interface GradeBadgeProps {
  score: number;
  letterGrade?: string;
  gpa?: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Couleurs selon la note
const getGradeColor = (grade: string): string => {
  if (grade === 'A') return 'bg-green-100 text-green-800 border-green-300';
  if (grade === 'B') return 'bg-blue-100 text-blue-800 border-blue-300';
  if (grade === 'C') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  if (grade === 'D') return 'bg-orange-100 text-orange-800 border-orange-300';
  if (grade === 'E') return 'bg-red-100 text-red-800 border-red-300';
  if (grade === 'F') return 'bg-red-200 text-red-900 border-red-400';
  return 'bg-gray-100 text-gray-800 border-gray-300';
};

// Icône selon la note
const getGradeIcon = (grade: string) => {
  if (grade === 'A') return <Award className="w-4 h-4" />;
  if (grade === 'B' || grade === 'C') return <TrendingUp className="w-4 h-4" />;
  if (grade === 'D' || grade === 'E') return <TrendingDown className="w-4 h-4" />;
  if (grade === 'F') return <TrendingDown className="w-4 h-4" />;
  return <Minus className="w-4 h-4" />;
};

// Description selon la note
const getGradeDescription = (grade: string): string => {
  const descriptions: Record<string, string> = {
    'A': 'Excellent',
    'B': 'Très bien',
    'C': 'Bien',
    'D': 'Passable',
    'E': 'Insuffisant',
    'F': 'Échec'
  };
  return descriptions[grade] || 'Non évalué';
};

export function GradeBadge({ 
  score, 
  letterGrade, 
  gpa, 
  showDetails = false,
  size = 'md' 
}: GradeBadgeProps) {
  // Calculer la note si non fournie
  const grade = letterGrade || calculateLetterGrade(score);
  const calculatedGPA = gpa || calculateGPA(score);
  const description = getGradeDescription(grade);
  const color = getGradeColor(grade);
  const icon = getGradeIcon(grade);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  if (showDetails) {
    return (
      <div className="flex flex-col gap-1">
        <div className={`inline-flex items-center gap-2 rounded-md border ${color} ${sizeClasses[size]} font-medium`}>
          {icon}
          <span className="font-bold">{grade}</span>
          <span className="text-xs opacity-75">({score}/100)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{description}</span>
          <span>•</span>
          <span>GPA: {calculatedGPA.toFixed(1)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-md border ${color} ${sizeClasses[size]} font-medium`}>
      {size !== 'sm' && icon}
      <span className="font-bold">{grade}</span>
      <span className="text-xs opacity-75">({score})</span>
    </div>
  );
}

// Fonction utilitaire pour calculer la note lettre
function calculateLetterGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

// Fonction utilitaire pour calculer le GPA
function calculateGPA(score: number): number {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  if (score >= 50) return 0.5;
  return 0.0;
}

// Composant pour afficher l'échelle complète
export function GradingScale() {
  const scale = [
    { grade: 'A', range: '90-100', gpa: 4.0, description: 'Excellent', color: 'green' },
    { grade: 'B', range: '80-89', gpa: 3.0, description: 'Très bien', color: 'blue' },
    { grade: 'C', range: '70-79', gpa: 2.0, description: 'Bien', color: 'yellow' },
    { grade: 'D', range: '60-69', gpa: 1.0, description: 'Passable', color: 'orange' },
    { grade: 'E', range: '50-59', gpa: 0.5, description: 'Insuffisant', color: 'red' },
    { grade: 'F', range: '0-49', gpa: 0.0, description: 'Échec', color: 'red' },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Échelle de Notation (Système Américain)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {scale.map((item) => (
          <div
            key={item.grade}
            className={`p-3 rounded-lg border ${getGradeColor(item.grade)}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl font-bold">{item.grade}</span>
              <span className="text-xs font-medium">GPA: {item.gpa}</span>
            </div>
            <div className="text-xs opacity-75">
              <div>{item.range} points</div>
              <div className="font-medium mt-1">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Le seuil de réussite est de 60/100 (Note D ou supérieure)
      </p>
    </div>
  );
}

// Composant pour la progression avec GPA
interface GPAProgressProps {
  currentGPA: number;
  targetGPA?: number;
  showTarget?: boolean;
}

export function GPAProgress({ currentGPA, targetGPA = 3.0, showTarget = true }: GPAProgressProps) {
  const percentage = (currentGPA / 4.0) * 100;
  const targetPercentage = (targetGPA / 4.0) * 100;
  
  let color = 'bg-green-500';
  if (currentGPA < 2.0) color = 'bg-red-500';
  else if (currentGPA < 3.0) color = 'bg-yellow-500';
  else if (currentGPA < 3.5) color = 'bg-blue-500';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">GPA Actuel</span>
        <span className="font-bold">{currentGPA.toFixed(2)} / 4.0</span>
      </div>
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
        {showTarget && targetGPA > currentGPA && (
          <div
            className="absolute top-0 h-full w-0.5 bg-gray-700"
            style={{ left: `${targetPercentage}%` }}
          >
            <span className="absolute -top-6 -left-8 text-xs text-gray-600 whitespace-nowrap">
              Objectif: {targetGPA.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>0.0</span>
        <span>4.0</span>
      </div>
    </div>
  );
}

// Export des utilitaires
export { calculateLetterGrade, calculateGPA, getGradeColor, getGradeDescription };
