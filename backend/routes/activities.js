/*const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const upload = require("../middleware/upload");
const { authorize } = require("../middleware/auth");
const path = require("path");
const fs = require("fs-extra");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");
const {
  validateActivity,
  validateEvaluation,
  validateUUID,
  validateExport,
} = require("../middleware/validation");
const {
  formatActivity,
  prepareActivityForDB,
  safeJsonParse,
} = require("../utils/jsonUtils");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/activities - Récupérer les activités
router.get("/", async (req, res, next) => {
  try {
    const { userId, type, status, limit = 50, offset = 0 } = req.query;

    const where = {};

    // Les étudiants voient uniquement leurs activités
    // Les superviseurs et LED team voient toutes les activités ou celles d'un étudiant spécifique
    if (req.user.role === "student") {
      where.userId = req.user.id;
    } else if (req.user.role === "supervisor" || req.user.role === "led_team") {
      // Les superviseurs et administrateurs peuvent filtrer par étudiant
      if (userId) {
        where.userId = userId;
      }
      // Sinon ils voient toutes les activités
    }

    if (type) where.type = type;
    if (status) where.status = status;

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            filiere: true,
            niveau: true,
          },
        },
        evaluations: {
          include: {
            evaluator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    // Formatter les activités avec parsing JSON
    const formattedActivities = activities.map((activity) => {
      const formatted = formatActivity(activity);
      return {
        ...formatted,
        score: formatted.evaluations[0]?.score,
        maxScore: formatted.evaluations[0]?.maxScore,
        feedback: formatted.evaluations[0]?.feedback,
        evaluatorName: formatted.evaluations[0]?.evaluator.name,
        evaluatedAt: formatted.evaluations[0]?.createdAt,
      };
    });

    res.json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/activities - Créer une nouvelle activité
router.post("/", validateActivity(), async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Données invalides",
        details: errors.array(),
      });
    }

    const activityData = prepareActivityForDB({
      ...req.body,
      userId: req.user.id,
      progress:
        req.body.status === "completed"
          ? 100
          : req.body.status === "in_progress"
          ? 50
          : 0,
      submittedAt: req.body.status === "submitted" ? new Date() : null,
    });

    // Convertir les dates
    if (activityData.startDate) {
      activityData.startDate = new Date(activityData.startDate);
    }
    if (activityData.endDate) {
      activityData.endDate = new Date(activityData.endDate);
    }

    const activity = await prisma.activity.create({
      data: activityData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedActivity = formatActivity(activity);

    res.status(201).json({
      success: true,
      data: formattedActivity,
      message: "Activité créée avec succès",
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/activities/:id - Mettre à jour une activité
router.put(
  "/:id",
  validateUUID(),
  validateActivity(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: errors.array(),
        });
      }

      const { id } = req.params;

      const existingActivity = await prisma.activity.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

      if (!existingActivity) {
        return res.status(404).json({
          success: false,
          error: "Activité non trouvée ou accès non autorisé",
        });
      }

      if (existingActivity.status === "evaluated") {
        return res.status(400).json({
          success: false,
          error: "Impossible de modifier une activité déjà évaluée",
        });
      }

      const updateData = prepareActivityForDB(req.body);

      // Calculer le progrès
      if (updateData.status) {
        switch (updateData.status) {
          case "planned":
            updateData.progress = 0;
            break;
          case "in_progress":
            updateData.progress = 50;
            break;
          case "completed":
            updateData.progress = 100;
            break;
          case "submitted":
            updateData.progress = 100;
            break;
          case "evaluated":
            updateData.progress = 100;
            break;
        }
      }

      // Ajouter submittedAt si changement vers submitted
      if (
        updateData.status === "submitted" &&
        existingActivity.status !== "submitted"
      ) {
        updateData.submittedAt = new Date();
      }

      // Convertir les dates
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }

      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const formattedActivity = formatActivity(updatedActivity);

      res.json({
        success: true,
        data: formattedActivity,
        message: "Activité mise à jour avec succès",
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/activities/:id/documents - Upload de documents
router.post(
  "/:id/documents",
  validateUUID(),
  upload.array("documents", 10),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "ID invalide",
          details: errors.array(),
        });
      }

      const { id } = req.params;

      const activity = await prisma.activity.findFirst({
        where: {
          id,
          userId: req.user.id,
        },
      });

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: "Activité non trouvée ou accès non autorisé",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Aucun fichier fourni",
        });
      }

      // Générer les URLs des fichiers
      const documentUrls = req.files.map((file) => {
        return `/uploads/${req.user.id}/${file.filename}`;
      });

      // Parser les documents existants et ajouter les nouveaux
      const existingDocuments = safeJsonParse(activity.documents, []);
      const newDocuments = [...existingDocuments, ...documentUrls];

      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: {
          documents: JSON.stringify(newDocuments),
        },
      });

      res.json({
        success: true,
        data: {
          urls: documentUrls,
          activity: formatActivity(updatedActivity),
        },
        message: "Documents uploadés avec succès",
      });
    } catch (error) {
      // Nettoyer les fichiers en cas d'erreur
      if (req.files) {
        req.files.forEach((file) => {
          fs.remove(file.path).catch(console.error);
        });
      }
      next(error);
    }
  }
);

// POST /api/activities/:id/evaluate - Évaluer une activité
router.post(
  "/:id/evaluate",
  authorize("LED_TEAM", "SUPERVISOR"),
  validateUUID(),
  validateEvaluation(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: errors.array(),
        });
      }

      const { id } = req.params;
      const { score, feedback, status = "evaluated" } = req.body;

      const activity = await prisma.activity.findUnique({
        where: { id },
        include: {
          user: true,
          evaluations: true,
        },
      });

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: "Activité non trouvée",
        });
      }

      if (activity.status !== "submitted") {
        return res.status(400).json({
          success: false,
          error: "Cette activité n'a pas encore été soumise",
        });
      }

      // Créer ou mettre à jour l'évaluation
      const evaluation = await prisma.evaluation.upsert({
        where: {
          activityId: activity.id,
        },
        update: {
          score,
          feedback,
          evaluatorId: req.user.id,
        },
        create: {
          score,
          feedback,
          maxScore: 100,
          activityId: activity.id,
          evaluatorId: req.user.id,
        },
      });

      // Mettre à jour le statut de l'activité
      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: {
          status,
          evaluatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          evaluations: {
            include: {
              evaluator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      res.json({
        success: true,
        data: {
          activity: formatActivity(updatedActivity),
          evaluation,
        },
        message: "Activité évaluée avec succès",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;*/

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const upload = require("../middleware/upload");
const { authenticate, authorize } = require("../middleware/auth");
const path = require("path");
const fs = require("fs-extra");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");
const {
  validateActivity,
  validateEvaluation,
  validateUUID,
  validateExport,
} = require("../middleware/validation");
const {
  formatActivity,
  prepareActivityForDB,
  safeJsonParse,
} = require("../utils/jsonUtils");
const {
  scoreToGrade,
  calculateGPA,
  GRADING_SCALE,
} = require("../utils/grading");

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/activities - Récupérer les activités
 */
