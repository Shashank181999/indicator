import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { useMockDb, MockUser } from '@/lib/mockDb';

// Dynamic imports for MongoDB (only when needed)
let dbConnect, User;
const loadMongoDb = async () => {
  if (!dbConnect) {
    const mongoModule = await import('@/lib/mongodb');
    const userModule = await import('@/models/User');
    dbConnect = mongoModule.default;
    User = userModule.default;
  }
};

// GET - Fetch all users (Admin only)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use mock database if MongoDB is not configured
    if (useMockDb()) {
      const result = await MockUser.find({});
      const users = await result.select('-password').sort({ createdAt: -1 });
      return NextResponse.json({ users });
    }

    await loadMongoDb();
    await dbConnect();

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to mock data on error
    if (useMockDb()) {
      const result = await MockUser.find({});
      const users = await result.select('-password').sort({ createdAt: -1 });
      return NextResponse.json({ users });
    }
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user (Registration)
export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Use mock database if MongoDB is not configured
    if (useMockDb()) {
      const existingUser = await MockUser.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await MockUser.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        provider: 'credentials',
        subscriptionStatus: 'none',
      });

      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    await loadMongoDb();
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      provider: 'credentials',
      subscriptionStatus: 'none',
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
