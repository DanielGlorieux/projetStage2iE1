const axios = require('axios');

// Test de création d'activité avec données complètes
async function testActivityCreation() {
  const baseURL = 'http://localhost:5000';
  
  try {
    // 1. Se connecter pour obtenir un token
    console.log('1. Connexion...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'daniel.ilboudo@2ie-edu.org',
      password: 'student123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✓ Token obtenu');
    
    // 2. Créer une activité avec différents scénarios
    console.log('\n2. Test avec données valides complètes...');
    const validActivity = {
      title: 'Mon activité de test complète',
      type: 'entrepreneuriat',
      description: 'Ceci est une description de plus de 100 caractères pour satisfaire la validation du backend. Elle contient suffisamment de détails pour être considérée comme valide et informative.',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'planned',
      priority: 'medium',
      estimatedHours: 10,
      actualHours: 0,
      objectives: ['Objectif 1 avec au moins 10 caractères', 'Objectif 2 avec au moins 10 caractères'],
      collaborators: [],
      outcomes: [],
      challenges: [],
      learnings: [],
      tags: [],
      documents: []
    };
    
    try {
      const response = await axios.post(
        `${baseURL}/api/activities`,
        validActivity,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ Activité créée avec succès:', response.data);
    } catch (error) {
      console.log('✗ Erreur lors de la création:', error.response?.data || error.message);
    }
    
    // 3. Test avec données minimales
    console.log('\n3. Test avec données minimales...');
    const minimalActivity = {
      title: 'Activité minimale',
      type: 'leadership',
      description: 'Description minimale de plus de 100 caractères pour respecter les contraintes de validation du backend qui requiert une description assez longue.'
    };
    
    try {
      const response = await axios.post(
        `${baseURL}/api/activities`,
        minimalActivity,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ Activité minimale créée:', response.data);
    } catch (error) {
      console.log('✗ Erreur:', error.response?.data || error.message);
    }
    
    // 4. Test avec description trop courte (devrait échouer)
    console.log('\n4. Test avec description trop courte (devrait échouer)...');
    const invalidActivity = {
      title: 'Activité invalide',
      type: 'digital',
      description: 'Description trop courte'
    };
    
    try {
      const response = await axios.post(
        `${baseURL}/api/activities`,
        invalidActivity,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✗ Ne devrait pas réussir:', response.data);
    } catch (error) {
      console.log('✓ Erreur attendue:', error.response?.data);
    }
    
    // 5. Test avec objectif trop court (devrait échouer)
    console.log('\n5. Test avec objectif trop court...');
    const activityWithShortObjective = {
      title: 'Test objectif court',
      type: 'entrepreneuriat',
      description: 'Description valide de plus de 100 caractères pour respecter les contraintes de validation du backend qui requiert une description assez longue.',
      objectives: ['Court']
    };
    
    try {
      const response = await axios.post(
        `${baseURL}/api/activities`,
        activityWithShortObjective,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✗ Ne devrait pas réussir:', response.data);
    } catch (error) {
      console.log('✓ Erreur attendue:', error.response?.data);
    }
    
  } catch (error) {
    console.error('Erreur générale:', error.message);
    if (error.response) {
      console.error('Détails:', error.response.data);
    }
  }
}

testActivityCreation();
