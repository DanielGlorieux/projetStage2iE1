const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, param, validationResult } = require("express-validator");
const { authorize, authenticate } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/users/scholars - Récupérer tous les étudiants avec leurs statistiques
router.get(
  "/scholars",
  authorize("led_team", "supervisor"),
  async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 50,
        search,
        filiere,
        niveau,
        status,
      } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where = {
        role: "student",
      };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (filiere) {
        where.filiere = filiere;
      }

      if (niveau) {
        where.niveau = niveau;
      }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          filiere: true,
          niveau: true,
          createdAt: true,
          activities: {
            include: {
              evaluations: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
      });

      const total = await prisma.user.count({ where });

      // Calculer les statistiques pour chaque étudiant
      const scholarsWithStats = users.map((user) => {
        const activities = user.activities;
        const completedActivities = activities.filter(
          (a) => a.status === "completed" || a.status === "evaluated"
        );

        const scores = {
          entrepreneuriat: 0,
          leadership: 0,
          digital: 0,
        };

        const counts = {
          entrepreneuriat: 0,
          leadership: 0,
          digital: 0,
        };

        activities.forEach((activity) => {
          if (activity.evaluations.length > 0) {
            const type = activity.type;
            if (scores.hasOwnProperty(type)) {
              scores[type] += activity.evaluations[0].score;
              counts[type]++;
            }
          }
        });

        Object.keys(scores).forEach((type) => {
          if (counts[type] > 0) {
            scores[type] = Math.round(scores[type] / counts[type]);
          }
        });

        const globalScore = Math.round(
          (scores.entrepreneuriat + scores.leadership + scores.digital) / 3
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          filiere: user.filiere,
          niveau: user.niveau,
          createdAt: user.createdAt,
          stats: {
            totalActivities: activities.length,
            completedActivities: completedActivities.length,
            completionRate:
              activities.length > 0
                ? Math.round(
                    (completedActivities.length / activities.length) * 100
                  )
                : 0,
            scores,
            globalScore,
          },
        };
      });

      res.json({
        success: true,
        data: scholarsWithStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Erreur récupération scholars:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  }
);

// GET /api/users/me - Récupérer le profil de l'utilisateur connecté
router.get("/me", async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        filiere: true,
        niveau: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du profil",
    });
  }
});

// PUT /api/users/me - Mettre à jour le profil de l'utilisateur connecté
router.put("/me", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, filiere, niveau } = req.body;

    // Validation basique
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Le nom est requis",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        filiere: filiere || null,
        niveau: niveau || null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        filiere: true,
        niveau: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
      message: "Profil mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du profil",
    });
  }
});

