import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { Params } from '@/models/params'

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const likesParam = searchParams.get('likes')
    const recentParam = searchParams.get('recent')
    const tag = await prisma?.tag.findFirst({
      where: {
        slug: slug,
      },
      include: {
        posts: {
          include: {
            author: true,
            categories: true,
            tags: true,
            files: true,
            comments: true,
            likes: true,
          },
          orderBy: {
            createdAt: recentParam
              ? (recentParam as 'asc' | 'desc')
              : undefined,
            likes: likesParam
              ? {
                  _count: likesParam as 'asc' | 'desc',
                }
              : undefined,
          },
          skip: searchParams.get('page')
            ? (parseInt(searchParams.get('page') as string) - 1) * 10
            : 0,
          take: 10,
        },
      },
    })
    if (!tag) {
      return NextResponse.json({ error: true, message: 'tag not found' })
    }
    return NextResponse.json(tag.posts)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
