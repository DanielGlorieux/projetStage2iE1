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

    if (req.user.role === "STUDENT") {
      where.userId = req.user.id;
    } else if (userId) {
      where.userId = userId;
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
        req.body.status === "COMPLETED"
          ? 100
          : req.body.status === "IN_PROGRESS"
          ? 50
          : 0,
      submittedAt: req.body.status === "SUBMITTED" ? new Date() : null,
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

      if (existingActivity.status === "EVALUATED") {
        return res.status(400).json({
          success: false,
          error: "Impossible de modifier une activité déjà évaluée",
        });
      }

      const updateData = prepareActivityForDB(req.body);

      // Calculer le progrès
      if (updateData.status) {
        switch (updateData.status) {
          case "PLANNED":
            updateData.progress = 0;
            break;
          case "IN_PROGRESS":
            updateData.progress = 50;
            break;
          case "COMPLETED":
            updateData.progress = 100;
            break;
          case "SUBMITTED":
            updateData.progress = 100;
            break;
          case "EVALUATED":
            updateData.progress = 100;
            break;
        }
      }

      // Ajouter submittedAt si changement vers SUBMITTED
      if (
        updateData.status === "SUBMITTED" &&
        existingActivity.status !== "SUBMITTED"
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
      const { score, feedback, status = "EVALUATED" } = req.body;

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

      if (activity.status !== "SUBMITTED") {
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

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/activities - Récupérer les activités
 */
router.get("/", authenticate, async (req, res, next) => {
  try {
    const { userId, type, status, limit = 50, offset = 0 } = req.query;

    const where = {};

    if (req.user.role === "STUDENT") {
      where.userId = req.user.id;
    } else if (userId) {
      where.userId = userId;
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
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

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

    res.json({ success: true, data: formattedActivities });
  } catch (error) {
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
        req.body.status === "COMPLETED"
          ? 100
          : req.body.status === "IN_PROGRESS"
          ? 50
          : 0,
      submittedAt: req.body.status === "SUBMITTED" ? new Date() : null,
    });

    if (activityData.startDate)
      activityData.startDate = new Date(activityData.startDate);
    if (activityData.endDate)
      activityData.endDate = new Date(activityData.endDate);

    const activity = await prisma.activity.create({
      data: activityData,
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

      if (existingActivity.status === "EVALUATED") {
        return res.status(400).json({
          success: false,
          error: "Impossible de modifier une activité déjà évaluée",
        });
      }

      const updateData = prepareActivityForDB(req.body);

      if (updateData.status) {
        switch (updateData.status) {
          case "PLANNED":
            updateData.progress = 0;
            break;
          case "IN_PROGRESS":
            updateData.progress = 50;
            break;
          default:
            updateData.progress = 100;
        }
      }

      if (
        updateData.status === "SUBMITTED" &&
        existingActivity.status !== "SUBMITTED"
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
        return res
          .status(400)
          .json({
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
  authorize("LED_TEAM", "SUPERVISOR"),
  validateUUID(),
  validateEvaluation(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Données invalides",
            details: errors.array(),
          });
      }

      const { id } = req.params;
      const { score, feedback, status = "EVALUATED" } = req.body;

      const activity = await prisma.activity.findUnique({
        where: { id },
        include: { user: true, evaluations: true },
      });

      if (!activity) {
        return res
          .status(404)
          .json({ success: false, error: "Activité non trouvée" });
      }

      if (activity.status !== "SUBMITTED") {
        return res
          .status(400)
          .json({
            success: false,
            error: "Cette activité n'a pas encore été soumise",
          });
      }

      const evaluation = await prisma.evaluation.upsert({
        where: { activityId: activity.id },
        update: { score, feedback, evaluatorId: req.user.id },
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

      res.json({
        success: true,
        data: { activity: formatActivity(updatedActivity), evaluation },
        message: "Activité évaluée avec succès",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
