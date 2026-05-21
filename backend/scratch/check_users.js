const mongoose = require('mongoose');

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/food-delivery');
        console.log('Connected to MongoDB');
        
        const users = await mongoose.connection.db.collection('users').find({}, { projection: { name: 1, email: 1, role: 1 } }).limit(5).toArray();
        
        console.log('--- Test Accounts ---');
        users.forEach(user => {
            console.log(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
