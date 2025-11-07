/**
 * Système de notation américain pour la plateforme LED 2iE
 * 
 * Conversion des scores numériques (0-100) en notes lettres (A-F)
 * selon le système de notation américain standard
 */

// Configuration du système de notation
const GRADING_SCALE = {
  A: { min: 90, max: 100, gpa: 4.0, description: 'Excellent' },
  B: { min: 80, max: 89, gpa: 3.0, description: 'Très bien' },
  C: { min: 70, max: 79, gpa: 2.0, description: 'Bien' },
  D: { min: 60, max: 69, gpa: 1.0, description: 'Passable' },
  E: { min: 50, max: 59, gpa: 0.5, description: 'Insuffisant' },
  F: { min: 0, max: 49, gpa: 0.0, description: 'Échec' }
};

// Configuration alternative avec + et -
const DETAILED_GRADING_SCALE = {
  'A+': { min: 97, max: 100, gpa: 4.0, description: 'Exceptionnel' },
  'A': { min: 93, max: 96, gpa: 4.0, description: 'Excellent' },
  'A-': { min: 90, max: 92, gpa: 3.7, description: 'Très bon' },
  'B+': { min: 87, max: 89, gpa: 3.3, description: 'Bien+' },
  'B': { min: 83, max: 86, gpa: 3.0, description: 'Bien' },
  'B-': { min: 80, max: 82, gpa: 2.7, description: 'Bien-' },
  'C+': { min: 77, max: 79, gpa: 2.3, description: 'Assez bien' },
  'C': { min: 73, max: 76, gpa: 2.0, description: 'Moyen' },
  'C-': { min: 70, max: 72, gpa: 1.7, description: 'Moyen-' },
  'D+': { min: 67, max: 69, gpa: 1.3, description: 'Passable+' },
  'D': { min: 63, max: 66, gpa: 1.0, description: 'Passable' },
  'D-': { min: 60, max: 62, gpa: 0.7, description: 'Passable-' },
  'E': { min: 50, max: 59, gpa: 0.5, description: 'Insuffisant' },
  'F': { min: 0, max: 49, gpa: 0.0, description: 'Échec' }
};

/**
 * Convertit un score numérique en note lettre
 * @param {number} score - Score numérique entre 0 et 100
 * @param {boolean} detailed - Utiliser le système détaillé avec + et -
 * @returns {object} Objet contenant la note, le GPA et la description
 */
function scoreToGrade(score, detailed = false) {
  if (score === null || score === undefined || isNaN(score)) {
    return {
      grade: 'N/A',
      gpa: 0,
      description: 'Non évalué',
      score: 0
    };
  }

  const numericScore = parseFloat(score);
  
  if (numericScore < 0 || numericScore > 100) {
    return {
      grade: 'Invalid',
      gpa: 0,
      description: 'Score invalide',
      score: numericScore
    };
  }

  const scale = detailed ? DETAILED_GRADING_SCALE : GRADING_SCALE;

  for (const [grade, range] of Object.entries(scale)) {
    if (numericScore >= range.min && numericScore <= range.max) {
      return {
        grade,
        gpa: range.gpa,
        description: range.description,
        score: numericScore,
        range: `${range.min}-${range.max}`
      };
    }
  }

  return {
    grade: 'F',
    gpa: 0.0,
    description: 'Échec',
    score: numericScore
  };
}

/**
 * Convertit une note lettre en score numérique moyen
 * @param {string} grade - Note lettre (A, B, C, D, E, F)
 * @returns {number} Score numérique moyen
 */
function gradeToScore(grade) {
  const scale = grade.includes('+') || grade.includes('-') 
    ? DETAILED_GRADING_SCALE 
    : GRADING_SCALE;

  if (scale[grade]) {
    const range = scale[grade];
    return Math.round((range.min + range.max) / 2);
  }

  return 0;
}

/**
 * Calcule le GPA moyen d'une liste de scores
 * @param {Array<number>} scores - Liste de scores numériques
 * @param {boolean} detailed - Utiliser le système détaillé
 * @returns {object} GPA moyen et note lettre correspondante
 */
