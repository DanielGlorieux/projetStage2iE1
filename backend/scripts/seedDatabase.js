const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import des modèles
const User = require('../models/User');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

// Données mockées à migrer
const MOCK_USERS = [
  {
    firstName: "Aminata",
    lastName: "KONE", 
    email: "a.kone@2ie-edu.org",
    password: "led2024",
    role: "led_team",
    phone: "+226 70 11 22 33",
    address: "Ouagadougou, Burkina Faso"
  },
  {
    firstName: "Marie",
    lastName: "SANOGO",
    email: "marie.sanogo.et@2ie-edu.org", 
    password: "etudiant2024",
    role: "student",
    phone: "+226 70 12 34 56",
    address: "Ouagadougou, Burkina Faso",
    program: "Génie Informatique et Télécommunications",
    year: 3,
    admissionYear: 2022,
    bio: "Étudiante passionnée par l'innovation technologique et l'entrepreneuriat digital.",
    skills: ["React", "Node.js", "Python", "Gestion de projet", "Leadership"],
    interests: ["Innovation", "Entrepreneuriat", "Développement durable"],
    ledScore: 92
  },
  {
    firstName: "Mamadou",
    lastName: "TRAORE",
    email: "prof.traore@2ie-edu.org",
    password: "prof2024", 
    role: "supervisor",
    phone: "+226 70 98 76 54",
    address: "Ouagadougou, Burkina Faso"
  },
  {
    firstName: "Boureima",
    lastName: "OUEDRAOGO",
    email: "boureima.ouedraogo.et@2ie-edu.org",
    password: "etudiant2024",
    role: "student",
    program: "Informatique et Télécommunications", 
    year: 3,
    admissionYear: 2022,
    ledScore: 88,
    skills: ["JavaScript", "Leadership", "Communication"],
    interests: ["Leadership digital", "Innovation sociale"]
  },
  {
    firstName: "Fatou",
    lastName: "DIALLO",
    email: "fatou.diallo.et@2ie-edu.org",
    password: "etudiant2024",
    role: "student",
    program: "Génie Électrique",
    year: 5,
    admissionYear: 2020,
    ledScore: 85,
    skills: ["IoT", "Électronique", "Innovation"],
    interests: ["Technologies vertes", "Énergie renouvelable"]
  }
];

