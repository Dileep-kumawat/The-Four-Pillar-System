import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
    }),
    Credentials({
      name: 'Email Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@example.com' },
        name: { label: 'Name', type: 'text', placeholder: 'Demo User' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        await connectToDatabase();

        let user = await User.findOne({ email: credentials.email.toString().toLowerCase() });

        if (!user) {
          // Auto-create user for frictionless local testing (acts as passwordless signup/login)
          const userName = (credentials.name as string) || credentials.email.toString().split('@')[0];
          user = await User.create({
            email: credentials.email.toString().toLowerCase(),
            name: userName,
            image: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(credentials.email.toString())}`,
            timezone: 'UTC', // Default to UTC
          });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          timezone: user.timezone,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;
        await connectToDatabase();
        let dbUser = await User.findOne({ email: user.email.toLowerCase() });
        if (!dbUser) {
          dbUser = await User.create({
            email: user.email.toLowerCase(),
            name: user.name || user.email.split('@')[0],
            image: user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email)}`,
            timezone: 'UTC',
          });
        }
        // Attach DB ID to user object for session callback
        user.id = dbUser._id.toString();
        (user as any).timezone = dbUser.timezone;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.timezone = (user as any).timezone || 'UTC';
      }
      
      // Handle session updates (e.g. timezone changes)
      if (trigger === 'update' && session) {
        if (session.timezone) {
          token.timezone = session.timezone;
        }
        if (session.name) {
          token.name = session.name;
        }
        if (session.image) {
          token.picture = session.image;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).timezone = (token.timezone as string) || 'UTC';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || 'supersecretkeyforlocaldevelopment1234567890',
});
