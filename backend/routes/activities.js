const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Activity = require('../models/Activity');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// Configuration multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'activities');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
    } catch (error) {
      console.error('Erreur création dossier upload:', error);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `activity-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 5 // 5 fichiers max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  }
});

// @route   GET /api/activities
// @desc    Obtenir les activités (filtrées selon le rôle)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      status, 
      type, 
      page = 1, 
      limit = 10, 
      search,
      student,
      supervisor 
    } = req.query;

    // Construction du filtre selon le rôle
    let filter = { isActive: true };
    
    if (req.user.role === 'student') {
      // Les étudiants ne voient que leurs activités
      filter.student = req.user.userId;
    } else if (req.user.role === 'supervisor') {
      // Les superviseurs voient les activités qu'ils encadrent ou toutes si pas spécifié
      if (supervisor) {
        filter.supervisor = supervisor;
      }
    }
    // led_team voit toutes les activités (pas de filtre supplémentaire)

    // Filtres additionnels
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (student && req.user.role !== 'student') filter.student = student;

    // Recherche textuelle
    if (search) {
      filter.$text = { $search: search };
    }

    // Options de pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { submittedAt: -1 },
      populate: [
        {
          path: 'student',
          select: 'firstName lastName email program year studentNumber'
        },
        {
          path: 'supervisor',
          select: 'firstName lastName email'
        },
        {
          path: 'evaluation.evaluatedBy',
          select: 'firstName lastName'
        }
      ]
    };

    const result = await Activity.paginate(filter, options);

    res.json({
      activities: result.docs,
      pagination: {
        total: result.totalDocs,
        page: result.page,
        pages: result.totalPages,
        limit: result.limit,
        hasNext: result.hasNextPage,
        hasPrev: result.hasPrevPage
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// @route   GET /api/activities/:id
// @desc    Obtenir une activité spécifique
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('student', 'firstName lastName email program year studentNumber')
      .populate('supervisor', 'firstName lastName email')
      .populate('evaluation.evaluatedBy', 'firstName lastName');

    if (!activity) {
      return res.status(404).json({
        error: 'Activité non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role === 'student' && 
        activity.student._id.toString() !== req.user.userId) {
      return res.status(403).json({
        error: 'Accès non autorisé'
      });
    }

    res.json({ activity });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// @route   POST /api/activities
// @desc    Créer une nouvelle activité
// @access  Private (étudiants seulement)
router.post('/', auth, upload.array('documents', 5), async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        error: 'Seuls les étudiants peuvent créer des activités'
      });
    }

    const {
      title,
      description,
      type,
      startDate,
      endDate,
      status = 'planned',
      objectives,
      tags
    } = req.body;

    // Validation de base
    if (!title || !description || !type || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Validation des dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({
        error: 'La date de fin doit être postérieure à la date de début'
      });
    }

    // Préparation des documents uploadés
    const documents = req.files ? req.files.map(file => ({
      name: file.filename,
      originalName: file.originalname,
      path: file.filename,
      mimetype: file.mimetype,
      size: file.size
    })) : [];

    // Traitement des objectifs
    let processedObjectives = [];
    if (objectives) {
      try {
        processedObjectives = typeof objectives === 'string' ? 
          JSON.parse(objectives) : objectives;
      } catch (error) {
        processedObjectives = [];
      }
    }

    // Traitement des tags
    let processedTags = [];
    if (tags) {
      processedTags = typeof tags === 'string' ? 
        tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Création de l'activité
    const activity = new Activity({
      title,
      description,
      type,
      startDate: start,
      endDate: end,
      status,
      student: req.user.userId,
      documents,
      objectives: processedObjectives,
      tags: processedTags
    });

    await activity.save();

    // Populating pour la réponse
    await activity.populate('student', 'firstName lastName email program year');

    // Créer des notifications pour les superviseurs si l'activité est soumise
    if (status === 'pending' || status === 'in_review') {
      const supervisors = await User.find({ 
        role: { $in: ['supervisor', 'led_team'] },
        isActive: true 
      });

      for (const supervisor of supervisors) {
        await Notification.createActivityNotification(
          'activity_submitted',
          activity,
          supervisor._id
        );
      }
    }

    res.status(201).json({
      message: 'Activité créée avec succès',
      activity
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);

    // Nettoyer les fichiers uploadés en cas d'erreur
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Erreur suppression fichier:', unlinkError);
        }
      }
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// @route   PUT /api/activities/:id
// @desc    Mettre à jour une activité
// @access  Private
router.put('/:id', auth, upload.array('newDocuments', 5), async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        error: 'Activité non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role === 'student' && 
        activity.student.toString() !== req.user.userId) {
      return res.status(403).json({
        error: 'Accès non autorisé'
      });
    }

    // Les activités approuvées ne peuvent pas être modifiées par les étudiants
    if (req.user.role === 'student' && activity.status === 'approved') {
      return res.status(403).json({
        error: 'Impossible de modifier une activité approuvée'
      });
    }

    const allowedUpdates = [
      'title', 'description', 'startDate', 'endDate', 
      'status', 'progress', 'objectives', 'tags'
    ];

    // Préparer les mises à jour
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Traitement spécial pour les objectifs et tags
    if (updates.objectives && typeof updates.objectives === 'string') {
      try {
        updates.objectives = JSON.parse(updates.objectives);
      } catch (error) {
        delete updates.objectives;
      }
    }

    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }

    // Validation des dates si modifiées
    if (updates.startDate || updates.endDate) {
      const startDate = new Date(updates.startDate || activity.startDate);
      const endDate = new Date(updates.endDate || activity.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({
          error: 'La date de fin doit être postérieure à la date de début'
        });
      }
    }

    // Ajouter les nouveaux documents
    if (req.files && req.files.length > 0) {
      const newDocuments = req.files.map(file => ({
        name: file.filename,
        originalName: file.originalname,
        path: file.filename,
        mimetype: file.mimetype,
        size: file.size
      }));
      
      updates.documents = [...activity.documents, ...newDocuments];
    }

    // Enregistrer l'historique des modifications
    const changes = Object.keys(updates).reduce((acc, key) => {
      if (activity[key] !== updates[key]) {
        acc[key] = {
          from: activity[key],
          to: updates[key]
        };
      }
      return acc;
    }, {});

    if (Object.keys(changes).length > 0) {
      activity.addRevision(req.user.userId, changes, req.body.revisionReason);
    }

    // Appliquer les mises à jour
    Object.assign(activity, updates);
    await activity.save();

    // Populate pour la réponse
    await activity.populate([
      { path: 'student', select: 'firstName lastName email program year' },
      { path: 'supervisor', select: 'firstName lastName email' }
    ]);

    res.json({
      message: 'Activité mise à jour avec succès',
      activity
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'activité:', error);

    // Nettoyer les nouveaux fichiers en cas d'erreur
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Erreur suppression fichier:', unlinkError);
        }
      }
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Données invalides',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Supprimer une activité
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        error: 'Activité non trouvée'
      });
    }

    // Vérifier les permissions
    if (req.user.role === 'student' && 
        activity.student.toString() !== req.user.userId) {
      return res.status(403).json({
        error: 'Accès non autorisé'
      });
    }

    // Les activités approuvées ne peuvent pas être supprimées
    if (activity.status === 'approved') {
      return res.status(403).json({
        error: 'Impossible de supprimer une activité approuvée'
      });
    }

    // Supprimer l'activité (le middleware pre-remove se charge des fichiers)
    await activity.remove();

    res.json({
      message: 'Activité supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'activité:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

// @route   GET /api/activities/stats/overview
// @desc    Obtenir les statistiques des activités
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    let matchFilter = { isActive: true };
    
    // Filtrer selon le rôle
    if (req.user.role === 'student') {
      matchFilter.student = req.user.userId;
    }

    const stats = await Activity.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byType: {
            $push: {
              type: '$type',
              status: '$status'
            }
          },
          byStatus: {
            $push: '$status'
          },
          avgScore: {
            $avg: {
              $cond: [
                { $ne: ['$evaluation', null] },
                { $divide: ['$evaluation.score', '$evaluation.maxScore'] },
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          total: 1,
          avgScore: { $multiply: ['$avgScore', 100] },
          typeBreakdown: {
            entrepreneuriat: {
              $size: {
                $filter: {
                  input: '$byType',
                  cond: { $eq: ['$$this.type', 'entrepreneuriat'] }
                }
              }
            },
            leadership: {
              $size: {
                $filter: {
                  input: '$byType',
                  cond: { $eq: ['$$this.type', 'leadership'] }
                }
              }
            },
            digital: {
              $size: {
                $filter: {
                  input: '$byType',
                  cond: { $eq: ['$$this.type', 'digital'] }
                }
              }
            }
          },
          statusBreakdown: {
            planned: {
              $size: {
                $filter: {
                  input: '$byStatus',
                  cond: { $eq: ['$$this', 'planned'] }
                }
              }
            },
            in_progress: {
              $size: {
                $filter: {
                  input: '$byStatus',
                  cond: { $eq: ['$$this', 'in_progress'] }
                }
              }
            },
            completed: {
              $size: {
                $filter: {
                  input: '$byStatus',
                  cond: { $eq: ['$$this', 'completed'] }
                }
              }
            },
            pending: {
              $size: {
                $filter: {
                  input: '$byStatus',
                  cond: { $eq: ['$$this', 'pending'] }
                }
              }
            },
            approved: {
              $size: {
                $filter: {
                  input: '$byStatus',
                  cond: { $eq: ['$$this', 'approved'] }
                }
              }
            },
            rejected: {
              $size: {
                $filter: {
                  input: '$byStatus',
                  cond: { $eq: ['$$this', 'rejected'] }
                }
              }
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      avgScore: 0,
      typeBreakdown: { entrepreneuriat: 0, leadership: 0, digital: 0 },
      statusBreakdown: { 
        planned: 0, in_progress: 0, completed: 0, 
        pending: 0, approved: 0, rejected: 0 
      }
    };

    res.json({ stats: result });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur'
    });
  }
});

module.exports = router;