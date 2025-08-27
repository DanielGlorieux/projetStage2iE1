const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const evaluationSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  maxScore: {
    type: Number,
    default: 20
  },
  comments: {
    type: String,
    required: true,
    maxlength: 2000
  },
  evaluatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluatedAt: {
    type: Date,
    default: Date.now
  },
  criteria: [{
    name: String,
    score: Number,
    maxScore: Number,
    comments: String
  }]
});

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['entrepreneuriat', 'leadership', 'digital'],
    required: true
  },
  
  // Dates
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  
  // Relations
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Statut et progression
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'cancelled', 'pending', 'in_review', 'approved', 'rejected'],
    default: 'planned'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Documents joints
  documents: [documentSchema],
  
  // Évaluation
  evaluation: evaluationSchema,
  
  // Objectifs et résultats
  objectives: [{
    description: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  outcomes: [{
    description: String,
    evidence: String,
    measurable: Boolean
  }],
  
  // Compétences développées
  skillsAcquired: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Métadonnées
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Historique des modifications
  revisions: [{
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    changes: {
      type: mongoose.Schema.Types.Mixed
    },
    reason: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les recherches
activitySchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text'
});
activitySchema.index({ student: 1, status: 1 });
activitySchema.index({ type: 1, status: 1 });
activitySchema.index({ submittedAt: -1 });
activitySchema.index({ startDate: 1, endDate: 1 });

// Virtual pour le nom du type d'activité
activitySchema.virtual('typeName').get(function() {
  const types = {
    entrepreneuriat: 'Entrepreneuriat',
    leadership: 'Leadership',
    digital: 'Digital'
  };
  return types[this.type] || this.type;
});

// Virtual pour le score final
activitySchema.virtual('finalScore').get(function() {
  if (this.evaluation && this.evaluation.score !== undefined) {
    return Math.round((this.evaluation.score / this.evaluation.maxScore) * 100);
  }
  return null;
});

// Virtual pour le temps restant
activitySchema.virtual('timeRemaining').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') return null;
  
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Méthodes d'instance
activitySchema.methods.updateProgress = function() {
  if (this.status === 'completed') {
    this.progress = 100;
  } else if (this.status === 'cancelled') {
    // Progress reste inchangé pour les activités annulées
  } else {
    // Calcul automatique basé sur les objectifs complétés
    const totalObjectives = this.objectives.length;
    if (totalObjectives > 0) {
      const completedObjectives = this.objectives.filter(obj => obj.completed).length;
      this.progress = Math.round((completedObjectives / totalObjectives) * 100);
    } else {
      // Calcul basé sur le temps écoulé si pas d'objectifs
      const now = new Date();
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const totalTime = end - start;
      const elapsedTime = now - start;
      
      if (elapsedTime <= 0) {
        this.progress = 0;
      } else if (elapsedTime >= totalTime) {
        this.progress = this.status === 'completed' ? 100 : 95;
      } else {
        this.progress = Math.round((elapsedTime / totalTime) * 100);
      }
    }
  }
};

activitySchema.methods.addRevision = function(modifiedBy, changes, reason) {
  this.revisions.push({
    modifiedBy,
    changes,
    reason,
    modifiedAt: new Date()
  });
};

// Middleware pre-save
activitySchema.pre('save', function(next) {
  // Validation des dates
  if (this.startDate >= this.endDate) {
    const error = new Error('La date de fin doit être postérieure à la date de début');
    error.name = 'ValidationError';
    return next(error);
  }
  
  // Mise à jour automatique du progrès
  this.updateProgress();
  
  next();
});

// Middleware pre-remove pour nettoyer les fichiers
activitySchema.pre('remove', async function(next) {
  const fs = require('fs').promises;
  const path = require('path');
  
  // Supprimer tous les documents associés
  for (const doc of this.documents) {
    try {
      await fs.unlink(path.join(__dirname, '..', 'uploads', doc.path));
    } catch (error) {
      console.warn(`Impossible de supprimer le fichier: ${doc.path}`, error.message);
    }
  }
  
  next();
});

module.exports = mongoose.model('Activity', activitySchema);