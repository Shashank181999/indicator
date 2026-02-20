// Mock database for development - stores data in memory
// Data persists during server runtime but resets on restart

const mockDb = {
  users: [
    {
      _id: 'admin-001',
      name: 'Admin User',
      email: 'admin@marketsniper.com',
      role: 'admin',
      subscriptionStatus: 'active',
      provider: 'credentials',
      createdAt: new Date('2024-01-01'),
    },
    {
      _id: 'user-001',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      subscriptionStatus: 'active',
      provider: 'credentials',
      createdAt: new Date('2024-01-15'),
    },
    {
      _id: 'user-002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      subscriptionStatus: 'none',
      provider: 'google',
      createdAt: new Date('2024-02-01'),
    },
    {
      _id: 'user-003',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      role: 'user',
      subscriptionStatus: 'active',
      provider: 'credentials',
      createdAt: new Date('2024-02-10'),
    },
  ],
  payments: [
    {
      _id: 'pay-001',
      userId: { _id: 'user-001', name: 'John Doe', email: 'john@example.com' },
      amount: 18,
      plan: 'monthly',
      status: 'completed',
      transactionId: 'TXN-001-ABC',
      paymentMethod: 'card',
      createdAt: new Date('2024-01-15'),
    },
    {
      _id: 'pay-002',
      userId: { _id: 'user-003', name: 'Mike Wilson', email: 'mike@example.com' },
      amount: 99,
      plan: 'yearly',
      status: 'completed',
      transactionId: 'TXN-002-DEF',
      paymentMethod: 'card',
      createdAt: new Date('2024-02-10'),
    },
    {
      _id: 'pay-003',
      userId: { _id: 'user-001', name: 'John Doe', email: 'john@example.com' },
      amount: 6,
      plan: 'weekly',
      status: 'completed',
      transactionId: 'TXN-003-GHI',
      paymentMethod: 'paypal',
      createdAt: new Date(),
    },
  ],
  subscriptions: [
    {
      _id: 'sub-001',
      userId: 'user-001',
      plan: 'monthly',
      amount: 18,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      status: 'active',
    },
    {
      _id: 'sub-002',
      userId: 'user-003',
      plan: 'yearly',
      amount: 99,
      startDate: new Date('2024-02-10'),
      endDate: new Date('2025-02-10'),
      status: 'active',
    },
  ],
};

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock User model
export const MockUser = {
  find: async (query = {}) => {
    let results = [...mockDb.users];
    if (query.email) {
      results = results.filter(u => u.email === query.email);
    }
    return {
      select: () => ({
        sort: () => results,
      }),
    };
  },
  findOne: async (query) => {
    if (query.email) {
      return mockDb.users.find(u => u.email.toLowerCase() === query.email.toLowerCase());
    }
    if (query._id) {
      return mockDb.users.find(u => u._id === query._id);
    }
    return null;
  },
  create: async (data) => {
    const newUser = {
      _id: generateId('user'),
      ...data,
      createdAt: new Date(),
    };
    mockDb.users.push(newUser);
    return newUser;
  },
};

// Mock Payment model
export const MockPayment = {
  find: async (query = {}) => {
    let results = [...mockDb.payments];
    if (query.userId) {
      results = results.filter(p => p.userId._id === query.userId || p.userId === query.userId);
    }
    return {
      populate: () => ({
        sort: () => results,
      }),
      sort: () => results,
    };
  },
  create: async (data) => {
    const newPayment = {
      _id: generateId('pay'),
      ...data,
      createdAt: new Date(),
    };
    mockDb.payments.push(newPayment);
    return {
      ...newPayment,
      save: async () => newPayment,
    };
  },
  generateTransactionId: () => `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
};

// Mock Subscription model
export const MockSubscription = {
  find: async (query = {}) => {
    let results = [...mockDb.subscriptions];
    if (query.userId) {
      results = results.filter(s => s.userId === query.userId);
    }
    if (query.status) {
      results = results.filter(s => s.status === query.status);
    }
    return results;
  },
  findOne: async (query) => {
    let results = mockDb.subscriptions;
    if (query.userId) {
      results = results.filter(s => s.userId === query.userId);
    }
    if (query.status) {
      results = results.filter(s => s.status === query.status);
    }
    return results[0] || null;
  },
  create: async (data) => {
    const newSub = {
      _id: generateId('sub'),
      ...data,
      createdAt: new Date(),
    };
    mockDb.subscriptions.push(newSub);
    return newSub;
  },
  updateMany: async (query, update) => {
    mockDb.subscriptions.forEach(sub => {
      if (sub.userId === query.userId && sub.status === query.status) {
        Object.assign(sub, update);
      }
    });
    return { modifiedCount: 1 };
  },
  getPlanPrice: (plan) => {
    const prices = { weekly: 6, monthly: 18, yearly: 99 };
    return prices[plan] || 0;
  },
  calculateEndDate: (plan, startDate) => {
    const date = new Date(startDate);
    if (plan === 'weekly') date.setDate(date.getDate() + 7);
    else if (plan === 'monthly') date.setMonth(date.getMonth() + 1);
    else if (plan === 'yearly') date.setFullYear(date.getFullYear() + 1);
    return date;
  },
};

// Check if we should use mock database
export const isMockDb = () => {
  return process.env.USE_MOCK_DB === 'true' || !process.env.MONGODB_URI;
};

export default mockDb;
