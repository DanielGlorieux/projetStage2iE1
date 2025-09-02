const { body, param, query } = require("express-validator");

// Validation pour les activités
const validateActivity = () => [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Le titre doit contenir entre 3 et 200 caractères"),
  body("type")
    .isIn(["ENTREPRENEURIAT", "LEADERSHIP", "DIGITAL"])
    .withMessage("Type d'activité invalide"),
  body("description")
    .trim()
    .isLength({ min: 100, max: 2000 })
    .withMessage("La description doit contenir entre 100 et 2000 caractères"),
  body("startDate").isISO8601().withMessage("Date de début invalide"),
  body("endDate")
    .isISO8601()
    .withMessage("Date de fin invalide")
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error(
          "La date de fin doit être postérieure à la date de début"
        );
      }
      return true;
    }),
  body("status")
    .optional()
    .isIn([
      "PLANNED",
      "IN_PROGRESS",
      "COMPLETED",
      "SUBMITTED",
      "EVALUATED",
      "CANCELLED",
    ])
    .withMessage("Statut invalide"),
  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priorité invalide"),
  body("estimatedHours")
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage("Heures estimées invalides (0-1000)"),
  body("actualHours")
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage("Heures réelles invalides (0-1000)"),
  body("objectives")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Au moins un objectif est requis"),
  body("objectives.*")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Chaque objectif doit contenir entre 10 et 500 caractères"),
  body("outcomes")
    .optional()
    .isArray()
    .withMessage("Les résultats doivent être un tableau"),
  body("challenges")
    .optional()
    .isArray()
    .withMessage("Les défis doivent être un tableau"),
  body("learnings")
    .optional()
    .isArray()
    .withMessage("Les apprentissages doivent être un tableau"),
  body("collaborators")
    .optional()
    .isArray()
    .withMessage("Les collaborateurs doivent être un tableau"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Les tags doivent être un tableau"),
];

// Validation pour l'évaluation
const validateEvaluation = () => [
  body("score")
    .isInt({ min: 0, max: 100 })
    .withMessage("Le score doit être entre 0 et 100"),
  body("feedback")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Le feedback doit contenir entre 10 et 1000 caractères"),
  body("status")
    .optional()
    .isIn(["EVALUATED"])
    .withMessage("Statut invalide pour l'évaluation"),
];

// Validation pour les utilisateurs
const validateUser = () => [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .withMessage(
      "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    ),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email invalide")
    .custom(async (email) => {
      if (!email.endsWith("@2ie-edu.org")) {
        throw new Error("Utilisez votre adresse email institutionnelle 2iE");
      }
      return true;
    }),
  body("role")
    .isIn(["STUDENT", "LED_TEAM", "SUPERVISOR"])
    .withMessage("Rôle invalide"),
  body("filiere")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Filière invalide"),
  body("niveau")
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Niveau invalide"),
];

// Validation pour les recherches
const validateSearch = () => [
  body("nom")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nom de recherche invalide"),
  body("email").optional().isEmail().withMessage("Email de recherche invalide"),
  body("filiere")
    .optional()
    .isArray()
    .withMessage("Les filières doivent être un tableau"),
  body("niveau")
    .optional()
    .isArray()
    .withMessage("Les niveaux doivent être un tableau"),
  body("scoreMin")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Score minimum invalide"),
  body("scoreMax")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Score maximum invalide")
    .custom((scoreMax, { req }) => {
      if (req.body.scoreMin !== undefined && scoreMax < req.body.scoreMin) {
        throw new Error(
          "Le score maximum doit être supérieur au score minimum"
        );
      }
      return true;
    }),
  body("statut")
    .optional()
    .isArray()
    .withMessage("Les statuts doivent être un tableau"),
  body("typeActivite")
    .optional()
    .isArray()
    .withMessage("Les types d'activité doivent être un tableau"),
  body("periodeDebut")
    .optional()
    .isISO8601()
    .withMessage("Date de début de période invalide"),
  body("periodeFin")
    .optional()
    .isISO8601()
    .withMessage("Date de fin de période invalide")
    .custom((periodeFin, { req }) => {
      if (
        req.body.periodeDebut &&
        new Date(periodeFin) <= new Date(req.body.periodeDebut)
      ) {
        throw new Error(
          "La date de fin doit être postérieure à la date de début"
        );
      }
      return true;
    }),
];

// Validation pour les paramètres de pagination
const validatePagination = () => [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Numéro de page invalide"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limite par page invalide (1-100)"),
  query("search")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Terme de recherche invalide"),
];

// Validation pour les IDs UUID
const validateUUID = (field = "id") => [
  param(field).isUUID().withMessage(`${field} doit être un UUID valide`),
];

// Validation pour les changements de mot de passe
const validatePasswordChange = () => [
  body("currentPassword")
    .isLength({ min: 6 })
    .withMessage("Mot de passe actuel requis"),
  body("newPassword")
    .isLength({ min: 6, max: 128 })
    .withMessage(
      "Le nouveau mot de passe doit contenir entre 6 et 128 caractères"
    )
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("La confirmation du mot de passe ne correspond pas");
    }
    return true;
  }),
];

// Validation pour les exports
const validateExport = () => [
  body("format")
    .isIn(["csv", "excel", "pdf"])
    .withMessage("Format d'export invalide"),
  body("filters").optional().isObject().withMessage("Filtres invalides"),
];

module.exports = {
  validateActivity,
  validateEvaluation,
  validateUser,
  validateSearch,
  validatePagination,
  validateUUID,
  validatePasswordChange,
  validateExport,
};
