const axios = require('axios');

async function runLiveTests() {
    const baseURL = 'http://192.168.0.168:5000/api';
    
    try {
        console.log('--- 🚀 STARTING LIVE SYSTEM TESTS (FIXED) ---');

        // --- TEST 1: RESTAURANT DASHBOARD ---
        console.log('\n[TEST 1] Restaurant Dashboard Analytics...');
        const ownerLogin = await axios.post(`${baseURL}/auth/login`, {
            email: 'owner@example.com',
            password: 'password123'
        });
        
        // Fix: Use accessToken instead of token
        const ownerToken = ownerLogin.data.accessToken;
        console.log('✅ Login Successful');
        
        const analytics = await axios.get(`${baseURL}/restaurants/analytics`, {
            headers: { Authorization: `Bearer ${ownerToken}` }
        });
        console.log('✅ Analytics Fetched Successfully!');
        console.log('--- Data Summary ---');
        console.log('Total Revenue:', analytics.data.data?.totalRevenue || 0);
        console.log('Total Orders:', analytics.data.data?.totalOrders || 0);

        // --- TEST 2: RIDER DASHBOARD ---
        console.log('\n[TEST 2] Rider Dashboard Connectivity...');
        const riderLogin = await axios.post(`${baseURL}/auth/login`, {
            email: 'delivery@example.com',
            password: 'password123'
        });
        const riderToken = riderLogin.data.accessToken;
        
        const riderProfile = await axios.get(`${baseURL}/auth/profile`, {
            headers: { Authorization: `Bearer ${riderToken}` }
        });
        console.log('✅ Rider Profile Verified:', riderProfile.data.name);

        console.log('\n--- ✨ ALL SYSTEM CHECKS PASSED ---');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ TEST FAILED:', err.response?.data || err.message);
        process.exit(1);
    }
}

runLiveTests();
