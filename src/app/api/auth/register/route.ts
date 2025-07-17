import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import bcrypt from 'bcrypt'
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/

    if (!regex.test(data.password)) {
      return NextResponse.json({
        message:
          'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número',
        status: 400,
      })
    }
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
