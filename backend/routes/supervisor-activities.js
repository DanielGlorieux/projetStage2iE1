const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const { authorize, authenticate } = require("../middleware/auth");
const nodemailer = require("nodemailer");

const router = express.Router();
const prisma = new PrismaClient();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// POST /api/supervisor-activities - Créer une activité et l'assigner à des étudiants
router.post(
  "/",
  authorize("supervisor", "led_team"),
  [
    body("title").trim().isLength({ min: 3, max: 200 }).withMessage("Le titre doit contenir entre 3 et 200 caractères"),
    body("type").isIn(["entrepreneuriat", "leadership", "digital"]).withMessage("Type d'activité invalide"),
    body("description").trim().isLength({ min: 10 }).withMessage("La description doit contenir au moins 10 caractères"),
    body("deadline").isISO8601().withMessage("Date limite invalide"),
    body("studentIds").isArray({ min: 1 }).withMessage("Au moins un étudiant doit être assigné"),
    body("studentIds.*").isUUID().withMessage("ID étudiant invalide")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: errors.array()
        });
      }

      const { title, type, description, deadline, studentIds, objectives, estimatedHours } = req.body;

      // Vérifier que tous les étudiants existent
      const students = await prisma.user.findMany({
        where: {
          id: { in: studentIds },
          role: "student"
        }
      });

      if (students.length !== studentIds.length) {
        return res.status(404).json({
          success: false,
          error: "Un ou plusieurs étudiants non trouvés"
        });
      }

      // Créer une activité pour chaque étudiant assigné
      const createdActivities = await Promise.all(
        studentIds.map(async (studentId) => {
          return await prisma.activity.create({
            data: {
              title,
              type,
              description,
              deadline: new Date(deadline),
              status: "planned",
              isSupervisorCreated: true,
              userId: studentId,
              creatorId: req.user.id,
              objectives: JSON.stringify(objectives || []),
              estimatedHours: estimatedHours || null,
              assignedStudents: JSON.stringify([studentId])
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              creator: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          });
        })
      );

      res.status(201).json({
        success: true,
        data: createdActivities,
        message: `Activité créée et assignée à ${studentIds.length} étudiant(s)`
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/supervisor-activities - Récupérer les activités créées par le superviseur
router.get("/", authorize("supervisor", "led_team"), async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        creatorId: req.user.id,
        isSupervisorCreated: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            filiere: true,
            niveau: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        evaluations: {
          include: {
            evaluator: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/supervisor-activities/:id/evaluate - Noter une activité créée par le superviseur
router.post(
  "/:id/evaluate",
  authorize("supervisor", "led_team"),
  [
    body("score").isInt({ min: 0, max: 100 }).withMessage("Le score doit être entre 0 et 100"),
    body("feedback").optional().trim().isLength({ max: 2000 }).withMessage("Le feedback ne peut pas dépasser 2000 caractères")
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: errors.array()
        });
      }

      const { id } = req.params;
      const { score, feedback } = req.body;

      // Vérifier que l'activité existe et a été créée par ce superviseur
      const activity = await prisma.activity.findUnique({
        where: { id },
        include: {
          creator: true,
          user: true
        }
      });

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: "Activité non trouvée"
        });
      }

      if (activity.creatorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "Seul le créateur de cette activité peut la noter"
        });
      }

      if (!activity.isSupervisorCreated) {
        return res.status(400).json({
          success: false,
          error: "Cette route est réservée aux activités créées par un superviseur"
        });
      }

      // Vérifier si l'activité est soumise
      if (activity.status !== "submitted") {
        return res.status(400).json({
          success: false,
          error: "L'activité doit être soumise avant d'être évaluée"
        });
      }

      // Créer ou mettre à jour l'évaluation
      const evaluation = await prisma.evaluation.upsert({
        where: { activityId: id },
        create: {
          activityId: id,
          evaluatorId: req.user.id,
          score,
          feedback: feedback || null,
          maxScore: 100
        },
        update: {
          score,
          feedback: feedback || null,
          updatedAt: new Date()
        },
        include: {
          evaluator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Mettre à jour le statut de l'activité
      await prisma.activity.update({
        where: { id },
        data: {
          status: "evaluated",
          evaluatedAt: new Date()
        }
      });

      res.json({
        success: true,
        data: evaluation,
        message: "Activité évaluée avec succès"
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/supervisor-activities/:id/remind - Envoyer un rappel pour une activité
router.post(
  "/:id/remind",
  authorize("supervisor", "led_team"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Vérifier que l'activité existe et a été créée par ce superviseur
      const activity = await prisma.activity.findUnique({
        where: { id },
        include: {
          creator: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: "Activité non trouvée"
        });
      }

      if (activity.creatorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "Seul le créateur de cette activité peut envoyer des rappels"
        });
      }

      // Ne pas envoyer de rappel si déjà évaluée
      if (activity.status === "evaluated") {
        return res.status(400).json({
          success: false,
          error: "L'activité est déjà évaluée"
        });
      }

      // Envoyer un email de rappel (configuration à adapter)
      try {
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        const deadline = new Date(activity.deadline);
        const daysRemaining = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: activity.user.email,
          subject: `Rappel: ${activity.title}`,
          html: `
            <h2>Rappel d'activité LED</h2>
            <p>Bonjour ${activity.user.name},</p>
            <p>Ceci est un rappel concernant l'activité suivante:</p>
            <ul>
              <li><strong>Titre:</strong> ${activity.title}</li>
              <li><strong>Type:</strong> ${activity.type}</li>
              <li><strong>Deadline:</strong> ${deadline.toLocaleDateString('fr-FR')}</li>
              <li><strong>Jours restants:</strong> ${daysRemaining}</li>
            </ul>
            <p>Description: ${activity.description}</p>
            <p>Veuillez compléter cette activité avant la date limite.</p>
            <p>Cordialement,<br/>${activity.creator.name}</p>
          `
        });

        // Marquer le rappel comme envoyé
        await prisma.activity.update({
          where: { id },
          data: {
            reminderSent: true
          }
        });

        res.json({
          success: true,
          message: "Rappel envoyé avec succès"
        });
      } catch (emailError) {
        console.error("Erreur envoi email:", emailError);
        // Continuer même si l'email échoue
        res.json({
          success: true,
          message: "Rappel enregistré (email non envoyé)",
          warning: "La configuration email n'est pas complète"
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/supervisor-activities/:id - Supprimer une activité créée par le superviseur
router.delete("/:id", authorize("supervisor", "led_team"), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier que l'activité existe et a été créée par ce superviseur
    const activity = await prisma.activity.findUnique({
      where: { id }
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        error: "Activité non trouvée"
      });
    }

    if (activity.creatorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Seul le créateur de cette activité peut la supprimer"
      });
    }

    await prisma.activity.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "Activité supprimée avec succès"
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
