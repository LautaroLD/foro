import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Params } from '@/models/params'

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const post = await prisma?.post.findFirst({
      where: {
        id,
      },
      include: {
        author: true,
        categories: true,
        files: true,
        tags: true,
        comments: {
          include: { author: true, likes: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: true,
      },
    })
    if (!post) {
      return NextResponse.json({ error: true, message: 'post not found' })
    }
    return NextResponse.json(post)
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
    const post = await prisma?.post.delete({
      where: {
        id,
      },
    })
    if (!post) {
      return NextResponse.json({ error: true, message: 'post not found' })
    }
    return NextResponse.json(post)
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
    const post = await prisma?.post.update({
      where: {
        id,
      },
      data: {
        ...data,
        categories: data.categories && {
          set:
            data.categories.length > 0
              ? data.categories.map((id: number) => ({ id }))
              : [],
        },
        tags: data.tags && {
          set:
            data.tags.length > 0 ? data.tags.map((id: number) => ({ id })) : [],
        },
      },
      include: { categories: true, tags: true, author: true },
    })
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
