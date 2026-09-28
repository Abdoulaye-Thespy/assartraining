import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

type LocalUser = { id: string; name: string; email: string; passwordHash: string; accessLevel?: 'free' | 'paid'; isAdmin?: boolean }

function getUsers(): LocalUser[] {
  try {
    return JSON.parse(process.env.AUTH_USERS_JSON ?? '[]') as LocalUser[]
  } catch {
    return []
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email et mot de passe',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Mot de passe', type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        const user = getUsers().find((candidate) => candidate.email.toLowerCase() === credentials.email.toLowerCase())
        if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) return null
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