// PUT /api/users/password - Changer le mot de passe
router.put(
  "/password",
  authenticate,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Le mot de passe actuel est requis"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage(
        "Le nouveau mot de passe doit contenir au moins 6 caractères"
      ),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Données invalides",
          details: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Récupérer l'utilisateur avec son mot de passe
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur non trouvé",
        });
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: "Mot de passe actuel incorrect",
        });
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { password: hashedNewPassword },
      });

      res.json({
        success: true,
        message: "Mot de passe modifié avec succès",
      });
    } catch (error) {
      console.error("Erreur changement mot de passe:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  }
);

// GET /api/users - Récupérer tous les utilisateurs (superviseurs uniquement)
router.get("/", authorize("led_team", "supervisor"), async (req, res, next) => {
  try {
    const { role, page = 1, limit = 50, search } = req.query;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        filiere: true,
        niveau: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            activities: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    const total = await prisma.user.count({ where });

    res.json({
      success: true,
      data: users,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Récupérer un utilisateur spécifique
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

    const targetId = req.user.role === "student" ? req.user.id : id;

    const user = await prisma.user.findUnique({
      where: { id: targetId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        filiere: true,
        niveau: true,
        createdAt: true,
        updatedAt: true,
        activities: {
          include: {
            evaluations: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé",
      });
    }

    // Calculer les statistiques
    const stats = {
      activitesTotal: user.activities.length,
      activitesCompletes: user.activities.filter(
        (a) => a.status === "completed" || a.status === "evaluated"
      ).length,
      scoresMoyens: {
        entrepreneuriat: 0,
        leadership: 0,
        digital: 0,
      },
    };

    const scoresByType = {
      entrepreneuriat: [],
      leadership: [],
      digital: [],
    };

    user.activities.forEach((activity) => {
      if (activity.evaluations.length > 0) {
        const activityType = activity.type.toLowerCase();
        if (scoresByType[activityType]) {
          scoresByType[activityType].push(activity.evaluations[0].score);
        }
      }
    });

    Object.keys(scoresByType).forEach((type) => {
      const scores = scoresByType[type];
      if (scores.length > 0) {
        const avg =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        stats.scoresMoyens[type] = Math.round(avg);
      }
    });

    const globalScore = Math.round(
      (stats.scoresMoyens.entrepreneuriat +
        stats.scoresMoyens.leadership +
        stats.scoresMoyens.digital) /
        3
    );

    res.json({
      success: true,
      data: {
        ...user,
        stats: {
          ...stats,
          globalScore,
          scores: stats.scoresMoyens,
        },
      },
    });
  } catch (error) {
    console.error("Erreur GET /users/:id:", error);
    next(error);
  }
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put(
  "/:id",
  param("id").isUUID(),
  [
    body("name")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("Nom invalide"),
    body("email").optional().isEmail().withMessage("Email invalide"),
    body("role")
      .optional()
      .isIn(["student", "led_team", "supervisor"])
      .withMessage("Rôle invalide"),
    body("filiere").optional().isString().withMessage("Filière invalide"),
    body("niveau").optional().isString().withMessage("Niveau invalide"),
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
      const { name, email, role, filiere, niveau } = req.body;

      // Vérifier les permissions
      if (req.user.role === "student" && req.user.id !== id) {
        return res.status(403).json({
          success: false,
          error: "Accès non autorisé",
        });
      }

      // Les étudiants ne peuvent pas changer leur rôle
      if (req.user.role === "student" && role && role !== "student") {
        return res.status(403).json({
          success: false,
          error: "Vous ne pouvez pas modifier votre rôle",
        });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined && req.user.role !== "student")
        updateData.role = role;
      if (filiere !== undefined) updateData.filiere = filiere;
      if (niveau !== undefined) updateData.niveau = niveau;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          filiere: true,
          niveau: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: updatedUser,
        message: "Profil mis à jour avec succès",
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({
          success: false,
          error: "Cet email est déjà utilisé",
        });
      }
      next(error);
    }
  }
);

// DELETE /api/users/:id - Supprimer un utilisateur (superviseurs uniquement)
router.delete(
  "/:id",
  authorize("led_team", "supervisor"),
  param("id").isUUID(),
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

      // Empêcher l'auto-suppression
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          error: "Vous ne pouvez pas supprimer votre propre compte",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          activities: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur non trouvé",
        });
      }

      // Supprimer l'utilisateur (cascade vers activités grâce au schéma)
      await prisma.user.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: "Utilisateur supprimé avec succès",
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/users/:id/change-password - Changer le mot de passe
router.post(
  "/:id/change-password",
  param("id").isUUID(),
  [
    body("currentPassword")
      .isLength({ min: 6 })
      .withMessage("Mot de passe actuel requis"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage(
        "Le nouveau mot de passe doit contenir au moins 6 caractères"
      ),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("La confirmation du mot de passe ne correspond pas");
      }
      return true;
    }),
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
      const { currentPassword, newPassword } = req.body;

      // Vérifier les permissions
      if (req.user.role === "student" && req.user.id !== id) {
        return res.status(403).json({
          success: false,
          error: "Accès non autorisé",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Utilisateur non trouvé",
        });
      }

      // Vérifier le mot de passe actuel
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: "Mot de passe actuel incorrect",
        });
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id },
        data: {
          password: hashedNewPassword,
        },
      });

      res.json({
        success: true,
        message: "Mot de passe modifié avec succès",
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/users/stats/overview - Statistiques générales des utilisateurs
router.get(
  "/stats/overview",
  authorize("led_team", "supervisor"),
  async (req, res, next) => {
    try {
      const userStats = await prisma.user.groupBy({
        by: ["role"],
        _count: {
          id: true,
        },
      });

      const totalUsers = await prisma.user.count();
      const recentUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 derniers jours
          },
        },
      });

      const activeUsers = await prisma.user.count({
        where: {
          activities: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 derniers jours
              },
            },
          },
        },
      });

      res.json({
        success: true,
        data: {
          total: totalUsers,
          recent: recentUsers,
          active: activeUsers,
          byRole: userStats.reduce((acc, stat) => {
            acc[stat.role] = stat._count.id;
            return acc;
          }, {}),
          activityRate:
            totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
