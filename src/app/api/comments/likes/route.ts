import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const { userId, commentId } = await request.json()

    const comment = await prisma?.comment.findFirst({
      where: {
        id: commentId,
      },
      include: {
        likes: true,
      },
    })
    const updatedComment = await prisma?.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likes: comment?.likes.some((like) => like.id === userId)
          ? {
              disconnect: {
                id: userId,
              },
            }
          : {
              connect: {
                id: userId,
              },
            },
      },
      include: { likes: true },
    })
    return NextResponse.json(updatedComment)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
