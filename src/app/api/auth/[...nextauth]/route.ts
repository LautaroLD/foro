import prisma from '@/libs/prisma'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client/scripts/default-index.js'
import { AdapterUser } from 'next-auth/adapters'
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      firstName?: string | null
      lastName?: string | null
    }
  }
}
function CustomAdapter(prisma: PrismaClient) {
  const adapter = PrismaAdapter(prisma)
  adapter.createUser = async (data: {
    id: string
    name: string
    email: string
    image: string
  }) => {
    const { name, ...rest } = data
    return prisma.user.create({
      data: {
        ...rest,
        firstName: name.split(' ')[0] as string,
        lastName: name.split(' ')[1] as string,
      },
    })
  }
  return adapter
}
const handler = NextAuth({
  adapter: CustomAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || null,
          email: profile.email || null,
          image: profile.picture || null,
        }
      },
    }),
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

          const isValidPassword = await bcrypt.compare(
            password,
            user.password as string
          )
          if (!isValidPassword) {
            throw new Error()
          }

          return {
            ...user,
            firstName: user.firstName || null,
            lastName: user.lastName || null,
          }
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
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        const userComplete = user as AdapterUser & {
          firstName?: string | null
          lastName?: string | null
        }
        token.id = user.id
        token.firstName = userComplete.firstName
        token.lastName = userComplete.lastName
      }

      return token
    },
    async redirect({ baseUrl }) {
      return baseUrl
    },
  },
})
export { handler as GET, handler as POST }
