// Test script to check activities API
const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api/activities';
const TOKEN = 'YOUR_TOKEN_HERE'; // Replace with actual token from localStorage

async function testActivitiesAPI() {
  try {
    console.log('Testing GET /api/activities...');
    
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`✓ Success! Found ${data.data?.length || 0} activities`);
    } else {
      console.log('✗ Error:', data.error);
    }
  } catch (error) {
    console.error('✗ Request failed:', error.message);
  }
}

testActivitiesAPI();
