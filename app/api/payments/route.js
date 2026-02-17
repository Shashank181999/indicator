import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

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
      // Admin can see all payments
      payments = await Payment.find({})
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // User can only see their own payments
      payments = await Payment.find({ userId: user._id })
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
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
