// Script pour ajouter des activités avec documents pour les tests
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Connexion en tant qu'étudiant
async function loginAsStudent() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'student@2ie.bf',
      password: 'student123'
    });
    return response.data.token;
  } catch (error) {
    console.error('Erreur de connexion étudiant:', error.response?.data || error.message);
    throw error;
  }
}

// Créer une activité avec documents simulés
async function createActivityWithDocuments(token) {
  try {
    // 1. Créer l'activité
    const activityData = {
      title: "Développement d'une Application de Gestion Documentaire",
      type: "digital",
      description: "Conception et développement d'une application web permettant la gestion électronique des documents administratifs. L'application comprend un système de workflow, de notifications automatiques et un module de recherche avancée. Projet réalisé dans le cadre d'un partenariat avec une PME locale.",
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-04-30'),
      status: "submitted",
      priority: "high",
      estimatedHours: 120,
      actualHours: 135,
      objectives: [
        "Développer une solution de GED complète et intuitive",
        "Implémenter un système de workflow configurable",
        "Assurer la sécurité et la traçabilité des documents",
        "Former les utilisateurs finaux à l'utilisation de l'application"
      ],
      outcomes: [
        "Application web fonctionnelle déployée en production",
        "Documentation technique et utilisateur complète",
        "Formation de 15 utilisateurs réalisée avec succès",
        "Réduction de 40% du temps de traitement des documents"
      ],
      challenges: [
        "Intégration avec le système existant complexe",
        "Gestion des permissions et droits d'accès granulaires",
        "Optimisation des performances avec volumes importants"
      ],
      learnings: [
        "Architecture microservices avec Node.js",
        "Gestion de projet agile avec Scrum",
        "Déploiement continu avec Docker et CI/CD"
      ],
      collaborators: ["Sophie KABORE", "Jean-Paul OUEDRAOGO"],
      tags: ["Web Development", "GED", "Node.js", "React", "MongoDB"]
    };

    const activityResponse = await axios.post(`${API_URL}/activities`, activityData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Activité créée:', activityResponse.data.data.id);

    // 2. Simuler l'ajout de documents (URLs fictives pour test)
    const activityId = activityResponse.data.data.id;
    
    // Note: Ces URLs sont fictives. Dans un vrai cas, vous uploaderiez de vrais fichiers
    const documentUrls = [
      `/uploads/documents/rapport-final-ged-${activityId}.pdf`,
      `/uploads/documents/presentation-projet-${activityId}.pptx`,
      `/uploads/documents/code-source-${activityId}.zip`,
      `/uploads/documents/manuel-utilisateur-${activityId}.pdf`,
      `/uploads/documents/captures-ecran-${activityId}.png`
    ];

    // Mettre à jour l'activité avec les URLs de documents
    await axios.put(`${API_URL}/activities/${activityId}`, 
      { documents: documentUrls },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('✅ Documents ajoutés à l\'activité');
    console.log('📄 Documents:', documentUrls);

    return activityResponse.data.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.response?.data || error.message);
    throw error;
  }
}

// Créer plusieurs activités de test
async function createTestActivities() {
  try {
    console.log('🔐 Connexion en tant qu\'étudiant...');
    const token = await loginAsStudent();
    console.log('✅ Connecté avec succès\n');

    console.log('📝 Création d\'activités avec documents...\n');
    
    // Activité 1
    const activity1 = await createActivityWithDocuments(token);
    console.log(`\n✨ Activité 1 créée: ${activity1.title}\n`);

    // Activité 2
    const activity2Data = {
      title: "Organisation du Hackathon Innovation 2iE 2024",
      type: "leadership",
      description: "Organisation et coordination du hackathon annuel de l'école réunissant plus de 100 participants. Gestion complète de l'événement incluant la recherche de sponsors, la logistique, la communication et l'animation. L'événement a permis de développer 15 prototypes innovants en 48 heures.",
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-15'),
      status: "submitted",
      priority: "high",
      estimatedHours: 80,
      actualHours: 95,
      objectives: [
        "Organiser un événement de qualité avec 100+ participants",
        "Mobiliser au moins 5 sponsors majeurs",
        "Assurer une couverture médiatique importante",
        "Faciliter la création de prototypes innovants"
      ],
      outcomes: [
        "120 participants de 8 pays africains",
        "6 sponsors avec 15 millions FCFA de dotation",
        "15 prototypes développés dont 3 primés",
        "Couverture par 10 médias nationaux et internationaux"
      ],
      challenges: [
        "Coordination d'une équipe de 20 bénévoles",
        "Gestion de budget limité avec attentes élevées",
        "Résolution de problèmes logistiques de dernière minute"
      ],
      learnings: [
        "Gestion d'événement à grande échelle",
        "Négociation avec sponsors et partenaires",
        "Leadership et management d'équipe sous pression"
      ],
      collaborators: ["Marie SANKARA", "Amadou TRAORE", "Fatoumata DIALLO"],
      tags: ["Event Management", "Leadership", "Innovation", "Networking"]
    };

    const activity2Response = await axios.post(`${API_URL}/activities`, activity2Data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const activity2Id = activity2Response.data.data.id;
    const docs2 = [
      `/uploads/documents/programme-hackathon-${activity2Id}.pdf`,
      `/uploads/documents/photos-evenement-${activity2Id}.zip`,
      `/uploads/documents/rapport-sponsors-${activity2Id}.pdf`
    ];

    await axios.put(`${API_URL}/activities/${activity2Id}`, 
      { documents: docs2 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(`✨ Activité 2 créée: ${activity2Data.title}\n`);

    console.log('\n🎉 Toutes les activités de test ont été créées avec succès!\n');
    console.log('👉 Connectez-vous en tant que superviseur pour voir les documents:');
    console.log('   Email: supervisor@2ie.bf');
    console.log('   Password: [votre mot de passe]\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la création des activités de test:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
createTestActivities();
