import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Params } from '@/models/params'
import { getToken } from 'next-auth/jwt'

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params

    const user = await prisma?.user.findFirst({
      where: {
        id,
      },
      include: {
        comments: true,
        tags: true,
        posts: true,
      },
    })
    if (!user) {
      return NextResponse.json({ error: true, message: 'user not found' })
    }
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
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { error: true, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    const { id } = await params
    const user = await prisma?.user.delete({
      where: {
        id,
      },
    })
    if (!user) {
      return NextResponse.json({ error: true, message: 'user not found' })
    }
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
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const data = await request.json()
    const user = await prisma?.user.update({
      where: {
        id,
      },
      data,
    })
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
