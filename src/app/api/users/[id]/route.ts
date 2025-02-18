import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Params } from '@/models/params'

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const user = await prisma?.user.findFirst({
      where: {
        id,
      },
      include: {
        posts: {
          include: {
            author: true,
            categories: true,
            tags: true,
            likes: true,
            comments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        comments: true,
        tags: true,
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
export async function DELETE(request: Request, { params }: Params) {
  try {
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