function calculateGPA(scores, detailed = false) {
  if (!Array.isArray(scores) || scores.length === 0) {
    return {
      gpa: 0,
      grade: 'N/A',
      averageScore: 0
    };
  }

  const validScores = scores.filter(s => s !== null && s !== undefined && !isNaN(s));
  
  if (validScores.length === 0) {
    return {
      gpa: 0,
      grade: 'N/A',
      averageScore: 0
    };
  }

  const totalGPA = validScores.reduce((sum, score) => {
    const gradeInfo = scoreToGrade(score, detailed);
    return sum + gradeInfo.gpa;
  }, 0);

  const averageScore = validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
  const gpa = totalGPA / validScores.length;
  const gradeInfo = scoreToGrade(averageScore, detailed);

  return {
    gpa: Math.round(gpa * 100) / 100,
    grade: gradeInfo.grade,
    averageScore: Math.round(averageScore * 100) / 100,
    description: gradeInfo.description
  };
}

/**
 * Détermine si un étudiant a réussi selon son score
 * @param {number} score - Score numérique
 * @returns {boolean} True si réussi (>= 60)
 */
function isPassing(score) {
  return score >= 60;
}

/**
 * Obtient la couleur associée à une note pour l'affichage
 * @param {string} grade - Note lettre
 * @returns {string} Code couleur (vert, jaune, orange, rouge)
 */
function getGradeColor(grade) {
  if (grade.startsWith('A')) return 'green';
  if (grade.startsWith('B')) return 'blue';
  if (grade.startsWith('C')) return 'yellow';
  if (grade.startsWith('D')) return 'orange';
  if (grade === 'E' || grade === 'F') return 'red';
  return 'gray';
}

/**
 * Génère un rapport de notation complet
 * @param {Array<object>} activities - Liste d'activités avec scores
 * @param {boolean} detailed - Utiliser le système détaillé
 * @returns {object} Rapport complet
 */
function generateGradingReport(activities, detailed = false) {
  const report = {
    totalActivities: activities.length,
    evaluatedActivities: 0,
    byType: {
      entrepreneuriat: { scores: [], grades: [] },
      leadership: { scores: [], grades: [] },
      digital: { scores: [], grades: [] }
    },
    overall: {
      averageScore: 0,
      gpa: 0,
      grade: 'N/A'
    }
  };

  activities.forEach(activity => {
    if (activity.evaluations && activity.evaluations.length > 0) {
      const evaluation = activity.evaluations[0];
      const score = evaluation.score;
      const type = activity.type.toLowerCase();

      if (report.byType[type] && score !== null && score !== undefined) {
        report.evaluatedActivities++;
        report.byType[type].scores.push(score);
        
        const gradeInfo = scoreToGrade(score, detailed);
        report.byType[type].grades.push(gradeInfo);
      }
    }
  });

  // Calculer les moyennes par type
  Object.keys(report.byType).forEach(type => {
    const typeData = report.byType[type];
    if (typeData.scores.length > 0) {
      const gpaInfo = calculateGPA(typeData.scores, detailed);
      typeData.averageScore = gpaInfo.averageScore;
      typeData.gpa = gpaInfo.gpa;
      typeData.grade = gpaInfo.grade;
      typeData.description = gpaInfo.description;
    } else {
      typeData.averageScore = 0;
      typeData.gpa = 0;
      typeData.grade = 'N/A';
      typeData.description = 'Non évalué';
    }
  });

  // Calculer la moyenne globale
  const allScores = [
    ...report.byType.entrepreneuriat.scores,
    ...report.byType.leadership.scores,
    ...report.byType.digital.scores
  ];

  if (allScores.length > 0) {
    const overallGPA = calculateGPA(allScores, detailed);
    report.overall = overallGPA;
  }

  return report;
}

module.exports = {
  scoreToGrade,
  gradeToScore,
  calculateGPA,
  isPassing,
  getGradeColor,
  generateGradingReport,
  GRADING_SCALE,
  DETAILED_GRADING_SCALE
};
