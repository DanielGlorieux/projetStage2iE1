/**
 * Script de test pour vérifier les statistiques du Dashboard
 * 
 * Usage: node test-dashboard-stats.js <token>
 * Le token doit être celui d'un superviseur ou membre de l'équipe LED
 */

const http = require('http');

const token = process.argv[2];

if (!token) {
  console.error('❌ Erreur: Token d\'authentification requis');
  console.log('Usage: node test-dashboard-stats.js <token>');
  console.log('\nPour obtenir un token:');
  console.log('1. Connectez-vous sur l\'application web');
  console.log('2. Ouvrez la console du navigateur (F12)');
  console.log('3. Tapez: localStorage.getItem("token")');
  console.log('4. Copiez le token affiché');
  process.exit(1);
}

console.log('🧪 Test des statistiques du Dashboard...\n');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/search/stats',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`📡 Statut HTTP: ${res.statusCode}\n`);

  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ Statistiques récupérées avec succès!\n');
        
        const stats = result.data;
        
        console.log('📊 STATISTIQUES ÉTUDIANTS:');
        console.log(`   Total étudiants: ${stats.totalStudents}`);
        console.log(`   Étudiants actifs: ${stats.studentsWithActivities}`);
        console.log(`   Taux d'activité: ${stats.activeStudentsRate}%\n`);
        
        console.log('📝 STATISTIQUES ACTIVITÉS:');
        console.log(`   Total activités: ${stats.totalActivities}`);
        console.log('\n   Par statut:');
        Object.entries(stats.activitiesByStatus || {}).forEach(([status, count]) => {
          console.log(`     - ${status}: ${count}`);
        });
        console.log('\n   Par type:');
        Object.entries(stats.activitiesByType || {}).forEach(([type, count]) => {
          console.log(`     - ${type}: ${count}`);
        });
        
        console.log('\n🎯 SCORES MOYENS:');
        console.log(`   Entrepreneuriat: ${stats.averageScores?.entrepreneuriat || 0}/100`);
        console.log(`   Leadership: ${stats.averageScores?.leadership || 0}/100`);
        console.log(`   Digital: ${stats.averageScores?.digital || 0}/100`);
        console.log(`   Score global: ${stats.globalAverageScore || 0}/100\n`);
        
        console.log('🕒 ACTIVITÉS RÉCENTES:');
        if (stats.recentActivities && stats.recentActivities.length > 0) {
          stats.recentActivities.slice(0, 5).forEach((activity, index) => {
            console.log(`   ${index + 1}. ${activity.title}`);
            console.log(`      Type: ${activity.type} | Statut: ${activity.status}`);
            console.log(`      Par: ${activity.user} | Date: ${new Date(activity.createdAt).toLocaleDateString('fr-FR')}`);
          });
        } else {
          console.log('   Aucune activité récente');
        }
        
        console.log('\n💡 ANALYSE:');
        
        if (stats.totalStudents === 0) {
          console.log('   ⚠️  Aucun étudiant dans la base de données');
        }
        
        if (stats.totalActivities === 0) {
          console.log('   ⚠️  Aucune activité dans la base de données');
        }
        
        if (stats.totalActivities > 0 && stats.globalAverageScore === 0) {
          console.log('   ⚠️  Aucune activité n\'a encore été évaluée');
          console.log('       Les scores seront à 0 tant qu\'il n\'y a pas d\'évaluations');
        }
        
        if (stats.totalStudents > 0 && stats.studentsWithActivities === 0) {
          console.log('   ⚠️  Aucun étudiant n\'a créé d\'activité');
        }
        
        if (stats.totalActivities > 0 && stats.globalAverageScore > 0) {
          console.log('   ✅ Les données semblent cohérentes!');
          console.log('   ✅ Le Dashboard devrait afficher les bonnes statistiques');
        }
        
      } else {
        console.error('❌ Erreur dans la réponse:');
        console.error(result.error || 'Erreur inconnue');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du parsing JSON:');
      console.error(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Erreur de connexion: ${e.message}`);
  console.error('Vérifiez que le serveur backend est démarré sur le port 5000');
});

req.end();
