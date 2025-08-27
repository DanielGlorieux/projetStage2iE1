const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'led_team', 'supervisor'],
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  birthDate: {
    type: Date
  },
  avatar: {
    type: String
  },
  
  // Informations académiques (pour les étudiants)
  studentNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  university: {
    type: String,
    default: "Institut International d'Ingénierie de l'Eau et de l'Environnement (2iE)"
  },
  program: {
    type: String
  },
  year: {
    type: Number,
    min: 1,
    max: 6
  },
  admissionYear: {
    type: Number
  },
  scholarshipType: {
    type: String,
    default: "Bourse d'Excellence LED"
  },
  
  // Profil LED
  bio: {
    type: String,
    maxlength: 1000
  },
  skills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  ledScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Métadonnées
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour la recherche
userSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text',
  program: 'text' 
});
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });

// Virtual pour le nom complet
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual pour les statistiques d'activités
userSchema.virtual('activityStats', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'student',
  match: { isActive: true }
});

// Méthodes d'instance
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateEmailVerificationToken = function() {
  this.emailVerificationToken = require('crypto').randomBytes(32).toString('hex');
  return this.emailVerificationToken;
};

userSchema.methods.generatePasswordResetToken = function() {
  this.passwordResetToken = require('crypto').randomBytes(32).toString('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return this.passwordResetToken;
};

// Middleware pre-save pour hasher le mot de passe
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware pre-save pour générer le numéro étudiant
userSchema.pre('save', async function(next) {
  if (this.role === 'student' && !this.studentNumber && this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('User').countDocuments({ role: 'student' });
    this.studentNumber = `ET${year}${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);