router.get("/", authenticate, async (req, res, next) => {
  try {
    console.log("GET /api/activities - User:", req.user);
    const { userId, type, status, limit = 50, offset = 0 } = req.query;

    const where = {};

    // Les étudiants voient uniquement leurs activités
    // Les superviseurs et LED team voient toutes les activités ou celles d'un étudiant spécifique
    if (req.user.role === "student") {
      where.userId = req.user.id;
    } else if (req.user.role === "supervisor" || req.user.role === "led_team") {
      // Les superviseurs et administrateurs peuvent filtrer par étudiant
      if (userId) {
        where.userId = userId;
      }
      // Sinon ils voient toutes les activités
    }

    if (type) where.type = type;
    if (status) where.status = status;

    console.log("Query where clause:", where);

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            filiere: true,
            niveau: true,
          },
        },
        evaluations: {
          include: {
            evaluator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    console.log("Found activities:", activities.length);

    const formattedActivities = activities.map((activity) => {
      const formatted = formatActivity(activity);
      const firstEvaluation = formatted.evaluations?.[0];
      
      // Ajouter la note lettre américaine si l'activité est évaluée
      let letterGrade = null;
      let gpa = null;
      let gradeDescription = null;
      
      if (firstEvaluation?.score !== null && firstEvaluation?.score !== undefined) {
        const gradeInfo = scoreToGrade(firstEvaluation.score, false);
        letterGrade = gradeInfo.grade;
        gpa = gradeInfo.gpa;
        gradeDescription = gradeInfo.description;
      }
      
      return {
        ...formatted,
        score: firstEvaluation?.score,
        maxScore: firstEvaluation?.maxScore,
        letterGrade,
        gpa,
        gradeDescription,
        feedback: firstEvaluation?.feedback,
        evaluatorName: firstEvaluation?.evaluator?.name,
        evaluatedAt: firstEvaluation?.createdAt,
      };
    });

    console.log("Sending response with", formattedActivities.length, "activities");
    res.json({ success: true, data: formattedActivities });
  } catch (error) {
    console.error("Error in GET /api/activities:", error);
    next(error);
  }
});

