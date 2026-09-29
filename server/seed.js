require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Group = require('./models/Group');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing
    await User.deleteMany();
    await Group.deleteMany();

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      passwordHash: 'password123',
      role: 'admin'
    });

    const student1 = await User.create({
      name: 'Student One',
      email: 'student1@test.com',
      passwordHash: 'password123',
      role: 'student'
    });

    const student2 = await User.create({
      name: 'Student Two',
      email: 'student2@test.com',
      passwordHash: 'password123',
      role: 'student'
    });

    const student3 = await User.create({
      name: 'Student Three',
      email: 'student3@test.com',
      passwordHash: 'password123',
      role: 'student'
    });

    // Create a group that has a max of 2, and student1 and student2 join it making it full.
    const group1 = await Group.create({
      name: 'Advanced React Patterns',
      description: 'Discussing hooks, context, and performance optimization in React.',
      subject: 'Computer Science',
      maxMembers: 2,
      admin: admin._id,
      members: [admin._id, student1._id, student2._id] // This will make student count = 2 + admin, wait: if maxMembers is 2, students filling it up
    });

    console.log('Seed data inserted successfully!');
    console.log('Credentials:');
    console.log('Admin: admin@test.com / password123');
    console.log('Students: student1@test.com, student2@test.com, student3@test.com / password123');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
