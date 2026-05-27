import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

async function authorizeUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user || !user.hashedPassword) return null;

  if (user.lockedUntil && user.lockedUntil > new Date()) return null;

  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isValid) {
    const attempts = user.failedSignInAttempts + 1;
    const updates: Record<string, unknown> = { failedSignInAttempts: attempts };
    if (attempts >= 5) {
      updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      updates.failedSignInAttempts = 0;
    }
    await prisma.user.update({ where: { id: user.id }, data: updates });
    return null;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastSignIn: new Date(), failedSignInAttempts: 0, lockedUntil: null },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role || "user",
  };
}

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        return authorizeUser(credentials.email, credentials.password);
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: secureCookieOptions,
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: secureCookieOptions,
    },
    csrfToken: {
      name: `__Secure-next-auth.csrf-token`,
      options: secureCookieOptions,
    },
    pkceCodeVerifier: {
      name: `__Secure-next-auth.pkce.code_verifier`,
      options: {
        ...secureCookieOptions,
        maxAge: 60 * 15,
      },
    },
    state: {
      name: `__Secure-next-auth.state`,
      options: {
        ...secureCookieOptions,
        maxAge: 60 * 15,
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = (token.role as string) || "user";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "user";
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/new-user",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
