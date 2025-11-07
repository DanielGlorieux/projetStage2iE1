const fetch = require("node-fetch");
const fs = require("fs");

// Configuration
const API_URL = "http://localhost:5000/api";
let authToken = "";

// Données de test pour un superviseur
const supervisorCredentials = {
  email: "supervisor@2ie-edu.org",
  password: "supervisor123",
};

async function login() {
  console.log("🔐 Connexion en tant que superviseur...");
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supervisorCredentials),
    });

    const data = await response.json();
    if (data.success) {
      authToken = data.data.token;
      console.log("✅ Connexion réussie");
      return true;
    } else {
      console.error("❌ Échec de la connexion:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur de connexion:", error.message);
    return false;
  }
}

async function testSearchStudents() {
  console.log("\n📋 Test de recherche d'étudiants...");
  try {
    const filters = {
      nom: "ILBOUDO",
    };

    const response = await fetch(`${API_URL}/search/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(filters),
    });

    const data = await response.json();
    if (data.success) {
      console.log(`✅ ${data.data.length} étudiant(s) trouvé(s)`);
      if (data.data.length > 0) {
        console.log("\nPremier étudiant:");
        console.log(`  - Nom: ${data.data[0].nom}`);
        console.log(`  - Email: ${data.data[0].email}`);
        console.log(`  - Score Global: ${data.data[0].scoreGlobal}`);
      }
      return data.data;
    } else {
      console.error("❌ Erreur de recherche:", data.error);
      return [];
    }
  } catch (error) {
    console.error("❌ Erreur lors de la recherche:", error.message);
    return [];
  }
}

async function testExportCSV(studentIds) {
  console.log("\n📄 Test d'export CSV...");
  try {
    const response = await fetch(`${API_URL}/search/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        studentIds: studentIds,
        format: "csv",
      }),
    });

    if (response.ok) {
      const buffer = await response.buffer();
      const filename = `test-export-${Date.now()}.csv`;
      fs.writeFileSync(filename, buffer);
      console.log(`✅ Export CSV réussi: ${filename} (${buffer.length} octets)`);
      return true;
    } else {
      const data = await response.json();
      console.error("❌ Erreur d'export CSV:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'export CSV:", error.message);
    return false;
  }
}

async function testExportExcel(studentIds) {
  console.log("\n📊 Test d'export Excel...");
  try {
    const response = await fetch(`${API_URL}/search/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        studentIds: studentIds,
        format: "excel",
      }),
    });

    if (response.ok) {
      const buffer = await response.buffer();
      const filename = `test-export-${Date.now()}.xlsx`;
      fs.writeFileSync(filename, buffer);
      console.log(
        `✅ Export Excel réussi: ${filename} (${buffer.length} octets)`
      );
      return true;
    } else {
      const data = await response.json();
      console.error("❌ Erreur d'export Excel:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'export Excel:", error.message);
    return false;
  }
}

async function testExportPDF(studentIds) {
  console.log("\n📑 Test d'export PDF...");
  try {
    const response = await fetch(`${API_URL}/search/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        studentIds: studentIds,
        format: "pdf",
      }),
    });

    if (response.ok) {
      const buffer = await response.buffer();
      const filename = `test-export-${Date.now()}.pdf`;
      fs.writeFileSync(filename, buffer);
      console.log(`✅ Export PDF réussi: ${filename} (${buffer.length} octets)`);
      return true;
    } else {
      const data = await response.json();
      console.error("❌ Erreur d'export PDF:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'export PDF:", error.message);
    return false;
  }
}

async function runTests() {
  console.log("🧪 Démarrage des tests d'export de recherche\n");
  console.log("=".repeat(60));

  // 1. Connexion
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log("\n❌ Impossible de continuer sans authentification");
    return;
  }

  // 2. Recherche d'étudiants
  const students = await testSearchStudents();
  if (students.length === 0) {
    console.log("\n⚠️  Aucun étudiant trouvé, impossible de tester l'export");
    return;
  }

  // Extraire les IDs des étudiants
  const studentIds = students.map((s) => s.id);
  console.log(`\n📌 Export de ${studentIds.length} étudiant(s)`);

  // 3. Tests d'export
  await testExportCSV(studentIds);
  await testExportExcel(studentIds);
  await testExportPDF(studentIds);

  console.log("\n" + "=".repeat(60));
  console.log("✅ Tests terminés");
}

// Exécuter les tests
runTests().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});
