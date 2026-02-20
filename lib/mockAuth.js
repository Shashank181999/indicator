// Mock authentication for demo purposes when MongoDB is not available

export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    subscriptionStatus: 'active',
    image: null,
  },
  {
    id: '2',
    name: 'Pro User',
    email: 'user@demo.com',
    password: 'user123',
    role: 'user',
    subscriptionStatus: 'active',
    image: null,
  },
  {
    id: '3',
    name: 'Free User',
    email: 'free@demo.com',
    password: 'free123',
    role: 'user',
    subscriptionStatus: 'active',
    image: null,
  },
];

export const mockSubscriptions = [
  {
    _id: 'sub1',
    userId: '1',
    plan: 'yearly',
    amount: 9999,
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    _id: 'sub2',
    userId: '2',
    plan: 'monthly',
    amount: 1499,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  {
    _id: 'sub3',
    userId: '3',
    plan: 'weekly',
    amount: 499,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
];

export const mockPayments = [
  {
    _id: 'pay1',
    userId: { _id: '1', name: 'Admin User', email: 'admin@demo.com' },
    amount: 9999,
    plan: 'yearly',
    status: 'completed',
    transactionId: 'TXN_DEMO_001',
    createdAt: new Date(),
  },
  {
    _id: 'pay2',
    userId: { _id: '2', name: 'Test User', email: 'user@demo.com' },
    amount: 1499,
    plan: 'monthly',
    status: 'completed',
    transactionId: 'TXN_DEMO_002',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export function findMockUser(email) {
  return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function validateMockUser(email, password) {
  const user = findMockUser(email?.trim());
  if (user && user.password === password?.trim()) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      image: user.image,
    };
  }
  console.log('Mock auth failed for:', email, 'Found user:', !!user);
  return null;
}
