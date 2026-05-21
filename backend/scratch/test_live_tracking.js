const axios = require('axios');
const io = require('socket.io-client');

async function testLiveTracking() {
    const baseURL = 'http://192.168.0.168:5000/api';
    const socketURL = 'http://192.168.0.168:5000';
    
    try {
        console.log('--- 📡 STARTING LIVE TRACKING SIMULATION (DEBUG) ---');

        // 1. Get Tokens
        const custRes = await axios.post(`${baseURL}/auth/login`, { email: 'customer@example.com', password: 'password123' });
        const riderRes = await axios.post(`${baseURL}/auth/login`, { email: 'delivery@example.com', password: 'password123' });
        
        const customerToken = custRes.data.accessToken;
        const riderToken = riderRes.data.accessToken;

        // 2. Fetch a Restaurant and a Food item
        const restaurants = await axios.get(`${baseURL}/restaurants`);
        const restaurantId = restaurants.data[0]._id;
        const menu = await axios.get(`${baseURL}/restaurants/${restaurantId}/menu`);
        const food = menu.data[0];

        // 3. Place Order (Customer)
        console.log('[STEP 1] Customer Placing Order...');
        const orderRes = await axios.post(`${baseURL}/orders/place`, {
            restaurant: restaurantId,
            items: [{ 
                food: food._id, 
                quantity: 1,
                price: food.price 
            }],
            subtotal: food.price,
            taxPrice: 45,
            deliveryPrice: 40,
            totalAmount: food.price + 45 + 40,
            deliveryAddress: '101 Customer Ave, Udaipur',
            deliveryLocation: { lat: 24.5854, lng: 73.7125 },
            paymentMethod: 'cod'
        }, { headers: { Authorization: `Bearer ${customerToken}` } });
        
        // Debugging the response structure
        console.log('--- DEBUG: Order Response Data ---');
        console.log(JSON.stringify(orderRes.data, null, 2));

        const order = orderRes.data.order || orderRes.data.data?.order || orderRes.data;
        const orderId = order._id;
        
        if (!orderId) {
            throw new Error('Order ID not found in response');
        }
        
        console.log(`✅ Order Placed: ${orderId}`);

        // 4. Connect Rider via Socket
        console.log('[STEP 2] Connecting Rider Socket...');
        const socket = io(socketURL, { 
            auth: { token: riderToken },
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('✅ Rider Socket Connected');
            socket.emit('join_riders');
            socket.emit('join_order', orderId);
            
            let lat = 24.5854;
            let lng = 73.7125;
            
            console.log('🚀 Simulation Running for 15 seconds...');
            const interval = setInterval(() => {
                lat += 0.0005;
                lng += 0.0005;
                console.log(`📍 Live Update: Order ${orderId.slice(-4)} | Pos: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                socket.emit('update_location', {
                    orderId: orderId,
                    location: { lat, lng }
                });
            }, 2000);

            setTimeout(() => {
                clearInterval(interval);
                console.log('--- ✨ SIMULATION COMPLETE ---');
                process.exit(0);
            }, 15000);
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err.message);
            process.exit(1);
        });

    } catch (err) {
        console.error('❌ Tracking Test Failed:', err.response?.data || err.message);
        if (err.response?.data) console.log(JSON.stringify(err.response.data, null, 2));
        process.exit(1);
    }
}

testLiveTracking();
