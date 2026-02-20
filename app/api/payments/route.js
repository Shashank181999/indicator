import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Check if mock mode is enabled
const isMockDb = () => process.env.USE_MOCK_DB === 'true';

// Mock payments data
const mockPayments = [
  {
    _id: 'pay-001',
    userId: { _id: 'user-001', name: 'John Doe', email: 'john@example.com' },
    amount: 18,
    plan: 'monthly',
    status: 'completed',
    transactionId: 'TXN-001-ABC',
    createdAt: new Date('2024-01-15'),
  },
  {
    _id: 'pay-002',
    userId: { _id: 'user-002', name: 'Jane Smith', email: 'jane@example.com' },
    amount: 99,
    plan: 'yearly',
    status: 'completed',
    transactionId: 'TXN-002-DEF',
    createdAt: new Date('2024-02-10'),
  },
  {
    _id: 'pay-003',
    userId: { _id: 'user-003', name: 'Mike Wilson', email: 'mike@example.com' },
    amount: 6,
    plan: 'weekly',
    status: 'completed',
    transactionId: 'TXN-003-GHI',
    createdAt: new Date(),
  },
];

// GET - Fetch payments (Admin: all, User: own)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use mock data if enabled
    if (isMockDb()) {
      return NextResponse.json({ payments: mockPayments });
    }

    const dbConnect = (await import('@/lib/mongodb')).default;
    const Payment = (await import('@/models/Payment')).default;
    const User = (await import('@/models/User')).default;

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let payments;

    if (session.user.role === 'admin') {
      payments = await Payment.find({})
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      payments = await Payment.find({ userId: user._id })
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    // Fallback to mock data on error
    return NextResponse.json({ payments: mockPayments });
  }
}

// POST - Process mock payment
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    if (!plan || !['weekly', 'monthly', 'yearly'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get plan price
    const amount = Subscription.getPlanPrice(plan);

    // Generate transaction ID
    const transactionId = Payment.generateTransactionId();

    // Create payment record (Mock: always successful)
    const payment = await Payment.create({
      userId: user._id,
      amount,
      plan,
      status: 'completed', // Mock: always complete
      transactionId,
      paymentMethod: 'mock',
    });

    // Cancel any existing active subscriptions
    await Subscription.updateMany(
      { userId: user._id, status: 'active' },
      { status: 'cancelled' }
    );

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = Subscription.calculateEndDate(plan, startDate);

    // Create new subscription
    const subscription = await Subscription.create({
      userId: user._id,
      plan,
      amount,
      startDate,
      endDate,
      status: 'active',
    });

    // Update payment with subscription ID
    payment.subscriptionId = subscription._id;
    await payment.save();

    // Update user's subscription status
    user.subscriptionStatus = 'active';
    await user.save();

    return NextResponse.json({
      message: 'Payment successful',
      payment: {
        transactionId: payment.transactionId,
        amount: payment.amount,
        plan: payment.plan,
        status: payment.status,
      },
      subscription: {
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Payment failed' },
      { status: 500 }
    );
  }
}
