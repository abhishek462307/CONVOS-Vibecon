const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'your_database_name');
    
    console.log('🔐 Seeding demo users...\n');

    const users = [
      {
        id: uuidv4(),
        name: 'Demo Customer',
        email: 'customer@demo.com',
        password: 'password123',
        type: 'customer',
        created_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Demo Merchant',
        email: 'merchant@demo.com',
        password: 'merchant123',
        type: 'merchant',
        created_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        type: 'customer',
        created_at: new Date()
      }
    ];

    await db.collection('users').deleteMany({ email: { $in: ['customer@demo.com', 'merchant@demo.com', 'sarah@example.com'] } });
    await db.collection('users').insertMany(users);

    console.log('✓ Created demo users:');
    console.log('  Customer: customer@demo.com / password123');
    console.log('  Merchant: merchant@demo.com / merchant123');
    console.log('  Customer: sarah@example.com / password123');
    console.log('\n✨ Auth seeding complete!');
  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    await client.close();
  }
}

seed();
