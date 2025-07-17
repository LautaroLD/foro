import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const postId = url.searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: true, message: 'postId is required' })
    }
    // const { postId } = await request.json()

    const posts = await prisma?.post.findUnique({
      where: { id: postId },
      include: { likes: true },
    })

    return NextResponse.json({ likes: posts?.likes })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}

export async function PATCH(request: Request) {
  const { userId, postId } = await request.json()

  try {
    const like = await prisma?.likePost.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    })

    if (like) {
      await prisma?.likePost.delete({
        where: {
          id: like.id,
          userId,
          postId,
        },
      })
    } else {
      await prisma?.likePost.create({
        data: {
          postId,
          userId,
        },
      })
    }

    return NextResponse.json({ message: 'success' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
