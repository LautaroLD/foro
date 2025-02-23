import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

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
              },
            },
            {
              categories: {
                some: {
                  name: {
                    contains: searchParam as string,
                  },
                },
              },
            },
            {
              tags: {
                some: {
                  name: {
                    contains: searchParam as string,
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

    const reqFiles = form.getAll('files').map((file) => file as File)
    const reqCategories: Array<string> = form
      .getAll('categories')
      .map((id) => id as string)
    const reqTags: Array<string> = form.getAll('tags').map((id) => id as string)
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

    if (reqFiles.length > 0) {
      const filesByCloud = await Promise.all(
        reqFiles.map(async (file: File) => {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const newFile = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: `foro/post/${newPost.id}`, resource_type: 'auto' },
                (error, result) => {
                  if (error) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
                }
              )
              .end(buffer)
          })
          if (newFile) {
            const { secure_url } = newFile as UploadApiResponse
            return {
              type: file.type,
              src: secure_url,
            }
          } else {
            return null
          }
        })
      )
      const validUrls = filesByCloud.filter((url) => url !== null)
      await prisma.file.createMany({
        data: validUrls.map(({ type, src }) => ({
          type,
          src,
          postId: newPost.id,
        })),
      })
    }

    return NextResponse.json(newPost)
    // return NextResponse.json({ message: 'ok' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
