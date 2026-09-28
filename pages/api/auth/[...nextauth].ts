import NextAuth, { type NextAuthOptions } from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH0_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.accessLevel = token.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'paid' : 'free'
        token.isAdmin = token.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessLevel = (token.accessLevel as string) ?? 'free'
        session.user.isAdmin = Boolean(token.isAdmin)
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
