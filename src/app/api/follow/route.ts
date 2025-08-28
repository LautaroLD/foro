import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { followingId } = await request.json()
    const token = await getToken({ req: request })
    const followerId = token?.id as string
    console.log(token?.id)
    if (followerId && followingId) {
      const following = await prisma?.userFollow.findFirst({
        where: {
          followerId,
          followingId,
        },
      })
      if (following) {
        await prisma?.userFollow.delete({
          where: {
            id: following.id,
          },
        })
      } else {
        await prisma?.userFollow.create({
          data: {
            followerId,
            followingId,
          },
        })
      }
    }
    return NextResponse.json({ status: 200, message: 'success' })
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error,
    })
  }
}
