require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Record = require('./src/models/Record');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
};

const usersData = [
  { name: 'Admin Core', email: 'admin@test.com', password: 'password123', role: 'admin' },
  { name: 'Analyst Sarah', email: 'sarah@test.com', password: 'password123', role: 'analyst' },
  { name: 'Viewer John', email: 'john@test.com', password: 'password123', role: 'viewer' },
  { name: 'Emma Watson', email: 'emma@test.com', password: 'password123', role: 'viewer' },
  { name: 'Liam Neeson', email: 'liam@test.com', password: 'password123', role: 'viewer' },
  { name: 'Ryan Gosling', email: 'ryan@test.com', password: 'password123', role: 'analyst' },
  { name: 'Chris Evans', email: 'chris@test.com', password: 'password123', role: 'viewer' },
  { name: 'Scarlett J.', email: 'scarlett@test.com', password: 'password123', role: 'viewer' },
  { name: 'Mark Ruffalo', email: 'mark@test.com', password: 'password123', role: 'viewer' },
  { name: 'Tom Holland', email: 'tom@test.com', password: 'password123', role: 'analyst' },
];

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data to prevent duplicates
    await User.deleteMany();
    await Record.deleteMany();
    console.log('🗑️ Cleared existing data...');

    const createdUsers = await User.create(usersData);
    console.log(`✅ Created ${createdUsers.length} users! (All passwords are 'password123')`);

    const categories = ['Salary', 'Food', 'Travel', 'Utilities', 'Entertainment', 'Healthcare'];

    const recordsData = [];

    // Create 45 random financial records
    for(let i = 0; i < 45; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const isIncome = Math.random() > 0.7; // 30% income, 70% expense
        const type = isIncome ? 'income' : 'expense';
        const amount = isIncome ? (Math.random() * 5000 + 1000) : (Math.random() * 500 + 50);
        const category = isIncome ? 'Salary' : categories[Math.floor(Math.random() * (categories.length - 1)) + 1];
        
        // Random date in the last year
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));

        recordsData.push({
            userId: randomUser._id,
            amount: parseFloat(amount.toFixed(2)),
            type,
            category,
            date,
            note: `Mock data: ${type} for ${category}`
        });
    }

    await Record.create(recordsData);
    console.log(`✅ Created ${recordsData.length} random financial records!`);

    console.log('🎉 Database Seeding Completed!');
    process.exit();

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