const MOCK_ACTIVITIES = [
  {
    title: "Projet d'Innovation en Agriculture Intelligente",
    type: "entrepreneuriat",
    description: "Développement d'un système IoT pour optimiser l'irrigation et surveiller les cultures. Le projet intègre des capteurs d'humidité, une application mobile et un tableau de bord web pour les agriculteurs.",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-05-30"),
    status: "pending",
    progress: 95,
    studentEmail: "marie.sanogo.et@2ie-edu.org",
    objectives: [
      { description: "Conception du système IoT", completed: true, completedAt: new Date("2024-02-15") },
      { description: "Développement de l'application mobile", completed: true, completedAt: new Date("2024-03-20") },
      { description: "Tests sur le terrain", completed: false }
    ],
    skillsAcquired: [
      { name: "Développement IoT", level: "advanced", verified: false },
      { name: "Gestion de projet", level: "intermediate", verified: true }
    ],
    tags: ["iot", "agriculture", "innovation", "mobile"]
  },
  {
    title: "Plateforme de Leadership Digital pour Jeunes",
    type: "leadership", 
    description: "Création d'une plateforme communautaire pour développer les compétences de leadership chez les jeunes à travers des challenges, mentorat et formations en ligne.",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-04-15"),
    status: "approved",
    progress: 100,
    studentEmail: "boureima.ouedraogo.et@2ie-edu.org",
    supervisorEmail: "prof.traore@2ie-edu.org",
    evaluation: {
      score: 18,
      maxScore: 20,
      comments: "Excellent projet avec une approche innovante. La plateforme répond à un vrai besoin et l'exécution est remarquable. Quelques améliorations mineures suggérées pour l'interface utilisateur.",
      criteria: [
        { name: "Innovation", score: 9, maxScore: 10, comments: "Approche très innovante" },
        { name: "Exécution", score: 9, maxScore: 10, comments: "Excellente réalisation technique" }
      ]
    },
    objectives: [
      { description: "Conception de la plateforme", completed: true, completedAt: new Date("2024-02-20") },
      { description: "Développement des fonctionnalités", completed: true, completedAt: new Date("2024-03-15") },
      { description: "Tests utilisateur", completed: true, completedAt: new Date("2024-04-10") }
    ],
    tags: ["leadership", "digital", "jeunesse", "communauté"]
  },
  {
    title: "Application de Gestion Énergétique Intelligente",
    type: "digital",
    description: "Développement d'une application mobile utilisant l'IA pour optimiser la consommation énergétique des ménages en Afrique de l'Ouest.",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-06-15"),
    status: "in_review",
    progress: 80,
    studentEmail: "fatou.diallo.et@2ie-edu.org",
    objectives: [
      { description: "Recherche et analyse", completed: true, completedAt: new Date("2024-02-10") },
      { description: "Développement de l'algorithme IA", completed: true, completedAt: new Date("2024-04-05") },
      { description: "Interface utilisateur", completed: false },
      { description: "Tests et validation", completed: false }
    ],
    tags: ["ia", "énergie", "mobile", "optimisation"]
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Début du seeding de la base de données...');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/led-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connexion MongoDB établie');

    // Nettoyage des collections existantes
    console.log('🧹 Nettoyage des collections existantes...');
    await User.deleteMany({});
    await Activity.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Collections nettoyées');

    // Création des utilisateurs
    console.log('👥 Création des utilisateurs...');
    const createdUsers = {};
    
    for (const userData of MOCK_USERS) {
      try {
        const user = new User(userData);
        await user.save();
        createdUsers[userData.email] = user;
        console.log(`  ✓ Utilisateur créé: ${user.fullName} (${user.role})`);
      } catch (error) {
        console.error(`  ❌ Erreur création utilisateur ${userData.email}:`, error.message);
      }
    }

    // Création des activités
    console.log('📋 Création des activités...');
    const createdActivities = [];
    
    for (const activityData of MOCK_ACTIVITIES) {
      try {
        const student = createdUsers[activityData.studentEmail];
        if (!student) {
          console.warn(`  ⚠️ Étudiant non trouvé pour: ${activityData.studentEmail}`);
          continue;
        }

        const supervisor = activityData.supervisorEmail ? 
          createdUsers[activityData.supervisorEmail] : null;

        const activity = new Activity({
          ...activityData,
          student: student._id,
          supervisor: supervisor?._id,
          submittedAt: new Date()
        });

        // Ajout de l'évaluation si elle existe
        if (activityData.evaluation && supervisor) {
          activity.evaluation = {
            ...activityData.evaluation,
            evaluatedBy: supervisor._id,
            evaluatedAt: new Date()
          };
        }

        await activity.save();
        createdActivities.push(activity);
        console.log(`  ✓ Activité créée: ${activity.title} (${student.fullName})`);
      } catch (error) {
        console.error(`  ❌ Erreur création activité ${activityData.title}:`, error.message);
      }
    }

    // Création de notifications de test
    console.log('🔔 Création des notifications...');
    const notifications = [];
    
    // Notifications pour les étudiants
    const students = Object.values(createdUsers).filter(u => u.role === 'student');
    for (const student of students) {
      // Notification de bienvenue
      notifications.push({
        recipient: student._id,
        type: 'welcome',
        title: 'Bienvenue sur la plateforme LED !',
        message: `Bonjour ${student.firstName}, bienvenue sur votre espace personnel de suivi LED.`,
        priority: 'medium'
      });
      
      // Notification de rappel d'échéance (si activités en cours)
      const studentActivities = createdActivities.filter(a => 
        a.student.toString() === student._id.toString() && 
        ['in_progress', 'pending'].includes(a.status)
      );
      
      for (const activity of studentActivities) {
        const daysUntilEnd = Math.ceil((activity.endDate - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilEnd <= 7 && daysUntilEnd > 0) {
          notifications.push({
            recipient: student._id,
            type: 'deadline_reminder',
            title: 'Échéance approchante',
            message: `L'activité "${activity.title}" doit être rendue dans ${daysUntilEnd} jour(s)`,
            data: { activityId: activity._id, daysLeft: daysUntilEnd },
            actionRequired: true,
            actionUrl: `/activities/${activity._id}`,
            priority: daysUntilEnd <= 3 ? 'high' : 'medium'
          });
        }
      }
    }
    
    // Notifications pour les superviseurs
    const supervisors = Object.values(createdUsers).filter(u => u.role === 'supervisor');
    for (const supervisor of supervisors) {
      const pendingActivities = createdActivities.filter(a => 
        a.status === 'pending' || a.status === 'in_review'
      );
      
      if (pendingActivities.length > 0) {
        notifications.push({
          recipient: supervisor._id,
          type: 'new_assignment',
          title: 'Activités à évaluer',
          message: `Vous avez ${pendingActivities.length} activité(s) en attente d'évaluation`,
          actionRequired: true,
          actionUrl: '/evaluations',
          priority: 'high'
        });
      }
    }

    // Sauvegarde des notifications
    for (const notifData of notifications) {
      try {
        await Notification.create(notifData);
        console.log(`  ✓ Notification créée: ${notifData.title}`);
      } catch (error) {
        console.error(`  ❌ Erreur notification:`, error.message);
      }
    }

    // Statistiques finales
    const userCount = await User.countDocuments();
    const activityCount = await Activity.countDocuments();
    const notificationCount = await Notification.countDocuments();
    
    console.log('\n📊 Statistiques du seeding:');
    console.log(`  👥 Utilisateurs créés: ${userCount}`);
    console.log(`  📋 Activités créées: ${activityCount}`);
    console.log(`  🔔 Notifications créées: ${notificationCount}`);
    
    console.log('\n🎉 Seeding terminé avec succès !');
    console.log('\n📝 Comptes de test disponibles:');
    console.log('  👥 LED Team: a.kone@2ie-edu.org / led2024');
    console.log('  🎓 Étudiant: marie.sanogo.et@2ie-edu.org / etudiant2024');
    console.log('  👨‍🏫 Encadrant: prof.traore@2ie-edu.org / prof2024');
    
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Connexion MongoDB fermée');
  }
}

// Exécution du script si appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase, MOCK_USERS, MOCK_ACTIVITIES };