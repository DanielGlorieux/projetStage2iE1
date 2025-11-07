const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const { authorize, authenticate } = require("../middleware/auth");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// GET /api/search/stats - Statistiques globales
router.get(
  "/stats",
  authorize("led_team", "supervisor"),
  async (req, res, next) => {
    try {
      // Statistiques des étudiants
      const totalStudents = await prisma.user.count({
        where: { role: "student" },
      });

      const studentsWithActivities = await prisma.user.count({
        where: {
          role: "student",
          activities: {
            some: {},
          },
        },
      });

      // Statistiques des activités
      const totalActivities = await prisma.activity.count();

      const activitiesByStatus = await prisma.activity.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      });

      const activitiesByType = await prisma.activity.groupBy({
        by: ["type"],
        _count: {
          id: true,
        },
      });

      // Calcul des scores moyens
      const evaluations = await prisma.evaluation.findMany({
        select: {
          score: true,
          activity: {
            select: {
              type: true,
            },
          },
        },
      });

      const avgScores = {
        entrepreneuriat: 0,
        leadership: 0,
        digital: 0,
      };

      const scoreCounts = {
        entrepreneuriat: 0,
        leadership: 0,
        digital: 0,
      };

      evaluations.forEach((eval) => {
        if (eval.activity && avgScores.hasOwnProperty(eval.activity.type)) {
          avgScores[eval.activity.type] += eval.score;
          scoreCounts[eval.activity.type]++;
        }
      });

      Object.keys(avgScores).forEach((type) => {
        if (scoreCounts[type] > 0) {
          avgScores[type] = Math.round(avgScores[type] / scoreCounts[type]);
        }
      });

      // Activités récentes
      const recentActivities = await prisma.activity.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: {
          totalStudents,
          studentsWithActivities,
          activeStudentsRate:
            totalStudents > 0
              ? Math.round((studentsWithActivities / totalStudents) * 100)
              : 0,
          totalActivities,
          activitiesByStatus: activitiesByStatus.reduce((acc, item) => {
            acc[item.status] = item._count.id;
            return acc;
          }, {}),
          activitiesByType: activitiesByType.reduce((acc, item) => {
            acc[item.type] = item._count.id;
            return acc;
          }, {}),
          averageScores: avgScores,
          globalAverageScore: Math.round(
            (avgScores.entrepreneuriat +
              avgScores.leadership +
              avgScores.digital) /
              3
          ),
          recentActivities: recentActivities.map((activity) => ({
            id: activity.id,
            title: activity.title,
            type: activity.type,
            status: activity.status,
            createdAt: activity.createdAt,
            user: activity.user.name,
          })),
        },
      });
    } catch (error) {
      console.error("Erreur stats:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
      });
    }
  }
);

