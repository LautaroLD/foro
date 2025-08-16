import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const searchParam = searchParams.get('q')
  const likesParam = searchParams.get('likes')
  const recentParam = searchParams.get('recent')
  try {
    if (searchParam) {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: searchParam as string,
                mode: 'insensitive',
              },
            },
            {
              categories: {
                some: {
                  name: {
                    contains: searchParam as string,
                    mode: 'insensitive',
                  },
                },
              },
            },
            {
              tags: {
                some: {
                  name: {
                    contains: searchParam as string,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        },
        include: {
          categories: true,
          tags: true,
        },
      })

      return NextResponse.json(posts)
    } else {
      const posts = await prisma?.post.findMany({
        include: {
          author: true,
          categories: true,
          tags: true,
          files: true,
          comments: true,
          likes: true,
        },
        orderBy: {
          createdAt: recentParam ? (recentParam as 'asc' | 'desc') : undefined,
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
      })
      return NextResponse.json(posts)
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()

    const reqCategories: Array<string> = form.getAll('categories') as string[]
    const reqTags: Array<string> = form.getAll('tags') as string[]
    const reqTitle = form.get('title') as string
    const reqContent = form.get('content') as string
    const reqTypeContent = form.get('typeContent') as string
    const reqAuthorId = form.get('authorId') as string

    const newPost = await prisma.post.create({
      data: {
        title: reqTitle,
        content: reqContent.length > 0 ? reqContent : undefined,
        authorId: reqAuthorId,
        typeContent: reqTypeContent,
        categories: reqCategories && {
          connect:
            reqCategories.length > 0
              ? reqCategories.map((id: string) => ({ id }))
              : [],
        },
        tags: reqTags && {
          connect:
            reqTags.length > 0 ? reqTags.map((id: string) => ({ id })) : [],
        },
      },
    })

    return NextResponse.json(newPost)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
