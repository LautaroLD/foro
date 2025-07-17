import prisma from '@/libs/prisma'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // @ts-expect-error: credentials type is not inferred correctly
      async authorize(credentials) {
        try {
          const { email, password } = credentials || {}

          if (!email || !password) {
            throw new Error('Email and password must be provided')
          }
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            throw new Error()
          }

          const isValidPassword = await bcrypt.compare(password, user.password)
          if (!isValidPassword) {
            throw new Error()
          }

          return user
        } catch (error) {
          console.error('Authorization error:', error)
          if (error instanceof Error) {
            throw new Error(error.message)
          }
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async redirect() {
      return process.env.NEXTAUTH_URL as string
    },
  },
})
export { handler as GET, handler as POST }