// POST /api/search/students - Rechercher des étudiants
router.post(
  "/students",
  authorize("led_team", "supervisor"),
  async (req, res) => {
    try {
      console.log("Recherche reçue avec filtres:", req.body);

      const filters = req.body;
      const where = {
        role: "student",
      };

      if (filters.nom) {
        where.name = { contains: filters.nom };
      }

      if (filters.email) {
        where.email = { contains: filters.email };
      }

      if (filters.filiere && filters.filiere.length > 0) {
        where.filiere = { in: filters.filiere };
      }

      if (filters.niveau && filters.niveau.length > 0) {
        where.niveau = { in: filters.niveau };
      }

      console.log(
        "Condition WHERE construite:",
        JSON.stringify(where, null, 2)
      );

      const students = await prisma.user.findMany({
        where,
        include: {
          activities: {
            include: {
              evaluations: true,
            },
          },
        },
      });

      console.log("Étudiants trouvés:", students.length);

      const results = students.map((student) => {
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

        student.activities.forEach((activity) => {
          if (activity.evaluations.length > 0) {
            const type = activity.type.toLowerCase();
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

        return {
          id: student.id,
          nom: student.name,
          email: student.email,
          filiere: student.filiere || "",
          niveau: student.niveau || "",
          scoreGlobal: Math.round(
            (scores.entrepreneuriat + scores.leadership + scores.digital) / 3
          ),
          statut: "actif",
          dernierAcces: student.updatedAt,
          activitesCompletes: student.activities.filter(
            (a) => a.status === "evaluated"
          ).length,
          activitesTotal: student.activities.length,
          competences: scores,
        };
      });

      console.log("Résultats transformés:", results.length);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error("Erreur recherche étudiants:", error);
      res.status(500).json({
        success: false,
        error: "Erreur serveur",
        details: error.message,
      });
    }
  }
);

// POST /api/search/export - Exporter les résultats de recherche
router.post(
  "/export",
  authorize("led_team", "supervisor"),
  [
    body("format").isIn(["csv", "excel", "pdf"]).withMessage("Format invalide"),
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

      const { studentIds, filters, format } = req.body;

      // Construire la requête avec les filtres ou les IDs
      const userWhere = { role: "student" };

      if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
        // Si des IDs sont fournis, on les utilise directement
        userWhere.id = { in: studentIds };
      } else if (filters) {
        // Sinon, on utilise les filtres
        if (filters.nom) {
          userWhere.name = {
            contains: filters.nom,
            mode: "insensitive",
          };
        }

        if (filters.email) {
          userWhere.email = {
            contains: filters.email,
            mode: "insensitive",
          };
        }

        if (filters.filiere && filters.filiere.length > 0) {
          userWhere.filiere = { in: filters.filiere };
        }

        if (filters.niveau && filters.niveau.length > 0) {
          userWhere.niveau = { in: filters.niveau };
        }
      }

      const students = await prisma.user.findMany({
        where: userWhere,
        include: {
          activities: {
            include: {
              evaluations: true,
            },
            where: filters ? {
              ...(filters.typeActivite &&
                filters.typeActivite.length > 0 && {
                  type: { in: filters.typeActivite },
                }),
              ...(filters.statut &&
                filters.statut.length > 0 && {
                  status: { in: filters.statut },
                }),
              ...(filters.periodeDebut && {
                startDate: { gte: new Date(filters.periodeDebut) },
              }),
              ...(filters.periodeFin && {
                endDate: { lte: new Date(filters.periodeFin) },
              }),
            } : {},
          },
        },
      });

      const exportData = students
        .map((student) => {
          const activities = student.activities;
          const activitesCompletes = activities.filter(
            (a) => a.status === "completed" || a.status === "evaluated"
          ).length;

          // Calculer scores par compétence
          const scores = { entrepreneuriat: 0, leadership: 0, digital: 0 };
          const counts = { entrepreneuriat: 0, leadership: 0, digital: 0 };

          activities.forEach((activity) => {
            if (activity.evaluations.length > 0) {
              const score = activity.evaluations[0].score;
              const type = activity.type.toLowerCase();
              if (scores.hasOwnProperty(type)) {
                scores[type] += score;
                counts[type]++;
              }
            }
          });

          Object.keys(scores).forEach((comp) => {
            if (counts[comp] > 0) {
              scores[comp] = Math.round(scores[comp] / counts[comp]);
            }
          });

          const scoreGlobal = Math.round(
            (scores.entrepreneuriat + scores.leadership + scores.digital) / 3
          );

          // Filtrer par score si spécifié (seulement si on utilise des filtres)
          if (filters) {
            if (filters.scoreMin !== undefined && scoreGlobal < filters.scoreMin)
              return null;
            if (filters.scoreMax !== undefined && scoreGlobal > filters.scoreMax)
              return null;
          }

          return {
            Nom: student.name,
            Email: student.email,
            Filière: student.filiere || "Non spécifiée",
            Niveau: student.niveau || "Non spécifié",
            "Activités complètes": activitesCompletes,
            "Total activités": activities.length,
            "Score Entrepreneuriat": scores.entrepreneuriat,
            "Score Leadership": scores.leadership,
            "Score Digital": scores.digital,
            "Score Global": scoreGlobal,
            "Dernier accès": student.updatedAt.toLocaleDateString("fr-FR"),
            "Date création": student.createdAt.toLocaleDateString("fr-FR"),
            "Taux de completion":
              activities.length > 0
                ? Math.round((activitesCompletes / activities.length) * 100) +
                  "%"
                : "0%",
          };
        })
        .filter((student) => student !== null);

      if (format === "csv") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Étudiants");

        const buffer = XLSX.write(wb, { type: "buffer", bookType: "csv" });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=recherche_etudiants.csv"
        );
        res.send(buffer);
      } else if (format === "excel") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Recherche Étudiants LED");

        // Styling pour Excel
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_col(C) + "1";
          if (!ws[address]) continue;
          ws[address].s = {
            font: { bold: true },
            fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFFFF" } },
          };
        }

        const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=recherche_etudiants.xlsx"
        );
        res.send(buffer);
      } else if (format === "pdf") {
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=recherche_etudiants.pdf"
        );

        doc.pipe(res);

        // En-tête du rapport
        doc
          .fontSize(20)
          .text("Rapport de Recherche - Étudiants LED", { align: "center" });
        doc
          .fontSize(12)
          .text(
            `Généré le ${new Date().toLocaleDateString(
              "fr-FR"
            )} à ${new Date().toLocaleTimeString("fr-FR")}`,
            { align: "center" }
          );
        doc.text(`Par: ${req.user.name} (${req.user.email})`, {
          align: "center",
        });
        doc.moveDown(2);

        // Résumé des filtres appliqués
        doc.fontSize(14).text("Filtres appliqués:", { underline: true });
        doc.fontSize(10);
        
        if (studentIds && studentIds.length > 0) {
          doc.text(`• Export de ${studentIds.length} étudiant(s) sélectionné(s)`);
        } else if (filters) {
          if (filters.nom) doc.text(`• Nom: ${filters.nom}`);
          if (filters.email) doc.text(`• Email: ${filters.email}`);
          if (filters.filiere && filters.filiere.length > 0)
            doc.text(`• Filière: ${filters.filiere.join(", ")}`);
          if (filters.niveau && filters.niveau.length > 0)
            doc.text(`• Niveau: ${filters.niveau.join(", ")}`);
          if (filters.scoreMin !== undefined)
            doc.text(`• Score minimum: ${filters.scoreMin}`);
          if (filters.scoreMax !== undefined)
            doc.text(`• Score maximum: ${filters.scoreMax}`);
          if (filters.typeActivite && filters.typeActivite.length > 0)
            doc.text(`• Type d'activité: ${filters.typeActivite.join(", ")}`);
          if (filters.statut && filters.statut.length > 0)
            doc.text(`• Statut: ${filters.statut.join(", ")}`);
        } else {
          doc.text("• Tous les étudiants");
        }
        doc.moveDown(2);

        // Statistiques globales
        doc.fontSize(14).text("Statistiques globales:", { underline: true });
        doc.fontSize(10);
        doc.text(`• Nombre d'étudiants trouvés: ${exportData.length}`);

        const avgScore =
          exportData.length > 0
            ? Math.round(
                exportData.reduce(
                  (sum, s) => sum + (s["Score Global"] || 0),
                  0
                ) / exportData.length
              )
            : 0;
        doc.text(`• Score global moyen: ${avgScore}/100`);

        const avgCompletion =
          exportData.length > 0
            ? Math.round(
                exportData.reduce(
                  (sum, s) => sum + parseInt(s["Taux de completion"]) || 0,
                  0
                ) / exportData.length
              )
            : 0;
        doc.text(`• Taux de complétion moyen: ${avgCompletion}%`);

        doc.moveDown(2);

        // Liste des étudiants
        doc.fontSize(14).text("Liste des étudiants:", { underline: true });
        doc.moveDown(1);

        exportData.forEach((student, index) => {
          // Vérifier s'il faut une nouvelle page
          if (doc.y > 700) {
            doc.addPage();
          }

          doc
            .fontSize(12)
            .text(`${index + 1}. ${student.Nom}`, { continued: true });
          doc.fontSize(10).text(` (${student.Email})`, { align: "left" });

          doc.fontSize(9);
          doc.text(
            `   Filière: ${student.Filière} - Niveau: ${student.Niveau}`
          );
          doc.text(
            `   Activités: ${student["Activités complètes"]}/${student["Total activités"]} (${student["Taux de completion"]})`
          );
          doc.text(
            `   Scores: E:${student["Score Entrepreneuriat"]} | L:${student["Score Leadership"]} | D:${student["Score Digital"]} | Global:${student["Score Global"]}`
          );
          doc.text(`   Dernier accès: ${student["Dernier accès"]}`);
          doc.moveDown(0.5);
        });

        // Pied de page
        doc
          .fontSize(8)
          .text(
            `Rapport généré par la Plateforme LED 2iE - ${new Date().toLocaleDateString(
              "fr-FR"
            )}`,
            50,
            doc.page.height - 50,
            { align: "center" }
          );

        doc.end();
      }
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/search/filters - Obtenir les valeurs disponibles pour les filtres
router.get(
  "/filters",
  authorize("led_team", "supervisor"),
  async (req, res, next) => {
    try {
      // Récupérer les valeurs uniques pour les filtres
      const filieres = await prisma.user.findMany({
        where: {
          role: "student",
          filiere: { not: null },
        },
        select: { filiere: true },
        distinct: ["filiere"],
      });

      const niveaux = await prisma.user.findMany({
        where: {
          role: "student",
          niveau: { not: null },
        },
        select: { niveau: true },
        distinct: ["niveau"],
      });

      const statuts = [
        "planned",
        "in_progress",
        "completed",
        "submitted",
        "evaluated",
        "cancelled",
      ];
      const typesActivite = ["entrepreneuriat", "leadership", "digital"];

      res.json({
        success: true,
        data: {
          filieres: filieres.map((f) => f.filiere).filter(Boolean),
          niveaux: niveaux.map((n) => n.niveau).filter(Boolean),
          statuts,
          typesActivite,
          scoreRange: { min: 0, max: 100 },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/search/student/:id - Obtenir le détail d'un étudiant
router.get(
  "/student/:id",
  authorize("led_team", "supervisor"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const student = await prisma.user.findUnique({
        where: { id },
        include: {
          activities: {
            include: {
              evaluations: {
                include: {
                  evaluator: {
                    select: {
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
          },
        },
      });

      if (!student || student.role !== "student") {
        return res.status(404).json({
          success: false,
          error: "Étudiant non trouvé",
        });
      }

      // Calculer les statistiques
      const activities = student.activities;
      const activitesCompletes = activities.filter(
        (a) => a.status === "completed" || a.status === "evaluated"
      ).length;

      const competences = {
        entrepreneuriat: { total: 0, count: 0, activities: [] },
        leadership: { total: 0, count: 0, activities: [] },
        digital: { total: 0, count: 0, activities: [] },
      };

      activities.forEach((activity) => {
        const type = activity.type.toLowerCase();
        if (competences[type]) {
          competences[type].activities.push(activity);
          if (activity.evaluations.length > 0) {
            const score = activity.evaluations[0].score;
            competences[type].total += score;
            competences[type].count++;
          }
        }
      });

      // Calculer les moyennes
      Object.keys(competences).forEach((comp) => {
        if (competences[comp].count > 0) {
          competences[comp].average = Math.round(
            competences[comp].total / competences[comp].count
          );
        } else {
          competences[comp].average = 0;
        }
      });

      const scoreGlobal = Math.round(
        (competences.entrepreneuriat.average +
          competences.leadership.average +
          competences.digital.average) /
          3
      );

      res.json({
        success: true,
        data: {
          student: {
            id: student.id,
            name: student.name,
            email: student.email,
            filiere: student.filiere,
            niveau: student.niveau,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,
          },
          statistics: {
            activitesTotal: activities.length,
            activitesCompletes,
            tauxCompletion:
              activities.length > 0
                ? Math.round((activitesCompletes / activities.length) * 100)
                : 0,
            scoreGlobal,
            competences: {
              entrepreneuriat: competences.entrepreneuriat.average,
              leadership: competences.leadership.average,
              digital: competences.digital.average,
            },
          },
          activities: activities.map((activity) => ({
            ...activity,
            evaluation: activity.evaluations[0] || null,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
