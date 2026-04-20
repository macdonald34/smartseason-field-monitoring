// This script seeds demo data into MongoDB
// Run with: node seed.js (from smartseason-backend root)

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const Field = require('./src/models/Field');
const Update = require('./src/models/Update');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartseason');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Field.deleteMany({});
    await Update.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const admin = new User({
      name: 'Admin User',
      email: 'admin@smartseason.com',
      password: 'admin123',
      role: 'admin',
    });

    const agent1 = new User({
      name: 'John Agent',
      email: 'agent@smartseason.com',
      password: 'agent123',
      role: 'agent',
    });

    const agent2 = new User({
      name: 'Sarah Field',
      email: 'sarah@smartseason.com',
      password: 'agent123',
      role: 'agent',
    });

    await admin.save();
    await agent1.save();
    await agent2.save();
    console.log('👥 Created demo users');

    // Create fields
    const field1 = new Field({
      name: 'North Field A',
      cropType: 'Wheat',
      plantingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      stage: 'Growing',
      assignedAgentId: agent1._id,
      createdBy: admin._id,
    });

    const field2 = new Field({
      name: 'South Field B',
      cropType: 'Rice',
      plantingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      stage: 'Growing',
      assignedAgentId: agent1._id,
      createdBy: admin._id,
    });

    const field3 = new Field({
      name: 'East Field C',
      cropType: 'Corn',
      plantingDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago
      stage: 'Growing',
      assignedAgentId: agent2._id,
      createdBy: admin._id,
    });

    const field4 = new Field({
      name: 'West Field D',
      cropType: 'Cotton',
      plantingDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
      stage: 'Ready',
      assignedAgentId: agent2._id,
      createdBy: admin._id,
    });

    const field5 = new Field({
      name: 'Unassigned Field E',
      cropType: 'Sugarcane',
      plantingDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      stage: 'Planted',
      assignedAgentId: null,
      createdBy: admin._id,
    });

    await field1.save();
    await field2.save();
    await field3.save();
    await field4.save();
    await field5.save();
    console.log('🌾 Created 5 demo fields');

    // Create sample updates
    const update1 = new Update({
      fieldId: field1._id,
      agentId: agent1._id,
      notes: 'Plants are healthy, about 30% growth. Watered yesterday.',
      stage: 'Growing',
    });

    const update2 = new Update({
      fieldId: field2._id,
      agentId: agent1._id,
      notes: 'Some pest activity detected. Applied pesticide.',
      stage: 'Growing',
    });

    const update3 = new Update({
      fieldId: field3._id,
      agentId: agent2._id,
      notes: 'Excellent growth. Ready for next phase soon.',
      stage: 'Growing',
    });

    await update1.save();
    await update2.save();
    await update3.save();
    console.log('📝 Created sample updates');

    console.log('\n✅ Database seeding completed successfully!\n');

    console.log('📊 Field Status Summary:');
    console.log('- Field 1 (30 days): Active');
    console.log('- Field 2 (60 days): Active');
    console.log('- Field 3 (100 days): At Risk (100+ days, not Ready)');
    console.log('- Field 4 (120 days): Active (Ready stage)');
    console.log('- Field 5 (45 days): Active\n');

    console.log('👤 Demo Accounts:');
    console.log('Admin:');
    console.log('  Email: admin@smartseason.com');
    console.log('  Password: admin123\n');

    console.log('Agent 1:');
    console.log('  Email: agent@smartseason.com');
    console.log('  Password: agent123\n');

    console.log('Agent 2:');
    console.log('  Email: sarah@smartseason.com');
    console.log('  Password: agent123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
