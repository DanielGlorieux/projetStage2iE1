const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { authorize } = require('../middleware/auth');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/search/students - Rechercher des étudiants (superviseurs uniquement)
router.post('/students', 
  authorize('LED_TEAM', 'SUPERVISOR'),
  [
    body('nom').optional().isString().withMessage('Nom invalide'),
    body('email').optional().isEmail().withMessage('Email invalide'),
    body('filiere').optional().isArray().withMessage('Filière doit être un tableau'),
    body('niveau').optional().isArray().withMessage('Niveau doit être un tableau'),
    body('scoreMin').optional().isInt({ min: 0, max: 100 }).withMessage('Score minimum invalide'),
    body('scoreMax').optional().isInt({ min: 0, max: 100 }).withMessage('Score maximum invalide'),
    body('statut').optional().isArray().withMessage('Statut doit être un tableau'),
    body('typeActivite').optional().isArray().withMessage('Type activité doit être un tableau')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Filtres invalides',
          details: errors.array()
        });
      }

      const {
        nom,
        email,
        filiere,
        niveau,
        scoreMin,
        scoreMax,
        statut,
        typeActivite,
        periodeDebut,
        periodeFin
      } = req.body;

      // Construire la requête de base pour les utilisateurs
      const userWhere = {
        role: 'STUDENT'
      };

      if (nom) {
        userWhere.name = {
          contains: nom,
          mode: 'insensitive'
        };
      }

      if (email) {
        userWhere.email = {
          contains: email,
          mode: 'insensitive'
        };
      }

      if (filiere && filiere.length > 0) {
        userWhere.filiere = {
          in: filiere
        };
      }

      if (niveau && niveau.length > 0) {
        userWhere.niveau = {
          in: niveau
        };
      }

      // Récupérer les étudiants avec leurs activités
      const students = await prisma.user.findMany({
        where: userWhere,
        include: {
          activities: {
            include: {
              evaluations: true
            },
            where: {
              ...(typeActivite && typeActivite.length > 0 && {
                type: { in: typeActivite }
              }),
              ...(statut && statut.length > 0 && {
                status: { in: statut }
              }),
              ...(periodeDebut && {
                startDate: { gte: new Date(periodeDebut) }
              }),
              ...(periodeFin && {
                endDate: { lte: new Date(periodeFin) }
              })
            }
          }
        }
      });

      // Traiter les résultats
      const results = students.map(student => {
        const activities = student.activities;
        const activitesCompletes = activities.filter(a => a.status === 'COMPLETED' || a.status === 'EVALUATED').length;
        const activitesTotal = activities.length;

        // Calculer les scores par compétence
        const competences = {
          entrepreneuriat: 0,
          leadership: 0,
          digital: 0
        };

        const competenceCounts = {
          entrepreneuriat: 0,
          leadership: 0,
          digital: 0
        };

        activities.forEach(activity => {
          if (activity.evaluations.length > 0) {
            const score = activity.evaluations[0].score;
            const type = activity.type.toLowerCase();
            
            if (competences.hasOwnProperty(type)) {
              competences[type] += score;
              competenceCounts[type]++;
            }
          }
        });

        // Calculer les moyennes
        Object.keys(competences).forEach(comp => {
          if (competenceCounts[comp] > 0) {
            competences[comp] = Math.round(competences[comp] / competenceCounts[comp]);
          }
        });

        // Score global (moyenne des trois compétences)
        const scoreGlobal = Math.round(
          (competences.entrepreneuriat + competences.leadership + competences.digital) / 3
        );

        // Déterminer le statut global
        let statut = 'Inactif';
        if (activitesCompletes > 0) {
          const ratioCompletion = activitesCompletes / activitesTotal;
          if (ratioCompletion >= 0.8) statut = 'Excellent';
          else if (ratioCompletion >= 0.6) statut = 'Bon';
          else if (ratioCompletion >= 0.4) statut = 'Moyen';
          else statut = 'En cours';
        }

        return {
          id: student.id,
          nom: student.name,
          email: student.email,
          filiere: student.filiere || 'Non spécifiée',
          niveau: student.niveau || 'Non spécifié',
          scoreGlobal,
          statut,
          dernierAcces: student.updatedAt.toISOString(),
          activitesCompletes,
          activitesTotal,
          competences
        };
      });

      // Filtrer par score si spécifié
      const filteredResults = results.filter(student => {
        if (scoreMin !== undefined && student.scoreGlobal < scoreMin) return false;
        if (scoreMax !== undefined && student.scoreGlobal > scoreMax) return false;
        return true;
      });

      res.json({
        success: true,
        data: filteredResults
      });

    } catch (error) {
      next(error);
    }
  }
);

// POST /api/search/export - Exporter les résultats de recherche
router.post('/export',
  authorize('LED_TEAM', 'SUPERVISOR'),
  [
    body('filters').isObject().withMessage('Filtres invalides'),
    body('format').isIn(['csv', 'excel', 'pdf']).withMessage('Format invalide')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Données invalides',
          details: errors.array()
        });
      }

      const { filters, format } = req.body;

      // Réutiliser la logique de recherche
      // (Copier la logique de la route /students ici avec les filtres)
      
      // Pour simplifier, on va juste faire un exemple basique
      const students = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        include: {
          activities: {
            include: {
              evaluations: true
            }
          }
        }
      });

      const exportData = students.map(student => {
        const activities = student.activities;
        const activitesCompletes = activities.filter(a => a.status === 'COMPLETED' || a.status === 'EVALUATED').length;
        
        // Calculer scores par compétence
        const scores = { entrepreneuriat: 0, leadership: 0, digital: 0 };
        const counts = { entrepreneuriat: 0, leadership: 0, digital: 0 };
        
        activities.forEach(activity => {
          if (activity.evaluations.length > 0) {
            const score = activity.evaluations[0].score;
            const type = activity.type.toLowerCase();
            if (scores.hasOwnProperty(type)) {
              scores[type] += score;
              counts[type]++;
            }
          }
        });

        Object.keys(scores).forEach(comp => {
          if (counts[comp] > 0) {
            scores[comp] = Math.round(scores[comp] / counts[comp]);
          }
        });

        return {
          'Nom': student.name,
          'Email': student.email,
          'Filière': student.filiere || 'Non spécifiée',
          'Niveau': student.niveau || 'Non spécifié',
          'Activités complètes': activitesCompletes,
          'Total activités': activities.length,
          'Score Entrepreneuriat': scores.entrepreneuriat,
          'Score Leadership': scores.leadership,
          'Score Digital': scores.digital,
          'Score Global': Math.round((scores.entrepreneuriat + scores.leadership + scores.digital) / 3),
          'Dernier accès': student.updatedAt.toLocaleDateString('fr-FR')
        };
      });

      if (format === 'csv') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Étudiants');
        
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'csv' });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=recherche_etudiants.csv');
        res.send(buffer);

      } else if (format === 'excel') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Recherche Étudiants LED');
        
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=recherche_etudiants.xlsx');
        res.send(buffer);

      } else if (format === 'pdf') {
        const doc = new PDFDocument();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=recherche_etudiants.pdf');
        
        doc.pipe(res);
        
        doc.fontSize(20).text('Rapport de Recherche - Étudiants LED', { align: 'center' });