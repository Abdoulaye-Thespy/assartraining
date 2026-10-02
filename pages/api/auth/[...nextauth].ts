import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from '@/lib/users'

type LocalUser = Awaited<ReturnType<typeof findUserByEmail>>

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email et mot de passe',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Mot de passe', type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        const user = await findUserByEmail(String(credentials.email))
        if (!user || !user.emailVerifiedAt) return null
        const passwordMatches = await bcrypt.compare(String(credentials.password), user.passwordHash)
        if (!passwordMatches) return null
        return { id: user.id, name: user.name, email: user.email, accessLevel: user.accessLevel ?? 'free', isAdmin: Boolean(user.isAdmin) }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const signedInUser = user as typeof user & { accessLevel?: string; isAdmin?: boolean }
        token.accessLevel = signedInUser.accessLevel ?? 'free'
        token.isAdmin = Boolean(signedInUser.isAdmin)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.accessLevel = (token.accessLevel as string) ?? 'free'
        session.user.isAdmin = Boolean(token.isAdmin)
      }
      return session
    },
  },
  pages: { signIn: '/login' },
}

export default NextAuth(authOptions)
