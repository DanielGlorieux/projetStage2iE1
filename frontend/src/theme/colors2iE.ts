/**
 * THÈME 2iE - Configuration des couleurs
 * Basé sur la charte graphique 2iE
 * Date: 2025-01-25
 */

export const theme2iE = {
  // COULEURS PRINCIPALES (de la charte)
  primary: {
    main: '#DA291C',      // PANTONE 485 C - Rouge 2iE
    light: '#FF8200',     // PANTONE 151 C - Orange
    dark: '#84344E',      // PANTONE 506 C - Bordeaux
  },
  
  secondary: {
    main: '#00A3E0',      // PANTONE 299 C - Bleu ciel
    light: '#00B0B9',     // PANTONE 7466 C - Turquoise
    dark: '#00558C',      // PANTONE 7462 C - Bleu foncé
  },
  
  accent: {
    yellow: '#F1C400',    // PANTONE 7406 C - Jaune
    green: '#4C8C2B',     // PANTONE 363 C - Vert
    lime: '#B5BD00',      // PANTONE 390 C - Vert citron
    purple: '#C6579A',    // PANTONE 674 C - Rose/Violet
  },
  
  neutral: {
    darkGray: '#707372',  // PANTONE 424 C - Gris foncé
    lightGray: '#B1B3B3', // PANTONE COOL GRAY 5 C - Gris clair
    white: '#FFFFFF',
    black: '#1F2937',
  },
  
  // PALETTE SÉMANTIQUE
  semantic: {
    success: '#4C8C2B',   // Vert
    warning: '#F1C400',   // Jaune
    danger: '#DA291C',    // Rouge
    info: '#00A3E0',      // Bleu
  },
  
  // TEXTES
  text: {
    primary: '#1F2937',   // Presque noir
    secondary: '#707372', // Gris foncé 2iE
    muted: '#B1B3B3',     // Gris clair 2iE
    white: '#FFFFFF',
  },
  
  // FONDS
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    dark: '#1F2937',
  },
  
  // BORDURES
  border: {
    light: '#E5E7EB',
    default: '#D1D5DB',
    dark: '#B1B3B3',
  },
};

// Export des couleurs pour Tailwind
export const tailwindColors = {
  '2ie-red': {
    DEFAULT: theme2iE.primary.main,
    light: '#FF5745',
    dark: '#B81F14',
  },
  '2ie-orange': {
    DEFAULT: theme2iE.primary.light,
    light: '#FFA040',
    dark: '#CC6800',
  },
  '2ie-blue': {
    DEFAULT: theme2iE.secondary.main,
    light: '#40B5E8',
    dark: '#0082B3',
  },
  '2ie-turquoise': {
    DEFAULT: theme2iE.secondary.light,
    light: '#40C8D0',
    dark: '#008C94',
  },
  '2ie-yellow': {
    DEFAULT: theme2iE.accent.yellow,
    light: '#F5D440',
    dark: '#C19C00',
  },
  '2ie-green': {
    DEFAULT: theme2iE.accent.green,
    light: '#6BAA49',
    dark: '#3A6E1E',
  },
  '2ie-gray': {
    DEFAULT: theme2iE.neutral.darkGray,
    light: theme2iE.neutral.lightGray,
    dark: '#5A5C5B',
  },
};
