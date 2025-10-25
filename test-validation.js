// Test de validation de l'API
const http = require('http');

// Token JWT - Remplacez par votre vrai token
const TOKEN = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJpYXQiOjE2OTAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.test';

const testData = JSON.stringify({
  title: "Test de création d'activité depuis script",
  type: "entrepreneuriat",
  description: "Description de test avec au moins 100 caractères pour passer la validation backend. Cette activité est créée dans le cadre d'un test de débogage pour identifier les problèmes de validation et de création d'activités dans le système LED de 2iE.",
  status: "planned",
  priority: "medium",
  estimatedHours: 10,
  objectives: ["Premier objectif avec au moins 10 caractères", "Deuxième objectif avec description complète"],
  outcomes: [],
  challenges: [],
  learnings: [],
  tags: ["test"],
  collaborators: []
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/activities',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('🧪 Test de validation de l\'API\n');
console.log('📤 Données envoyées:');
console.log(testData);
console.log('\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Réponse:');
    console.log('Status:', res.statusCode, res.statusMessage);
    console.log('\nBody:');
    try {
      const result = JSON.parse(data);
      console.log(JSON.stringify(result, null, 2));
      
      if (result.details && Array.isArray(result.details)) {
        console.log('\n❌ Erreurs de validation:');
        result.details.forEach((detail, index) => {
          console.log(`  ${index + 1}. ${detail.path || detail.param}: ${detail.msg}`);
        });
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur:', error.message);
});

req.write(testData);
req.end();
