import { Params } from '@/models/params'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const { tagId } = await request.json()

    const user = await prisma?.user.findFirst({
      where: {
        id,
      },
      include: { tags: true },
    })

    const updatedUser = await prisma?.user.update({
      where: {
        id,
      },
      data: {
        tags: user?.tags.some((tag) => tag.id === tagId)
          ? {
              disconnect: {
                id: tagId,
              },
            }
          : {
              connect: {
                id: tagId,
              },
            },
      },
      include: { tags: true },
    })
    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
