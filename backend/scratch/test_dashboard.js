const axios = require('axios');

async function testDashboard() {
    try {
        console.log('--- Live Testing: Restaurant Dashboard ---');
        
        // 1. Login
        const loginRes = await axios.post('http://192.168.0.168:5000/api/auth/login', {
            email: 'owner@example.com',
            password: 'password123'
        });
        
        const token = loginRes.data.token;
        console.log('✅ Login Successful');
        
        // 2. Fetch Dashboard Analytics
        const statsRes = await axios.get('http://192.168.0.168:5000/api/restaurants/analytics', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ Analytics Data Fetched:');
        console.log(JSON.stringify(statsRes.data, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Testing Failed:', err.response?.data || err.message);
        process.exit(1);
    }
}

testDashboard();
