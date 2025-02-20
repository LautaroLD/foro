import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try {
    const { userId, postId, hasLike } = await request.json()

    // const post = await prisma?.post.findFirst({
    //   where: {
    //     id: postId,
    //   },
    //   include: {
    //     likes: true,
    //   },
    // })

    // const isLiked = post?.likes.some((like) => like.id === userId)
    const updateAction = hasLike
      ? { disconnect: { id: userId } }
      : { connect: { id: userId } }

    const updatedPost = await prisma?.post.update({
      where: { id: postId },
      data: {
        likes: updateAction,
      },
      include: { likes: true },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
