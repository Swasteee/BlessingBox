require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/database');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      username: 'admin',
      password: 'Admin123',
      email: 'admin@pooja.com',
    };

    const existingAdmin = await Admin.findOne({ username: adminData.username });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await Admin.create(adminData);
    console.log('Admin user created successfully:');
    console.log(`Username: ${admin.username}`);
    console.log(`Email: ${admin.email}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

