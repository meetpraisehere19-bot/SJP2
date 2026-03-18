const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        email: 'admin@sjp2.com',
        password: 'admin123',
        role: 'admin',
        firstName: 'System',
        lastName: 'Admin',
        isApproved: true
      });
      await admin.save();
      console.log('Admin user created: admin@sjp2.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    await mongoose.disconnect();
    console.log('Seed completed');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();