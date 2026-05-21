const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB for MEGA expansion seeding...');
    const db = client.db('food-delivery');

    // Clear existing data
    await db.collection('restaurants').deleteMany({});
    await db.collection('foods').deleteMany({});
    await db.collection('users').deleteMany({ email: { $in: ['admin@example.com', 'owner@example.com', 'delivery@example.com', 'customer@example.com'] } });

    // Hash the password for the seeded users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create a dummy admin
    await db.collection('users').insertOne({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      address: '123 Admin St',
      phone: '1234567890',
      referralCode: 'SEED_ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create a dummy restaurant owner
    const ownerResult = await db.collection('users').insertOne({
      name: 'Restaurant Owner',
      email: 'owner@example.com',
      password: hashedPassword,
      role: 'restaurantOwner',
      address: '456 Owner St',
      phone: '9876543210',
      referralCode: 'SEED_OWNER',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const ownerId = ownerResult.insertedId;

    // Create a dummy delivery boy
    await db.collection('users').insertOne({
      name: 'Delivery Boy',
      email: 'delivery@example.com',
      password: hashedPassword,
      role: 'deliveryBoy',
      address: '789 Delivery St',
      phone: '1122334455',
      referralCode: 'SEED_DELIV',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create a dummy customer
    await db.collection('users').insertOne({
      name: 'John Doe',
      email: 'customer@example.com',
      password: hashedPassword,
      role: 'customer',
      address: '101 Customer Ave',
      phone: '5566778899',
      referralCode: 'SEED_CUST',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const restaurants = [
      {
        name: 'Pizza Bliss',
        description: 'Authentic stone-oven pizzas with fresh, organic toppings and artisanal dough.',
        address: '45 Pizza Ave, Food City',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
        cuisine: ['Pizza', 'Italian'],
        rating: 4.8,
        owner: ownerId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Burger Craft',
        description: 'Gourmet burgers made with 100% grass-fed beef and signature house sauces.',
        address: '12 Burger St, Food City',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
        cuisine: ['Burger', 'American'],
        rating: 4.6,
        owner: ownerId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bean Haven',
        description: 'Artisanal coffee house featuring specialty brews and freshly baked pastries.',
        address: '101 Coffee Lane, Food City',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
        cuisine: ['Coffee', 'Cafe'],
        rating: 4.7,
        owner: ownerId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sushi Zen',
        description: 'Premium sushi and sashimi prepared with the freshest catch of the day.',
        address: '88 Zen Blvd, Food City',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
        cuisine: ['Sushi', 'Japanese'],
        rating: 4.9,
        owner: ownerId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Taco Haven',
        description: 'Authentic flavors of Mexico featuring hand-pressed tortillas and bold salsas.',
        address: '22 Spice Rd, Food City',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800',
        cuisine: ['Mexican', 'Street Food'],
        rating: 4.7,
        owner: ownerId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Curry Palace',
        description: 'A royal journey through Indian spices, tandoori grills, and aromatic curries.',
        address: '77 Royal Ln, Food City',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
        cuisine: ['Indian', 'Spicy'],
        rating: 4.5,
        owner: ownerId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const foodItemsData = {
      'Pizza Bliss': [
        { name: 'Heritage Margherita', price: 449, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=800', desc: 'San Marzano tomatoes, fresh mozzarella, basil, and EVOO.' },
        { name: 'Double Pepperoni Feast', price: 549, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800', desc: 'Crispy pepperoni with loads of mozzarella on a thin crust.' },
        { name: 'Truffle Mushroom Pizza', price: 699, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', desc: 'Wild mushrooms, truffle oil, and creamy white sauce.' },
        { name: 'BBQ Smoked Chicken', price: 599, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800', desc: 'Grilled chicken, red onions, and smoky hickory BBQ sauce.' },
        { name: 'Garden Veggie Supreme', price: 499, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800', desc: 'Bell peppers, olives, mushrooms, and sweet corn.' }
      ],
      'Burger Craft': [
        { name: 'Artisan Beef Burger', price: 399, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', desc: 'Prime beef patty, aged cheddar, and house-made brioche.' },
        { name: 'Crispy Zinger Chicken', price: 349, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800', desc: 'Spicy breaded chicken breast with cooling slaw.' },
        { name: 'The Monster Stack', price: 599, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f6?auto=format&fit=crop&q=80&w=800', desc: 'Double patty, bacon, egg, and secret sauce.' },
        { name: 'Truffle Swiss Burger', price: 499, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7d43a?auto=format&fit=crop&q=80&w=800', desc: 'Beef patty topped with Swiss cheese and truffle mayo.' },
        { name: 'Ultimate Veggie Patty', price: 299, image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=800', desc: 'Hand-crafted plant-based patty with fresh greens.' }
      ],
      'Bean Haven': [
        { name: 'Caramel Macchiato', price: 249, image: 'https://images.unsplash.com/photo-1485808191679-5f63bb3fd8c9?auto=format&fit=crop&q=80&w=800', desc: 'Rich espresso with dulce de leche and velvety foam.' },
        { name: 'Premium Cold Brew', price: 199, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800', desc: 'Slow-steeped for 24 hours for a smooth, bold finish.' },
        { name: 'Hazelnut Latte', price: 229, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=800', desc: 'Silky steamed milk and espresso with roasted hazelnut.' },
        { name: 'Blueberry Glazed Muffin', price: 149, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', desc: 'Bursting with fresh blueberries and a sugary crust.' },
        { name: 'New York Cheesecake', price: 299, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800', desc: 'Classic creamy cheesecake on a buttery graham crust.' }
      ],
      'Sushi Zen': [
        { name: 'Salmon Nigiri Platter', price: 799, image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&q=80&w=800', desc: 'Fresh slices of Atlantic salmon over seasoned rice.' },
        { name: 'Dragon Tempura Roll', price: 649, image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&q=80&w=800', desc: 'Shrimp tempura and cucumber topped with avocado and eel sauce.' },
        { name: 'Assorted Sashimi', price: 999, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800', desc: 'Chef’s selection of the finest raw fish cuts.' },
        { name: 'California Sunshine Roll', price: 499, image: 'https://images.unsplash.com/photo-1559466273-d95e72debaf8?auto=format&fit=crop&q=80&w=800', desc: 'Crab meat, avocado, and cucumber with toasted sesame.' },
        { name: 'Spicy Tuna Crunch', price: 549, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=800', desc: 'Spicy minced tuna and tempura flakes with sriracha mayo.' }
      ],
      'Taco Haven': [
        { name: 'Street Style Beef Tacos', price: 349, image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=800', desc: 'Three soft tacos with slow-cooked beef and diced onions.' },
        { name: 'Cheesy Chicken Quesadilla', price: 399, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&q=80&w=800', desc: 'Grilled tortilla packed with spiced chicken and triple cheese.' },
        { name: 'Loaded Nachos Supreme', price: 449, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=800', desc: 'Corn chips topped with beans, cheese, jalapeños, and guac.' },
        { name: 'Giant Bean Burrito', price: 329, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800', desc: 'Whole wheat wrap filled with refried beans and mexican rice.' },
        { name: 'Cinnamon Churros', price: 199, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=800', desc: 'Crispy fried dough dusted with cinnamon sugar and chocolate dip.' }
      ],
      'Curry Palace': [
        { name: 'Royal Butter Chicken', price: 449, image: 'https://images.unsplash.com/photo-1603894584114-7030cb3f5f3e?auto=format&fit=crop&q=80&w=800', desc: 'Tender chicken in a creamy, buttery tomato-based gravy.' },
        { name: 'Paneer Tikka Masala', price: 399, image: 'https://images.unsplash.com/photo-1567184109411-47a7a392855f?auto=format&fit=crop&q=80&w=800', desc: 'Grilled cottage cheese cubes in a thick spiced sauce.' },
        { name: 'Lucknowi Mutton Biryani', price: 549, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800', desc: 'Fragrant basmati rice cooked with succulent lamb and spices.' },
        { name: 'Dal Makhani Gold', price: 349, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800', desc: 'Black lentils slow-cooked overnight with cream and butter.' },
        { name: 'Soft Garlic Naan', price: 99, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800', desc: 'Tandoor-baked flatbread with garlic and herb toppings.' }
      ]
    };

    for (const restData of restaurants) {
      const restResult = await db.collection('restaurants').insertOne(restData);
      const restId = restResult.insertedId;
      console.log(`Created Restaurant: ${restData.name}`);

      const items = foodItemsData[restData.name].map(item => ({
        name: item.name,
        description: item.desc,
        price: item.price,
        image: item.image,
        category: restData.cuisine[0],
        restaurant: restId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await db.collection('foods').insertMany(items);
      console.log(`- Added ${items.length} items to ${restData.name}`);
    }

    console.log('MEGA Expansion seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
};

seedData();
