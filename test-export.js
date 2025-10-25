/**
 * Script de test pour la fonctionnalité d'export des activités
 * 
 * Usage: node test-export.js <format> <token>
 * Exemple: node test-export.js csv eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

const http = require('http');
const fs = require('fs');

// Configuration
const API_HOST = 'localhost';
const API_PORT = 5000;
const format = process.argv[2] || 'csv';
const token = process.argv[3];

if (!token) {
  console.error('❌ Erreur: Token d\'authentification requis');
  console.log('Usage: node test-export.js <format> <token>');
  console.log('Formats disponibles: csv, excel, pdf');
  process.exit(1);
}

if (!['csv', 'excel', 'pdf'].includes(format)) {
  console.error('❌ Format invalide. Utilisez: csv, excel ou pdf');
  process.exit(1);
}

console.log(`🚀 Test d'export au format ${format.toUpperCase()}...`);

const postData = JSON.stringify({ format });

const options = {
  hostname: API_HOST,
  port: API_PORT,
  path: '/api/activities/export',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`📡 Statut HTTP: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  if (res.statusCode === 200) {
    const extension = format === 'excel' ? 'xlsx' : format;
    const filename = `test-export-${Date.now()}.${extension}`;
    const fileStream = fs.createWriteStream(filename);

    res.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      const stats = fs.statSync(filename);
      console.log(`✅ Export réussi !`);
      console.log(`📁 Fichier: ${filename}`);
      console.log(`📊 Taille: ${(stats.size / 1024).toFixed(2)} KB`);
    });
  } else if (res.statusCode === 401) {
    console.error('❌ Erreur d\'authentification. Vérifiez votre token.');
  } else {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.error(`❌ Erreur: ${res.statusCode}`);
      try {
        const error = JSON.parse(data);
        console.error(`Message: ${error.error || error.message}`);
      } catch {
        console.error(`Réponse: ${data}`);
      }
    });
  }
});

req.on('error', (e) => {
  console.error(`❌ Erreur de connexion: ${e.message}`);
  console.error('Vérifiez que le serveur backend est démarré sur le port 5000');
});

req.write(postData);
req.end();
