const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/indicator-sniper';

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  provider: { type: String, default: 'credentials' },
  subscriptionStatus: { type: String, default: 'none' },
  createdAt: { type: Date, default: Date.now },
});

// Subscription Schema
const SubscriptionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  plan: String,
  amount: Number,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, default: 'active' },
});

// Payment Schema
const PaymentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  plan: String,
  status: { type: String, default: 'completed' },
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
});

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
    const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@marketsniper.com' },
      {
        name: 'Admin User',
        email: 'admin@marketsniper.com',
        password: adminPassword,
        role: 'admin',
        provider: 'credentials',
        subscriptionStatus: 'active',
      },
      { upsert: true, new: true }
    );
    console.log('Admin user created:', admin.email);

    // Create subscription for admin
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    await Subscription.findOneAndUpdate(
      { userId: admin._id },
      {
        userId: admin._id,
        plan: 'yearly',
        amount: 9999,
        startDate: new Date(),
        endDate: endDate,
        status: 'active',
      },
      { upsert: true, new: true }
    );
    console.log('Admin subscription created');

    // Create a regular test user
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await User.findOneAndUpdate(
      { email: 'user@test.com' },
      {
        name: 'Test User',
        email: 'user@test.com',
        password: userPassword,
        role: 'user',
        provider: 'credentials',
        subscriptionStatus: 'none',
      },
      { upsert: true, new: true }
    );
    console.log('Test user created:', user.email);

    // Create some sample payments
    await Payment.create([
      {
        userId: admin._id,
        amount: 9999,
        plan: 'yearly',
        status: 'completed',
        transactionId: 'TXN_SEED_001',
        createdAt: new Date(),
      },
    ]);
    console.log('Sample payments created');

    console.log('\n========================================');
    console.log('SEED COMPLETED SUCCESSFULLY!');
    console.log('========================================');
    console.log('\nTest Accounts:');
    console.log('----------------------------------------');
    console.log('ADMIN (full access + indicators):');
    console.log('  Email: admin@marketsniper.com');
    console.log('  Password: admin123');
    console.log('----------------------------------------');
    console.log('USER (no subscription):');
    console.log('  Email: user@test.com');
    console.log('  Password: user123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
