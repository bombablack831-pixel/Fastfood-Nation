const axios = require('axios');

async function testEndpoints() {
  try {
    const res = await axios.get('http://localhost:5000/api/restaurants/trending');
    console.log('Trending Items Count:', res.data.length);
    if (res.data.length > 0) {
        console.log('Sample Trending Item:', res.data[0]);
    } else {
        console.log('No trending items found.');
    }
  } catch (error) {
    console.error('Error fetching trending:', error.message);
  }

  try {
     const res = await axios.get('http://localhost:5000/api/restaurants');
     console.log('Restaurants Count:', res.data.length);
  } catch (error) {
     console.error('Error fetching restaurants:', error.message);
  }
}

testEndpoints();
