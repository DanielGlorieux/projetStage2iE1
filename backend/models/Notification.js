const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'activity_submitted',
      'activity_evaluated', 
      'activity_approved',
      'activity_rejected',
      'deadline_reminder',
      'new_assignment',
      'system_update',
      'welcome',
      'achievement_unlocked'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Statut
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  
  // Actions
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String
  },
  actionText: {
    type: String
  },
  
  // Priorité
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Expiration
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour les performances
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Méthodes statiques
notificationSchema.statics.createActivityNotification = async function(type, activity, recipient, additionalData = {}) {
  const messages = {
    activity_submitted: {
      title: 'Nouvelle activité soumise',
      message: `${activity.student.fullName} a soumis l'activité "${activity.title}"`
    },
    activity_evaluated: {
      title: 'Activité évaluée',
      message: `Votre activité "${activity.title}" a été évaluée`
    },
    activity_approved: {
      title: 'Activité approuvée',
      message: `Félicitations ! Votre activité "${activity.title}" a été approuvée`
    },
    activity_rejected: {
      title: 'Activité à réviser',
      message: `Votre activité "${activity.title}" nécessite des révisions`
    },
    deadline_reminder: {
      title: 'Échéance approchante',
      message: `L'activité "${activity.title}" doit être rendue dans ${additionalData.daysLeft} jour(s)`
    }
  };
  
  const template = messages[type];
  if (!template) {
    throw new Error(`Type de notification inconnu: ${type}`);
  }
  
  return this.create({
    recipient,
    type,
    title: template.title,
    message: template.message,
    data: {
      activityId: activity._id,
      activityTitle: activity.title,
      ...additionalData
    },
    actionRequired: ['activity_submitted', 'deadline_reminder'].includes(type),
    actionUrl: type === 'activity_submitted' ? `/evaluations/${activity._id}` : `/activities/${activity._id}`,
    priority: type === 'deadline_reminder' ? 'high' : 'medium'
  });
};

notificationSchema.statics.markAsRead = async function(notificationIds, userId) {
  return this.updateMany(
    { 
      _id: { $in: notificationIds }, 
      recipient: userId 
    },
    { 
      read: true, 
      readAt: new Date() 
    }
  );
};

notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ 
    recipient: userId, 
    read: false 
  });
};

module.exports = mongoose.model('Notification', notificationSchema);