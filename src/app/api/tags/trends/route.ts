import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        posts: {
          some: {
            createdAt: {
              gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
            },
          },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
      include: {
        posts: true,
      },
    })

    const tagsTrends = tags.map((tag) => ({
      ...tag,
      posts: tag.posts.length,
    }))
    return NextResponse.json(tagsTrends)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
