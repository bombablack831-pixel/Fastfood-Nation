const io = require('socket.io-client');
const socket = io('http://localhost:5000');

// Example Order ID - replace with a real one if needed
const orderId = process.argv[2] || '6617a9eda8e58c0e'; 

console.log(`🛰️ Initializing Rider Simulation for Order: ${orderId}`);

// Delhi Center coordinates roughly
const start = { lat: 28.6139, lng: 77.2090 };
const end = { lat: 28.6500, lng: 77.2500 };

const steps = 50;
let currentStep = 0;

socket.on('connect', () => {
    console.log('✅ Connected to Spice Hub Satellite Grid');
    
    const interval = setInterval(() => {
        if (currentStep > steps) {
            console.log('🏁 Mission Accomplished: Payload Delivered');
            clearInterval(interval);
            process.exit();
        }

        const lat = start.lat + (end.lat - start.lat) * (currentStep / steps);
        const lng = start.lng + (end.lng - start.lng) * (currentStep / steps);

        console.log(`📍 Transmitting Vector: [${lat.toFixed(6)}, ${lng.toFixed(6)}] | Step ${currentStep}/${steps}`);

        socket.emit('update_location', {
            orderId,
            location: { lat, lng },
            heading: 45
        });

        currentStep++;
    }, 2000); // Update every 2 seconds
});

socket.on('disconnect', () => {
    console.log('❌ Lost Signal with Command Center');
});
