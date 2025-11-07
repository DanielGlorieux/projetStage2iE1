const fetch = require("node-fetch");

const API_URL = "http://localhost:5000/api";

const studentCredentials = {
  email: "student@2ie-edu.org",
  password: "student123",
};

async function createSubmittedActivity() {
  console.log("📝 Création d'une activité test pour évaluation\n");
  console.log("=".repeat(60));

  // 1. Connexion étudiant
  console.log("\n🔐 Connexion étudiant...");
  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentCredentials),
  });

  const loginData = await loginResponse.json();
  if (!loginData.success) {
    console.error("❌ Échec de la connexion:", loginData.error);
    return;
  }

  const token = loginData.data.token;
  console.log("✅ Connexion réussie");

  // 2. Créer une activité
  console.log("\n📝 Création d'une nouvelle activité...");
  
  const activityData = {
    title: "Plateforme E-Learning pour l'Afrique",
    description: "Développement d'une plateforme d'apprentissage en ligne accessible, adaptée aux besoins éducatifs africains avec support hors-ligne et contenu multilingue.",
    type: "digital",
    startDate: new Date("2025-09-01").toISOString(),
    endDate: new Date("2025-11-30").toISOString(),
    status: "submitted", // ✅ Statut soumis pour évaluation
    priority: "high",
    objectives: [
      "Créer une interface intuitive et accessible",
      "Implémenter un mode hors-ligne fonctionnel",
      "Développer du contenu multilingue (Français, Anglais, Arabe)",
      "Intégrer des outils d'évaluation automatique"
    ],
    outcomes: [
      "Plateforme fonctionnelle avec 50+ cours",
      "1000+ utilisateurs actifs en phase beta",
      "Taux de satisfaction de 85%",
      "Réduction de 40% du temps d'apprentissage"
    ],
    challenges: [
      "Connectivité internet limitée dans certaines zones",
      "Adaptation du contenu aux contextes locaux",
      "Formation des enseignants à la plateforme"
    ],
    learnings: [
      "Importance de l'UX dans l'éducation numérique",
      "Gestion de projets tech complexes",
      "Collaboration avec des stakeholders multiples"
    ],
    tags: ["Education", "Digital", "Innovation", "Afrique"],
    estimatedHours: 300,
    actualHours: 280,
    collaborators: ["Marie Diallo", "Amadou Sow"],
  };

  const createResponse = await fetch(`${API_URL}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activityData),
  });

  const createData = await createResponse.json();
  
  if (createData.success) {
    console.log("✅ Activité créée avec succès!");
    console.log(`   ID: ${createData.data.id}`);
    console.log(`   Titre: ${createData.data.title}`);
    console.log(`   Statut: ${createData.data.status}`);
    console.log(`   Type: ${createData.data.type}`);
  } else {
    console.error("❌ Erreur:", createData.error);
  }

  // 3. Créer une deuxième activité
  console.log("\n📝 Création d'une deuxième activité...");
  
  const activity2Data = {
    title: "Programme de Mentorat pour Jeunes Entrepreneurs",
    description: "Mise en place d'un programme de mentorat connectant entrepreneurs expérimentés avec jeunes startups pour accélérer leur développement.",
    type: "leadership",
    startDate: new Date("2025-08-15").toISOString(),
    endDate: new Date("2025-12-15").toISOString(),
    status: "submitted",
    priority: "high",
    objectives: [
      "Établir 20 paires mentor-mentoré",
      "Organiser 12 sessions de formation",
      "Créer une plateforme de suivi en ligne"
    ],
    outcomes: [
      "50 jeunes entrepreneurs formés",
      "15 startups lancées avec succès",
      "Réseau de 30+ mentors actifs"
    ],
    challenges: [
      "Matching optimal mentor-mentoré",
      "Engagement continu des participants",
      "Mesure d'impact du programme"
    ],
    learnings: [
      "Leadership transformationnel",
      "Gestion de communauté",
      "Développement de programmes éducatifs"
    ],
    tags: ["Leadership", "Mentorat", "Entrepreneuriat"],
    estimatedHours: 250,
    actualHours: 265,
  };

  const create2Response = await fetch(`${API_URL}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activity2Data),
  });

  const create2Data = await create2Response.json();
  
  if (create2Data.success) {
    console.log("✅ Deuxième activité créée avec succès!");
    console.log(`   ID: ${create2Data.data.id}`);
    console.log(`   Titre: ${create2Data.data.title}`);
    console.log(`   Statut: ${create2Data.data.status}`);
    console.log(`   Type: ${create2Data.data.type}`);
  } else {
    console.error("❌ Erreur:", create2Data.error);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Activités créées et prêtes pour évaluation!");
  console.log("\nVous pouvez maintenant:");
  console.log("  1. Vous connecter en tant que superviseur");
  console.log("  2. Aller sur la page 'Évaluation Projet'");
  console.log("  3. Évaluer les activités créées");
}

createSubmittedActivity().catch((error) => {
  console.error("❌ Erreur:", error);
});
