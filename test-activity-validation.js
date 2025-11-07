const fetch = require("node-fetch");

const API_URL = "http://localhost:5000/api";

const supervisorCredentials = {
  email: "supervisor@2ie-edu.org",
  password: "supervisor123",
};

async function testActivityValidation() {
  console.log("🧪 Test: Page Évaluation Projet\n");
  console.log("=".repeat(60));

  // 1. Connexion
  console.log("\n🔐 Connexion superviseur...");
  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supervisorCredentials),
  });

  const loginData = await loginResponse.json();
  if (!loginData.success) {
    console.error("❌ Échec de la connexion:", loginData.error);
    return;
  }

  const token = loginData.data.token;
  console.log("✅ Connexion réussie");

  // 2. Récupérer toutes les activités
  console.log("\n📋 Récupération de toutes les activités...");
  const allActivitiesResponse = await fetch(`${API_URL}/activities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const allActivitiesData = await allActivitiesResponse.json();
  console.log("\n📊 Statistiques:");
  console.log(`  Total d'activités: ${allActivitiesData.data?.length || 0}`);

  if (allActivitiesData.data && allActivitiesData.data.length > 0) {
    // Grouper par statut
    const byStatus = {};
    allActivitiesData.data.forEach((activity) => {
      const status = activity.status || "unknown";
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    console.log("\n📈 Répartition par statut:");
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    // Afficher les premières activités
    console.log("\n📝 Exemples d'activités:");
    allActivitiesData.data.slice(0, 3).forEach((activity, index) => {
      console.log(`\n  ${index + 1}. ${activity.title}`);
      console.log(`     Étudiant: ${activity.user?.name || "N/A"}`);
      console.log(`     Type: ${activity.type}`);
      console.log(`     Statut: ${activity.status}`);
      console.log(`     Date création: ${activity.createdAt}`);
    });
  }

  // 3. Récupérer les activités soumises
  console.log("\n\n🎯 Récupération des activités SOUMISES...");
  const submittedResponse = await fetch(
    `${API_URL}/activities?status=submitted`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const submittedData = await submittedResponse.json();
  console.log(`  Activités soumises: ${submittedData.data?.length || 0}`);

  if (submittedData.data && submittedData.data.length > 0) {
    console.log("\n✅ Activités disponibles pour évaluation:");
    submittedData.data.forEach((activity, index) => {
      console.log(`\n  ${index + 1}. ${activity.title}`);
      console.log(`     Étudiant: ${activity.user?.name}`);
      console.log(`     Email: ${activity.user?.email}`);
      console.log(`     Type: ${activity.type}`);
      console.log(`     Soumis le: ${new Date(activity.submittedAt).toLocaleDateString("fr-FR")}`);
    });
  } else {
    console.log("\n⚠️  Aucune activité soumise trouvée");
    console.log("\nPour tester l'évaluation:");
    console.log("  1. Connectez-vous en tant qu'étudiant");
    console.log("  2. Créez une activité");
    console.log("  3. Changez son statut à 'submitted'");
    console.log("  4. Relancez ce test");
  }

  // 4. Récupérer les activités évaluées
  console.log("\n\n📊 Récupération des activités ÉVALUÉES...");
  const evaluatedResponse = await fetch(
    `${API_URL}/activities?status=evaluated`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const evaluatedData = await evaluatedResponse.json();
  console.log(`  Activités évaluées: ${evaluatedData.data?.length || 0}`);

  if (evaluatedData.data && evaluatedData.data.length > 0) {
    console.log("\n✅ Activités déjà évaluées:");
    evaluatedData.data.forEach((activity, index) => {
      console.log(`\n  ${index + 1}. ${activity.title}`);
      console.log(`     Étudiant: ${activity.user?.name}`);
      console.log(`     Score: ${activity.score || "N/A"}`);
      console.log(`     Note: ${activity.letterGrade || "N/A"}`);
      console.log(`     GPA: ${activity.gpa || "N/A"}`);
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Test terminé");
}

testActivityValidation().catch((error) => {
  console.error("❌ Erreur:", error);
});
