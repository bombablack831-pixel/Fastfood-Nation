const axios = require('axios');

async function testRegistration() {
  const formData = {
    name: 'Test User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'customer'
  };

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', formData);
    console.log('Registration Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Registration Error Response:', error.response.status, error.response.data);
    } else {
      console.log('Registration Error:', error.message);
    }
  }
}

testRegistration();