/**
 * POST /api/activities - Créer une nouvelle activité
 */
router.post("/", authenticate, validateActivity(), async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Erreurs de validation:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({
        success: false,
        error: "Données invalides",
        details: errors.array(),
      });
    }

    // Préparer les données avec valeurs par défaut
    const baseData = {
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      status: req.body.status || "planned",
      priority: req.body.priority || "medium",
      estimatedHours: req.body.estimatedHours || undefined,
      actualHours: req.body.actualHours || undefined,
      userId: req.user.id,
      progress:
        req.body.status === "completed"
          ? 100
          : req.body.status === "in_progress"
          ? 50
          : 0,
      submittedAt: req.body.status === "submitted" ? new Date() : undefined,
    };

    const { userId, ...baseDataWithoutUser } = baseData;

    const activityData = prepareActivityForDB({
      ...baseDataWithoutUser,
      collaborators: req.body.collaborators || [],
      objectives: req.body.objectives || [],
      outcomes: req.body.outcomes || [],
      challenges: req.body.challenges || [],
      learnings: req.body.learnings || [],
      tags: req.body.tags || [],
      documents: req.body.documents || [],
    });

    console.log("Données à insérer:", JSON.stringify(activityData, null, 2));

    // Remove null and undefined values from activityData
    const cleanedData = Object.fromEntries(
      Object.entries(activityData).filter(([_, value]) => value !== null && value !== undefined)
    );

    const activity = await prisma.activity.create({
      data: {
        ...cleanedData,
        user: {
          connect: { id: userId }
        }
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({
      success: true,
      data: formatActivity(activity),
      message: "Activité créée avec succès",
    });
  } catch (error) {
    console.error("Erreur création activité:", error);
    next(error);
  }
});

/**
 * PUT /api/activities/:id - Mettre à jour une activité
 */
router.put(
  "/:id",
  authenticate,
  validateUUID(),
  validateActivity(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: errors.array(),
        });
      }

      const { id } = req.params;

      const existingActivity = await prisma.activity.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!existingActivity) {
        return res.status(404).json({
          success: false,
          error: "Activité non trouvée ou accès non autorisé",
        });
      }

      if (existingActivity.status === "evaluated") {
        return res.status(400).json({
          success: false,
          error: "Impossible de modifier une activité déjà évaluée",
        });
      }

      const updateData = prepareActivityForDB(req.body);

      if (updateData.status) {
        switch (updateData.status) {
          case "planned":
            updateData.progress = 0;
            break;
          case "in_progress":
            updateData.progress = 50;
            break;
          case "completed":
            updateData.progress = 100;
            break;
          case "submitted":
          case "evaluated":
            updateData.progress = 100;
            break;
          default:
            updateData.progress = existingActivity.progress || 0;
        }
      }

      if (
        updateData.status === "submitted" &&
        existingActivity.status !== "submitted"
      ) {
        updateData.submittedAt = new Date();
      }

      if (updateData.startDate)
        updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: updateData,
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      res.json({
        success: true,
        data: formatActivity(updatedActivity),
        message: "Activité mise à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur mise à jour activité:", error);
      next(error);
    }
  }
);

/**
 * POST /api/activities/:id/documents - Upload de documents
 */
router.post(
  "/:id/documents",
  authenticate,
  validateUUID(),
  upload.array("documents", 10),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "ID invalide",
          details: errors.array(),
        });
      }

      const { id } = req.params;

      const activity = await prisma.activity.findFirst({
        where: { id, userId: req.user.id },
      });

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: "Activité non trouvée ou accès non autorisé",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "Aucun fichier fourni" });
      }

      const documentUrls = req.files.map(
        (file) => `/uploads/${req.user.id}/${file.filename}`
      );

      const existingDocuments = safeJsonParse(activity.documents, []);
      const newDocuments = [...existingDocuments, ...documentUrls];

      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: { documents: JSON.stringify(newDocuments) },
      });

      res.json({
        success: true,
        data: { urls: documentUrls, activity: formatActivity(updatedActivity) },
        message: "Documents uploadés avec succès",
      });
    } catch (error) {
      if (req.files) {
        req.files.forEach((file) => fs.remove(file.path).catch(console.error));
      }
      next(error);
    }
  }
);

