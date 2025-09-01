const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, param, query, validationResult } = require("express-validator");
const upload = require("../middleware/upload");
const { authorize } = require("../middleware/auth");
const path = require("path");
const fs = require("fs-extra");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");

const router = express.Router();
const prisma = new PrismaClient();

// Validation pour les activités
const activityValidation = [
  body("title")
    .isLength({ min: 3, max: 200 })
    .withMessage("Le titre doit contenir entre 3 et 200 caractères"),
  body("type")
    .isIn(["ENTREPRENEURIAT", "LEADERSHIP", "DIGITAL"])
    .withMessage("Type d'activité invalide"),
  body("description")
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
    .withMessage("Heures estimées invalides"),
  body("actualHours")
    .optional()
    .isInt({ min: 0, max: 1000 })
    .withMessage("Heures réelles invalides"),
  body("objectives")
    .optional()
    .isArray()
    .withMessage("Les objectifs doivent être un tableau"),
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

// GET /api/activities - Récupérer les activités
router.get("/", async (req, res, next) => {
  try {
    const { userId, type, status, limit = 50, offset = 0 } = req.query;

    // Construire les filtres
    const where = {};

    // Filtrer par utilisateur (superviseurs peuvent voir tous les étudiants)
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

    // Formatter les activités pour le frontend
    const formattedActivities = activities.map((activity) => ({
      ...activity,
      startDate: activity.startDate,
      endDate: activity.endDate,
      score: activity.evaluations[0]?.score,
      maxScore: activity.evaluations[0]?.maxScore,
      feedback: activity.evaluations[0]?.feedback,
      evaluatorName: activity.evaluations[0]?.evaluator.name,
      evaluatedAt: activity.evaluations[0]?.createdAt,
    }));

    res.json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/activities/:id - Récupérer une activité spécifique
router.get("/:id", param("id").isUUID(), async (req, res, next) => {
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

    const where = { id };
    // Les étudiants ne peuvent voir que leurs propres activités
    if (req.user.role === "STUDENT") {
      where.userId = req.user.id;
    }

    const activity = await prisma.activity.findFirst({
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
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Activité non trouvée",
      });
    }

    // Formatter l'activité
    const formattedActivity = {
      ...activity,
      score: activity.evaluations[0]?.score,
      maxScore: activity.evaluations[0]?.maxScore,
      feedback: activity.evaluations[0]?.feedback,
      evaluatorName: activity.evaluations[0]?.evaluator.name,
      evaluatedAt: activity.evaluations[0]?.createdAt,
    };

    res.json({
      success: true,
      data: formattedActivity,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/activities - Créer une nouvelle activité
router.post("/", activityValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Données invalides",
        details: errors.array(),
      });
    }

    const {
      title,
      type,
      description,
      startDate,
      endDate,
      status = "PLANNED",
      priority = "MEDIUM",
      estimatedHours,
      actualHours,
      objectives = [],
      outcomes = [],
      challenges = [],
      learnings = [],
      collaborators = [],
      tags = [],
    } = req.body;

    // Calculer le progrès basé sur le statut
    let progress = 0;
    switch (status) {
      case "IN_PROGRESS":
        progress = 50;
        break;
      case "COMPLETED":
        progress = 100;
        break;
      case "SUBMITTED":
        progress = 100;
        break;
      case "EVALUATED":
        progress = 100;
        break;
      default:
        progress = 0;
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        type,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        priority,
        progress,
        estimatedHours,
        actualHours,
        objectives,
        outcomes,
        challenges,
        learnings,
        collaborators: collaborators.filter((c) => c.trim()),
        tags,
        documents: [],
        userId: req.user.id,
        submittedAt: status === "SUBMITTED" ? new Date() : null,
      },
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

    res.status(201).json({
      success: true,
      data: activity,
      message: "Activité créée avec succès",
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/activities/:id - Mettre à jour une activité
router.put(
  "/:id",
  param("id").isUUID(),
  activityValidation,
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

      // Vérifier que l'activité existe et appartient à l'utilisateur
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

      // Vérifier si l'activité peut être modifiée
      if (existingActivity.status === "EVALUATED") {
        return res.status(400).json({
          success: false,
          error: "Impossible de modifier une activité déjà évaluée",
        });
      }

      const {
        title,
        type,
        description,
        startDate,
        endDate,
        status,
        priority,
        estimatedHours,
        actualHours,
        objectives,
        outcomes,
        challenges,
        learnings,
        collaborators,
        tags,
      } = req.body;

      // Calculer le progrès
      let progress = existingActivity.progress;
      if (status) {
        switch (status) {
          case "PLANNED":
            progress = 0;
            break;
          case "IN_PROGRESS":
            progress = 50;
            break;
          case "COMPLETED":
            progress = 100;
            break;
          case "SUBMITTED":
            progress = 100;
            break;
          case "EVALUATED":
            progress = 100;
            break;
        }
      }

      const updateData = {
        title,
        type,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        priority,
        progress,
        estimatedHours,
        actualHours,
        objectives,
        outcomes,
        challenges,
        learnings,
        collaborators: collaborators?.filter((c) => c.trim()),
        tags,
      };

      // Ajouter submittedAt si le statut change vers SUBMITTED
      if (status === "SUBMITTED" && existingActivity.status !== "SUBMITTED") {
        updateData.submittedAt = new Date();
      }

      // Supprimer les valeurs undefined
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

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

      res.json({
        success: true,
        data: updatedActivity,
        message: "Activité mise à jour avec succès",
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/activities/:id - Supprimer une activité
router.delete("/:id", param("id").isUUID(), async (req, res, next) => {
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

    // Vérifier si l'activité peut être supprimée
    if (activity.status === "EVALUATED") {
      return res.status(400).json({
        success: false,
        error: "Impossible de supprimer une activité déjà évaluée",
      });
    }

    // Supprimer les fichiers associés
    if (activity.documents && activity.documents.length > 0) {
      for (const docUrl of activity.documents) {
        try {
          const filePath = path.join(
            __dirname,
            "../../uploads",
            req.user.id,
            path.basename(docUrl)
          );
          await fs.remove(filePath);
        } catch (fileError) {
          console.error("Erreur suppression fichier:", fileError);
        }
      }
    }

    await prisma.activity.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Activité supprimée avec succès",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

//------------------------------------------------//

// POST /api/activities/:id/documents - Upload de documents
router.post(
  "/:id/documents",
  param("id").isUUID(),
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

      // Vérifier que l'activité existe et appartient à l'utilisateur
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

      // Mettre à jour l'activité avec les nouveaux documents
      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: {
          documents: [...activity.documents, ...documentUrls],
        },
      });

      res.json({
        success: true,
        data: {
          urls: documentUrls,
          activity: updatedActivity,
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

// POST /api/activities/:id/submit - Soumettre une activité
router.post("/:id/submit", param("id").isUUID(), async (req, res, next) => {
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

    if (activity.status === "SUBMITTED" || activity.status === "EVALUATED") {
      return res.status(400).json({
        success: false,
        error: "Cette activité a déjà été soumise",
      });
    }

    // Vérifier que l'activité est complète
    if (!activity.description || activity.description.length < 100) {
      return res.status(400).json({
        success: false,
        error: "La description doit contenir au moins 100 caractères",
      });
    }

    const now = new Date();
    const isLate = now > activity.endDate;

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        progress: 100,
        submittedAt: now,
        isLateSubmission: isLate,
      },
    });

    res.json({
      success: true,
      data: updatedActivity,
      message: isLate
        ? "Activité soumise en retard"
        : "Activité soumise avec succès",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/activities/:id/evaluate - Évaluer une activité (superviseurs uniquement)
router.post(
  "/:id/evaluate",
  authorize("LED_TEAM", "SUPERVISOR"),
  param("id").isUUID(),
  [
    body("score")
      .isInt({ min: 0, max: 100 })
      .withMessage("Score invalide (0-100)"),
    body("feedback")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Feedback trop long"),
    body("status")
      .optional()
      .isIn(["EVALUATED"])
      .withMessage("Statut invalide"),
  ],
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
          activity: updatedActivity,
          evaluation,
        },
        message: "Activité évaluée avec succès",
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/activities/export - Exporter les activités
router.post(
  "/export",
  [
    body("format").isIn(["csv", "excel", "pdf"]).withMessage("Format invalide"),
    body("activities").isArray().withMessage("Activités invalides"),
  ],
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

      const { format, activities } = req.body;

      if (format === "csv") {
        // Export CSV
        const csvData = activities.map((activity) => ({
          Titre: activity.title,
          Type: activity.type,
          Description: activity.description.substring(0, 100) + "...",
          "Date début": new Date(activity.startDate).toLocaleDateString(
            "fr-FR"
          ),
          "Date fin": new Date(activity.endDate).toLocaleDateString("fr-FR"),
          Statut: activity.status,
          Progrès: `${activity.progress}%`,
          Score: activity.score || "Non évalué",
          Priorité: activity.priority,
          "Heures estimées": activity.estimatedHours || "",
          "Heures réelles": activity.actualHours || "",
        }));

        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Activités");

        const buffer = XLSX.write(wb, { type: "buffer", bookType: "csv" });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=activites.csv"
        );
        res.send(buffer);
      } else if (format === "excel") {
        // Export Excel
        const excelData = activities.map((activity) => ({
          Titre: activity.title,
          Type: activity.type,
          Description: activity.description,
          "Date début": new Date(activity.startDate).toLocaleDateString(
            "fr-FR"
          ),
          "Date fin": new Date(activity.endDate).toLocaleDateString("fr-FR"),
          Statut: activity.status,
          Progrès: activity.progress,
          Score: activity.score || "Non évalué",
          Feedback: activity.feedback || "",
          Priorité: activity.priority,
          "Heures estimées": activity.estimatedHours || "",
          "Heures réelles": activity.actualHours || "",
          Objectifs: activity.objectives?.join("; ") || "",
          Résultats: activity.outcomes?.join("; ") || "",
          Défis: activity.challenges?.join("; ") || "",
          Apprentissages: activity.learnings?.join("; ") || "",
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Mes Activités LED");

        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=activites.xlsx"
        );
        res.send(buffer);
      } else if (format === "pdf") {
        // Export PDF
        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=activites.pdf"
        );

        doc.pipe(res);

        // Titre
        doc.fontSize(20).text("Mes Activités LED", { align: "center" });
        doc.moveDown(2);

        // Activités
        activities.forEach((activity, index) => {
          doc.fontSize(16).text(`${index + 1}. ${activity.title}`);
          doc.fontSize(12).text(`Type: ${activity.type}`);
          doc.text(
            `Période: ${new Date(activity.startDate).toLocaleDateString(
              "fr-FR"
            )} - ${new Date(activity.endDate).toLocaleDateString("fr-FR")}`
          );
          doc.text(`Statut: ${activity.status} (${activity.progress}%)`);
          if (activity.score) {
            doc.text(`Score: ${activity.score}/100`);
          }
          doc.text(`Description: ${activity.description.substring(0, 200)}...`);
          doc.moveDown();

          // Nouvelle page si nécessaire
          if (doc.y > 700) {
            doc.addPage();
          }
        });

        doc.end();
      }
    } catch (error) {
      next(error);
    }
  }
);
