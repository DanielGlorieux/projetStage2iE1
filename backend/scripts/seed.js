const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seeding...");

  // Créer un utilisateur admin par défaut
  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@2ie-edu.org" },
    update: {},
    create: {
      email: "admin@2ie-edu.org",
      password: adminPassword,
      name: "Administrateur LED",
      role: "LED_TEAM",
    },
  });

  console.log("✅ Administrateur créé:", admin.email);

  // Créer un superviseur par défaut
  const supervisorPassword = await bcrypt.hash("supervisor123", 12);

  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@2ie-edu.org" },
    update: {},
    create: {
      email: "supervisor@2ie-edu.org",
      password: supervisorPassword,
      name: "Dr. Superviseur LED",
      role: "SUPERVISOR",
    },
  });

  console.log("✅ Superviseur créé:", supervisor.email);

  // Créer quelques étudiants exemples
  const studentPassword = await bcrypt.hash("student123", 12);

  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: "daniel.ilboudo@2ie-edu.org" },
      update: {},
      create: {
        email: "daniel.ilboudo@2ie-edu.org",
        password: studentPassword,
        name: "Daniel ILBOUDO",
        role: "STUDENT",
        filiere: "Génie Civil",
        niveau: "M1",
      },
    }),
    prisma.user.upsert({
      where: { email: "jean.martin.et@2ie-edu.org" },
      update: {},
      create: {
        email: "jean.martin.et@2ie-edu.org",
        password: studentPassword,
        name: "Jean MARTIN",
        role: "STUDENT",
        filiere: "Informatique",
        niveau: "M2",
      },
    }),
    prisma.user.upsert({
      where: { email: "fatou.diop.et@2ie-edu.org" },
      update: {},
      create: {
        email: "fatou.diop.et@2ie-edu.org",
        password: studentPassword,
        name: "Fatou DIOP",
        role: "STUDENT",
        filiere: "Eau et Assainissement",
        niveau: "M1",
      },
    }),
  ]);

  console.log("✅ Étudiants créés:", students.length);

  // Créer quelques activités exemples
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        title: "Création d'une startup tech",
        type: "ENTREPRENEURIAT",
        description:
          "Développement d'une application mobile pour la gestion des déchets urbains. Cette activité comprend l'élaboration du business plan, la recherche de financement et le développement du MVP.",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-03-15"),
        status: "COMPLETED",
        priority: "HIGH",
        progress: 100,
        estimatedHours: 120,
        actualHours: 140,
        objectives: JSON.stringify([
          "Développer un MVP fonctionnel",
          "Valider le marché",
          "Trouver des investisseurs",
        ]),
        outcomes: JSON.stringify([
          "Application développée",
          "Étude de marché réalisée",
          "Présentation aux investisseurs",
        ]),
        challenges: JSON.stringify([
          "Contraintes techniques",
          "Budget limité",
          "Concurrence forte",
        ]),
        learnings: JSON.stringify([
          "Développement mobile",
          "Pitch investor",
          "Analyse de marché",
        ]),
        tags: JSON.stringify(["startup", "mobile", "environnement"]),
        userId: students[0].id,
        submittedAt: new Date("2024-03-10"),
      },
    }),
    prisma.activity.create({
      data: {
        title: "Organisation d'un hackathon étudiant",
        type: "LEADERSHIP",
        description:
          "Coordination et organisation d'un hackathon de 48h sur le thème du développement durable. Gestion d'une équipe de 15 bénévoles et accueil de 100 participants.",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-04-30"),
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        progress: 75,
        estimatedHours: 80,
        actualHours: 65,
        objectives: JSON.stringify([
          "Organiser un événement de qualité",
          "Sensibiliser au développement durable",
          "Créer du networking",
        ]),
        outcomes: JSON.stringify([
          "Event planifié",
          "Partenaires confirmés",
          "Communication lancée",
        ]),
        challenges: JSON.stringify([
          "Coordination équipe",
          "Gestion budget",
          "Logistique complexe",
        ]),
        learnings: JSON.stringify([
          "Management d'équipe",
          "Gestion de projet",
          "Communication événementielle",
        ]),
        tags: JSON.stringify(["hackathon", "leadership", "événement"]),
        userId: students[1].id,
      },
    }),
    prisma.activity.create({
      data: {
        title: "Développement d'une plateforme IoT",
        type: "DIGITAL",
        description:
          "Conception et développement d'une plateforme IoT pour le monitoring de la qualité de l'eau en temps réel. Utilisation de capteurs connectés et interface web.",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-06-30"),
        status: "PLANNED",
        priority: "HIGH",
        progress: 0,
        estimatedHours: 150,
        objectives: JSON.stringify([
          "Développer les capteurs IoT",
          "Créer l'interface web",
          "Tester en conditions réelles",
        ]),
        outcomes: JSON.stringify([]),
        challenges: JSON.stringify([]),
        learnings: JSON.stringify([]),
        tags: JSON.stringify(["IoT", "web", "capteurs"]),
        userId: students[2].id,
      },
    }),
  ]);

  console.log("✅ Activités créées:", activities.length);

  // Créer quelques évaluations
  const evaluations = await Promise.all([
    prisma.evaluation.create({
      data: {
        score: 85,
        maxScore: 100,
        feedback:
          "Excellent travail sur la startup. Le MVP est fonctionnel et l'analyse de marché est pertinente. Quelques améliorations possibles sur la stratégie de financement.",
        activityId: activities[0].id,
        evaluatorId: supervisor.id,
      },
    }),
  ]);

  console.log("✅ Évaluations créées:", evaluations.length);

  // Mettre à jour le statut de l'activité évaluée
  await prisma.activity.update({
    where: { id: activities[0].id },
    data: {
      status: "EVALUATED",
      evaluatedAt: new Date(),
    },
  });

  console.log("🎉 Seeding terminé avec succès!");
  console.log("\n📋 Comptes créés:");
  console.log("Admin: admin@2ie-edu.org / admin123");
  console.log("Superviseur: supervisor@2ie-edu.org / supervisor123");
  console.log("Étudiant 1: daniel.ilboudo@2ie-edu.org / student123");
  console.log("Étudiant 2: jean.martin.et@2ie-edu.org / student123");
  console.log("Étudiant 3: fatou.diop.et@2ie-edu.org / student123");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
