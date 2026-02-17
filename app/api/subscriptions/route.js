import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockSubscriptions, findMockUser } from '@/lib/mockAuth';

const USE_MOCK = process.env.USE_MOCK_AUTH === 'true';

// GET - Fetch current user's subscription
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mock mode - return mock subscription
    if (USE_MOCK) {
      const mockUser = findMockUser(session.user.email);
      if (mockUser && mockUser.subscriptionStatus === 'active') {
        const subscription = mockSubscriptions.find(s => s.userId === mockUser.id);
        return NextResponse.json({ subscription });
      }
      return NextResponse.json({ subscription: null });
    }

    // Real database mode
    const dbConnect = (await import('@/lib/mongodb')).default;
    const Subscription = (await import('@/models/Subscription')).default;
    const User = (await import('@/models/User')).default;

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ subscription: null });
    }

    const subscription = await Subscription.findOne({
      userId: user._id,
      status: 'active',
    }).sort({ createdAt: -1 });

    if (subscription && new Date(subscription.endDate) < new Date()) {
      subscription.status = 'expired';
      await subscription.save();
      user.subscriptionStatus = 'expired';
      await user.save();
      return NextResponse.json({ subscription: null, message: 'Subscription expired' });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    // Fallback to mock on error
    const session = await getServerSession(authOptions);
    if (session) {
      const mockUser = findMockUser(session.user.email);
      if (mockUser?.subscriptionStatus === 'active') {
        const subscription = mockSubscriptions.find(s => s.userId === mockUser.id);
        return NextResponse.json({ subscription });
      }
    }
    return NextResponse.json({ subscription: null });
  }
}

// POST - Create a new subscription
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json();

    if (!plan || !['weekly', 'monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Mock mode
    if (USE_MOCK) {
      const prices = { weekly: 499, monthly: 1499, yearly: 9999 };
      const endDate = new Date();
      if (plan === 'weekly') endDate.setDate(endDate.getDate() + 7);
      else if (plan === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
      else endDate.setFullYear(endDate.getFullYear() + 1);

      return NextResponse.json({
        message: 'Subscription created successfully (mock)',
        subscription: {
          plan,
          amount: prices[plan],
          startDate: new Date(),
          endDate,
          status: 'active',
        },
      });
    }

    // Real database mode
    const dbConnect = (await import('@/lib/mongodb')).default;
    const Subscription = (await import('@/models/Subscription')).default;
    const User = (await import('@/models/User')).default;

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await Subscription.updateMany(
      { userId: user._id, status: 'active' },
      { status: 'cancelled' }
    );

    const amount = Subscription.getPlanPrice(plan);
    const startDate = new Date();
    const endDate = Subscription.calculateEndDate(plan, startDate);

    const subscription = await Subscription.create({
      userId: user._id,
      plan,
      amount,
      startDate,
      endDate,
      status: 'active',
    });

    user.subscriptionStatus = 'active';
    await user.save();

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

// DELETE - Cancel subscription
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (USE_MOCK) {
      return NextResponse.json({ message: 'Subscription cancelled (mock)' });
    }

    const dbConnect = (await import('@/lib/mongodb')).default;
    const Subscription = (await import('@/models/Subscription')).default;
    const User = (await import('@/models/User')).default;

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await Subscription.findOneAndUpdate(
      { userId: user._id, status: 'active' },
      { status: 'cancelled' }
    );

    user.subscriptionStatus = 'cancelled';
    await user.save();

    return NextResponse.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
