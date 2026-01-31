const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('real-estate-platform');
    const users = database.collection('users');

    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const newAdmin = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      joinDate: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await users.insertOne(newAdmin);
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Role: admin');
  } finally {
    await client.close();
  }
}

createAdmin().catch(console.error);