const fetch = require("node-fetch");

// Configuration
const API_URL = "http://localhost:5000/api";
let authToken = "";
let supervisorToken = "";

// Credentials
const supervisorCredentials = {
  email: "supervisor@2ie-edu.org",
  password: "supervisor123",
};

const studentCredentials = {
  email: "student@2ie-edu.org",
  password: "student123",
};

async function login(credentials, role) {
  console.log(`\n🔐 Connexion en tant que ${role}...`);
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (data.success) {
      console.log(`✅ Connexion ${role} réussie`);
      return data.data.token;
    } else {
      console.error(`❌ Échec de la connexion ${role}:`, data.error);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erreur de connexion ${role}:`, error.message);
    return null;
  }
}

async function testSupervisorAccessToActivities() {
  console.log("\n📋 Test: Accès superviseur aux activités des étudiants");
  try {
    const response = await fetch(`${API_URL}/activities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supervisorToken}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      console.log(`✅ Superviseur peut voir ${data.data.length} activité(s)`);
      if (data.data.length > 0) {
        console.log("\nPremière activité:");
        console.log(`  - Titre: ${data.data[0].title}`);
        console.log(`  - Étudiant: ${data.data[0].user?.name || 'N/A'}`);
        console.log(`  - Type: ${data.data[0].type}`);
        console.log(`  - Statut: ${data.data[0].status}`);
        if (data.data[0].letterGrade) {
          console.log(`  - Note: ${data.data[0].letterGrade} (${data.data[0].gradeDescription})`);
        }
      }
      return data.data;
    } else {
      console.error("❌ Erreur:", data.error);
      return [];
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    return [];
  }
}

async function testGradingScale() {
  console.log("\n📊 Test: Échelle de notation américaine");
  try {
    const response = await fetch(`${API_URL}/activities/grading/scale`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supervisorToken}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      console.log("✅ Échelle de notation récupérée");
      console.log("\nSystème de notation:");
      Object.entries(data.data.scale).forEach(([grade, info]) => {
        console.log(`  ${grade}: ${info.min}-${info.max} points (GPA: ${info.gpa}) - ${info.description}`);
      });
      return true;
    } else {
      console.error("❌ Erreur:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    return false;
  }
}

async function testEvaluateActivity(activityId) {
  console.log("\n⭐ Test: Évaluation d'une activité avec notation américaine");
  try {
    const testScore = 85; // Score B
    
    const response = await fetch(`${API_URL}/activities/${activityId}/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supervisorToken}`,
      },
      body: JSON.stringify({
        score: testScore,
        feedback: "Excellent travail ! Vous avez démontré une bonne maîtrise des concepts.",
        status: "evaluated",
      }),
    });

    const data = await response.json();
    if (data.success) {
      console.log(`✅ Activité évaluée avec succès`);
      console.log(`\nRésultat:`);
      console.log(`  - Score numérique: ${data.data.evaluation.score}/100`);
      console.log(`  - Note lettre: ${data.data.evaluation.letterGrade}`);
      console.log(`  - GPA: ${data.data.evaluation.gpa}`);
      console.log(`  - Description: ${data.data.evaluation.gradeDescription}`);
      console.log(`  - Message: ${data.message}`);
      return true;
    } else {
      console.error("❌ Erreur:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    return false;
  }
}

async function testGradingConversion() {
  console.log("\n🔄 Test: Conversion des notes");
  
  const testScores = [95, 85, 75, 65, 55, 45];
  
  console.log("\nConversions:");
  testScores.forEach(score => {
    // Simulation de la conversion (comme dans grading.js)
    let grade, desc;
    if (score >= 90) { grade = 'A'; desc = 'Excellent'; }
    else if (score >= 80) { grade = 'B'; desc = 'Très bien'; }
    else if (score >= 70) { grade = 'C'; desc = 'Bien'; }
    else if (score >= 60) { grade = 'D'; desc = 'Passable'; }
    else if (score >= 50) { grade = 'E'; desc = 'Insuffisant'; }
    else { grade = 'F'; desc = 'Échec'; }
    
    console.log(`  ${score}/100 => ${grade} (${desc})`);
  });
}

async function runTests() {
  console.log("🧪 Tests: Accès superviseur et notation américaine");
  console.log("=".repeat(60));

  // 1. Connexion superviseur
  supervisorToken = await login(supervisorCredentials, "superviseur");
  if (!supervisorToken) {
    console.log("\n❌ Impossible de continuer sans authentification superviseur");
    return;
  }

  // 2. Test accès superviseur aux activités
  const activities = await testSupervisorAccessToActivities();

  // 3. Test échelle de notation
  await testGradingScale();

  // 4. Test conversion des notes
  await testGradingConversion();

  // 5. Test évaluation (si activité soumise disponible)
  const submittedActivity = activities.find(a => a.status === "submitted");
  if (submittedActivity) {
    console.log(`\n📝 Activité soumise trouvée: ${submittedActivity.title}`);
    await testEvaluateActivity(submittedActivity.id);
  } else {
    console.log("\n⚠️  Aucune activité soumise disponible pour tester l'évaluation");
    console.log("   Pour tester l'évaluation:");
    console.log("   1. Connectez-vous en tant qu'étudiant");
    console.log("   2. Créez et soumettez une activité");
    console.log("   3. Relancez ce test");
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Tests terminés");
}

// Exécuter les tests
runTests().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});
