import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const commentId = url.searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json({
        error: true,
        message: 'commentId is required',
      })
    }
    // const { postId } = await request.json()

    const comment = await prisma?.comment.findUnique({
      where: { id: commentId },
      include: { likes: true },
    })

    return NextResponse.json({ likes: comment?.likes })
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
  const { userId, commentId } = await request.json()

  try {
    const like = await prisma?.likeComment.findFirst({
      where: {
        commentId,
        userId,
      },
    })

    if (like) {
      await prisma?.likeComment.delete({
        where: {
          id: like.id,
          userId,
          commentId,
        },
      })
    } else {
      await prisma?.likeComment.create({
        data: {
          commentId,
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
