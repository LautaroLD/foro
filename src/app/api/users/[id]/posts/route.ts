import { Params } from '@/models/params'
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(request: Request, { params }: Params) {
  const { id } = await params
  const { searchParams } = new URL(request.url)

  const posts = await prisma?.post.findMany({
    where: {
      authorId: id,
    },
    include: {
      author: true,
      categories: true,
      tags: true,
      files: true,
      comments: true,
      likes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },

    skip: searchParams.get('page')
      ? (parseInt(searchParams.get('page') as string) - 1) * 10
      : 0,
    take: 10,
  })
  if (!posts) {
    return NextResponse.json({ error: true, message: 'posts not found' })
  }
  return NextResponse.json(posts)
}
