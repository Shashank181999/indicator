import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { validateMockUser, findMockUser } from './mockAuth';

// Use mock auth if explicitly set OR if no MongoDB URI is configured
const USE_MOCK = process.env.USE_MOCK_AUTH === 'true' || !process.env.MONGODB_URI;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        // Use mock authentication
        if (USE_MOCK) {
          const user = validateMockUser(credentials.email, credentials.password);
          if (!user) {
            throw new Error('Invalid email or password. Try: admin@demo.com / admin123');
          }
          return user;
        }

        // Real database authentication
        try {
          const bcrypt = (await import('bcryptjs')).default;
          const dbConnect = (await import('./mongodb')).default;
          const User = (await import('@/models/User')).default;

          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found with this email');
          }

          if (!user.password) {
            throw new Error('Please sign in with Google');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            subscriptionStatus: user.subscriptionStatus,
            image: user.image,
          };
        } catch (error) {
          // If database connection fails, try mock auth
          console.log('Database unavailable, trying mock auth...', error.message);
          const user = validateMockUser(credentials.email, credentials.password);
          if (!user) {
            throw new Error('Invalid email or password. Try: admin@demo.com / admin123');
          }
          return user;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && !USE_MOCK) {
        try {
          const dbConnect = (await import('./mongodb')).default;
          const User = (await import('@/models/User')).default;

          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: 'google',
              role: 'user',
              subscriptionStatus: 'none',
            });
          }
        } catch (error) {
          console.log('Database unavailable for Google sign in');
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.subscriptionStatus = user.subscriptionStatus;
      }

      if (trigger === 'update' && session) {
        token.subscriptionStatus = session.subscriptionStatus;
      }

      // For mock mode, get data from mock users
      if (token.email) {
        const mockUser = findMockUser(token.email);
        if (mockUser) {
          token.id = mockUser.id;
          token.role = mockUser.role;
          token.subscriptionStatus = mockUser.subscriptionStatus;
        } else if (!USE_MOCK) {
          try {
            const dbConnect = (await import('./mongodb')).default;
            const User = (await import('@/models/User')).default;

            await dbConnect();
            const dbUser = await User.findOne({ email: token.email });
            if (dbUser) {
              token.id = dbUser._id.toString();
              token.role = dbUser.role;
              token.subscriptionStatus = dbUser.subscriptionStatus;
            }
          } catch (error) {
            // Database unavailable, keep existing token data
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.subscriptionStatus = token.subscriptionStatus;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-development-secret-key',
};
