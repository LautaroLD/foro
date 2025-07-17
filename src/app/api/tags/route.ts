import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import slugify from 'slugify'
export async function GET() {
  try {
    const tags = await prisma?.tag.findMany()
    return NextResponse.json(tags)
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
    const data = await request.json()
    if (Array.isArray(data)) {
      const newTags = await Promise.all(
        data.map(async (tag) => {
          const newTag = await prisma.tag.create({
            data: {
              name: tag,
              slug: slugify(tag, { lower: true, strict: true }),
            },
          })
          return newTag
        })
      )
      return NextResponse.json(newTags)
    } else {
      const newTag = await prisma.tag.create({
        data: {
          name: data.name,
          slug: slugify(data.name, { lower: true, strict: true }),
        },
      })
      return NextResponse.json(newTag)
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