/**
 * POST /api/activities/:id/evaluate - Évaluer une activité
 */
router.post(
  "/:id/evaluate",
  authenticate,
  authorize("led_team", "supervisor"),
  validateUUID(),
  validateEvaluation(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: errors.array(),
        });
      }

      const { id } = req.params;
      const { score, feedback, status = "evaluated" } = req.body;

      const activity = await prisma.activity.findUnique({
        where: { id },
        include: { user: true, evaluations: true },
      });

      if (!activity) {
        return res
          .status(404)
          .json({ success: false, error: "Activité non trouvée" });
      }

      if (activity.status !== "submitted") {
        return res.status(400).json({
          success: false,
          error: "Cette activité n'a pas encore été soumise",
        });
      }

      // Convertir le score numérique en note lettre américaine
      const gradeInfo = scoreToGrade(score, false); // false = utiliser le système simple A-F
      
      console.log(`Évaluation: Score ${score} => Note ${gradeInfo.grade} (GPA: ${gradeInfo.gpa})`);

      const evaluation = await prisma.evaluation.upsert({
        where: { activityId: activity.id },
        update: { 
          score, 
          feedback, 
          evaluatorId: req.user.id,
          // Stocker la note lettre dans les métadonnées ou dans un champ séparé
          // Pour l'instant, on l'ajoute dans le feedback pour compatibilité
        },
        create: {
          score,
          feedback,
          maxScore: 100,
          activityId: activity.id,
          evaluatorId: req.user.id,
        },
      });

      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: { status, evaluatedAt: new Date() },
        include: {
          user: { select: { id: true, name: true, email: true } },
          evaluations: {
            include: {
              evaluator: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });

      // Ajouter les informations de notation américaine dans la réponse
      const responseEvaluation = {
        ...evaluation,
        letterGrade: gradeInfo.grade,
        gpa: gradeInfo.gpa,
        gradeDescription: gradeInfo.description,
        gradeRange: gradeInfo.range,
      };

      res.json({
        success: true,
        data: { 
          activity: formatActivity(updatedActivity), 
          evaluation: responseEvaluation 
        },
        message: `Activité évaluée avec succès - Note: ${gradeInfo.grade} (${gradeInfo.description})`,
      });
    } catch (error) {
      console.error("Erreur évaluation activité:", error);
      next(error);
    }
  }
);

/**
 * POST /api/activities/export - Exporter les activités
 */
