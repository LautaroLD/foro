import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import bcrypt from 'bcrypt'
export async function POST(request: Request) {
  try {
    const data = await request.json()
    data.password = await bcrypt.hash(data.password, 10)
    const newUser = await prisma.user.create({
      data,
    })
    // eslint-disable-next-line
    const { password, ...user } = newUser
    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
