import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Params } from '@/models/params'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const post = await prisma?.post.findFirst({
      where: {
        id,
      },
      include: {
        author: true,
        categories: true,
        files: true,
        tags: true,
        comments: {
          include: { author: true, likes: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: true,
      },
    })
    if (!post) {
      return NextResponse.json({ error: true, message: 'post not found' })
    }
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const post = await prisma?.post.delete({
      where: {
        id,
      },
    })
    if (!post) {
      return NextResponse.json({ error: true, message: 'post not found' })
    }
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const form = await request.formData()
    const reqFiles = form.getAll('files').map((file) => file)
    const reqCategories: Array<string> = form.getAll('categories') as string[]
    const reqTags: Array<string> = form.getAll('tags') as string[]
    const reqTitle = form.get('title') as string
    const reqContent = form.get('content') as string
    const reqTypeContent = form.get('typeContent') as string
    const reqAuthorId = form.get('authorId') as string

    const postUpdated = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title: reqTitle,
        content:
          reqContent.length > 0 && reqTypeContent === 'text'
            ? reqContent
            : undefined,
        authorId: reqAuthorId,
        typeContent: reqTypeContent,
        categories: reqCategories && {
          set:
            reqCategories.length > 0
              ? reqCategories.map((id: string) => ({ id }))
              : [],
        },
        tags: reqTags && {
          set: reqTags.length > 0 ? reqTags.map((id: string) => ({ id })) : [],
        },
      },
      include: {
        files: true,
      },
    })

    if (reqFiles.length > 0 && reqFiles.every((file) => file instanceof File)) {
      const filesByCloud = await Promise.all(
        reqFiles.map(async (file) => {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const newFile = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: `foro/post/${postUpdated.id}`,
                  resource_type: 'auto',
                },
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
          return newFile
        })
      )
      const validUrls = filesByCloud.filter(
        (url) => url !== null
      ) as UploadApiResponse[]

      await prisma.file.createMany({
        data: validUrls.map(({ resource_type, secure_url, public_id }) => ({
          type: resource_type,
          src: secure_url,
          postId: id as string,
          publicId: public_id,
        })),
      })
    }

    return NextResponse.json(postUpdated)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
