import prisma from '@/libs/prisma'
import { getToken } from 'next-auth/jwt'
import { Params } from '@/models/params'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, { params }: Params) {
  const token = await getToken({ req: request })
  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const { oldPassword, newPassword } = await request.json()
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/

  if (!regex.test(newPassword)) {
    return NextResponse.json(
      {
        message:
          'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número',
      },
      { status: 400 }
    )
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select: { password: true },
  })

  if (!user) {
    return NextResponse.json(
      { message: 'Usuario no encontrado' },
      { status: 404 }
    )
  }

  const isValidPassword = await bcrypt.compare(
    oldPassword,
    user.password as string
  )
  if (!isValidPassword) {
    return NextResponse.json(
      { message: 'Contraseña actual incorrecta' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  })

  return NextResponse.json(
    { message: 'Contraseña actualizada correctamente' },
    { status: 200 }
  )
}
