import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

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
      type: 'tag',
      posts: tag.posts.length,
    }))

    const categories = await prisma.category.findMany({
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

    const categoriesTrends = categories.map((category) => ({
      ...category,
      type: 'category',
      posts: category.posts.length,
    }))
    return NextResponse.json(
      [...tagsTrends, ...categoriesTrends].sort((a, b) => b.posts - a.posts)
    )
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