router.post("/export", authenticate, async (req, res, next) => {
  try {
    const { format } = req.body;
    const userId = req.user.role === "STUDENT" ? req.user.id : req.body.userId;

    if (!format || !["csv", "excel", "pdf"].includes(format)) {
      return res.status(400).json({
        success: false,
        error: "Format d'export invalide. Utilisez csv, excel ou pdf",
      });
    }

    // Récupérer les activités de l'utilisateur
    const activities = await prisma.activity.findMany({
      where: userId ? { userId } : {},
      include: {
        user: { select: { id: true, name: true, email: true } },
        evaluations: {
          include: {
            evaluator: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedActivities = activities.map((activity) =>
      formatActivity(activity)
    );

    if (format === "csv") {
      // Export CSV
      const XLSX = require("xlsx");
      const csvData = formattedActivities.map((activity) => ({
        Titre: activity.title,
        Type: activity.type,
        Description: activity.description,
        "Date de début": activity.startDate
          ? new Date(activity.startDate).toLocaleDateString("fr-FR")
          : "Non définie",
        "Date de fin": activity.endDate
          ? new Date(activity.endDate).toLocaleDateString("fr-FR")
          : "Non définie",
        Statut: activity.status,
        Priorité: activity.priority,
        Progression: `${activity.progress}%`,
        "Heures estimées": activity.estimatedHours || 0,
        "Heures réelles": activity.actualHours || 0,
        Collaborateurs: activity.collaborators
          ? activity.collaborators.join(", ")
          : "",
        Objectifs: activity.objectives ? activity.objectives.join(" | ") : "",
        Score:
          activity.evaluations && activity.evaluations.length > 0
            ? activity.evaluations[0].score
            : "",
        Feedback:
          activity.evaluations && activity.evaluations.length > 0
            ? activity.evaluations[0].feedback
            : "",
      }));

      const ws = XLSX.utils.json_to_sheet(csvData);
      const csv = XLSX.utils.sheet_to_csv(ws);

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="activites-led-${Date.now()}.csv"`
      );
      res.send("\uFEFF" + csv); // BOM pour UTF-8
    } else if (format === "excel") {
      // Export Excel
      const XLSX = require("xlsx");
      const excelData = formattedActivities.map((activity) => ({
        Titre: activity.title,
        Type: activity.type,
        Description: activity.description,
        "Date de début": activity.startDate
          ? new Date(activity.startDate).toLocaleDateString("fr-FR")
          : "Non définie",
        "Date de fin": activity.endDate
          ? new Date(activity.endDate).toLocaleDateString("fr-FR")
          : "Non définie",
        Statut: activity.status,
        Priorité: activity.priority,
        Progression: activity.progress,
        "Heures estimées": activity.estimatedHours || 0,
        "Heures réelles": activity.actualHours || 0,
        Collaborateurs: activity.collaborators
          ? activity.collaborators.join(", ")
          : "",
        Objectifs: activity.objectives ? activity.objectives.join(" | ") : "",
        Résultats: activity.outcomes ? activity.outcomes.join(" | ") : "",
        Défis: activity.challenges ? activity.challenges.join(" | ") : "",
        Apprentissages: activity.learnings
          ? activity.learnings.join(" | ")
          : "",
        Score:
          activity.evaluations && activity.evaluations.length > 0
            ? activity.evaluations[0].score
            : "",
        Feedback:
          activity.evaluations && activity.evaluations.length > 0
            ? activity.evaluations[0].feedback
            : "",
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Ajuster la largeur des colonnes
      const colWidths = [
        { wch: 40 }, // Titre
        { wch: 15 }, // Type
        { wch: 50 }, // Description
        { wch: 12 }, // Date début
        { wch: 12 }, // Date fin
        { wch: 12 }, // Statut
        { wch: 10 }, // Priorité
        { wch: 12 }, // Progression
        { wch: 12 }, // Heures estimées
        { wch: 12 }, // Heures réelles
        { wch: 30 }, // Collaborateurs
        { wch: 50 }, // Objectifs
        { wch: 50 }, // Résultats
        { wch: 50 }, // Défis
        { wch: 50 }, // Apprentissages
        { wch: 8 }, // Score
        { wch: 50 }, // Feedback
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Activités LED");

      const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="activites-led-${Date.now()}.xlsx"`
      );
      res.send(buffer);
    } else if (format === "pdf") {
      // Export PDF
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({ 
        size: "A4", 
        margin: 50,
        bufferPages: true
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="activites-led-${Date.now()}.pdf"`
      );

      // Important: gérer les erreurs du stream
      doc.on('error', (err) => {
        console.error('PDF generation error:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, error: 'Erreur de génération PDF' });
        }
      });

      doc.pipe(res);

      try {
        // Titre du document
        doc
          .fontSize(20)
          .font("Helvetica-Bold")
          .text("Rapport des Activites LED", { align: "center" });
        doc.moveDown();
        doc
          .fontSize(10)
          .font("Helvetica")
          .text(`Date d'export: ${new Date().toLocaleDateString("fr-FR")}`, {
            align: "center",
          });
        doc
          .text(`Nombre d'activites: ${formattedActivities.length}`, {
            align: "center",
          });
        doc.moveDown(2);

        // Si aucune activité, ajouter un message
        if (formattedActivities.length === 0) {
          doc
            .fontSize(12)
            .text("Aucune activite a afficher.", { align: "center" });
        }

        // Liste des activités
        formattedActivities.forEach((activity, index) => {
          try {
            // Vérifier s'il faut ajouter une nouvelle page
            if (doc.y > 650) {
              doc.addPage();
            }

            // Titre de l'activité (sans couleur problématique)
            doc
              .fontSize(14)
              .font("Helvetica-Bold")
              .fillColor("blue")
              .text(`${index + 1}. ${activity.title || "Sans titre"}`)
              .fillColor("black");
            doc.moveDown(0.5);

            // Informations de base
            doc.fontSize(10).font("Helvetica");
            doc.text(`Type: ${activity.type || "Non specifie"}`);
            doc.text(`Statut: ${activity.status || "Non specifie"}`);
            doc.text(`Priorite: ${activity.priority || "Non specifiee"}`);

            if (activity.startDate || activity.endDate) {
              const startStr = activity.startDate
                ? new Date(activity.startDate).toLocaleDateString("fr-FR")
                : "Non definie";
              const endStr = activity.endDate
                ? new Date(activity.endDate).toLocaleDateString("fr-FR")
                : "Non definie";
              doc.text(`Periode: ${startStr} - ${endStr}`);
            }

            doc.text(`Progression: ${activity.progress || 0}%`);
            doc.moveDown(0.5);

            // Description
            doc.fontSize(9).font("Helvetica-Bold").text("Description:");
            doc.font("Helvetica");
            const description = (activity.description || "Aucune description")
              .substring(0, 500); // Limiter la longueur
            doc.text(description, { width: 500, align: "justify" });
            doc.moveDown(0.5);

            // Objectifs
            if (activity.objectives && activity.objectives.length > 0) {
              doc.font("Helvetica-Bold").text("Objectifs:");
              doc.font("Helvetica");
              activity.objectives.slice(0, 5).forEach((obj) => {
                if (obj && obj.trim()) {
                  const objText = obj.substring(0, 200); // Limiter la longueur
                  doc.text(`  - ${objText}`, { width: 480 });
                }
              });
              doc.moveDown(0.5);
            }

            // Résultats
            if (activity.outcomes && activity.outcomes.length > 0) {
              doc.font("Helvetica-Bold").text("Resultats:");
              doc.font("Helvetica");
              activity.outcomes.slice(0, 5).forEach((outcome) => {
                if (outcome && outcome.trim()) {
                  const outcomeText = outcome.substring(0, 200);
                  doc.text(`  - ${outcomeText}`, { width: 480 });
                }
              });
              doc.moveDown(0.5);
            }

            // Évaluation
            if (activity.evaluations && activity.evaluations.length > 0) {
              const evaluation = activity.evaluations[0];
              const gradeInfo = scoreToGrade(evaluation.score, false);
              
              doc.font("Helvetica-Bold");
              doc.fillColor("green");
              doc.text(`Score: ${evaluation.score || 0}/100 - Note: ${gradeInfo.grade} (${gradeInfo.description})`);
              doc.fillColor("black");
              doc.font("Helvetica");
              if (evaluation.feedback) {
                const feedbackText = evaluation.feedback.substring(0, 300);
                doc.text(`Feedback: ${feedbackText}`, { width: 480 });
              }
              doc.moveDown(0.5);
            }

            // Séparateur
            doc
              .strokeColor("gray")
              .lineWidth(1)
              .moveTo(50, doc.y)
              .lineTo(550, doc.y)
              .stroke()
              .strokeColor("black");
            doc.moveDown(1);

          } catch (activityError) {
            console.error(`Error processing activity ${index}:`, activityError);
            doc.fontSize(10).fillColor("red");
            doc.text(`Erreur lors du traitement de l'activite ${index + 1}`);
            doc.fillColor("black");
            doc.moveDown(1);
          }
        });

        // Pied de page sur chaque page
        const range = doc.bufferedPageRange();
        for (let i = 0; i < range.count; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(8)
            .font("Helvetica")
            .fillColor("gray")
            .text(
              `Page ${i + 1} sur ${range.count}`,
              50,
              doc.page.height - 50,
              { align: "center", width: 500 }
            );
        }

        // Finaliser le document
        doc.end();

      } catch (pdfError) {
        console.error('PDF content error:', pdfError);
        doc.end();
        throw pdfError;
      }
    }
  } catch (error) {
    console.error("Erreur export activités:", error);
    next(error);
  }
});

/**
 * GET /api/activities/grading/scale - Obtenir l'échelle de notation
 */
router.get("/grading/scale", authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        scale: GRADING_SCALE,
        description: "Système de notation américain (A-F)",
        note: "Les scores numériques (0-100) sont automatiquement convertis en notes lettres"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération de l'échelle de notation"
    });
  }
});

module.exports = router;
