import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { Params } from '@/models/params'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: Params) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const data = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        categories: {
          include: {
            posts: true,
          },
        },
        tags: {
          include: {
            posts: true,
          },
        },
      },
    })
    const tagsWithPosts =
      data?.tags.map((tag) => ({
        ...tag,
        type: 'tag',
        posts: tag.posts.length,
      })) || []
    const categoriesWithPosts =
      data?.categories.map((category) => ({
        ...category,
        type: 'category',
        posts: category.posts.length,
      })) || []
    return NextResponse.json(
      {
        topics: tagsWithPosts.concat(categoriesWithPosts) || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching tags and categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags and categories' },
      { status: 500 }
    )
  }
}
