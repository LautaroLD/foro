import { Params } from '@/models/params'
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = await params
    const tag = await prisma?.tag.findFirst({
      where: {
        slug,
      },
      select: {
        name: true,
      },
    })
    if (!tag) {
      return NextResponse.json({ error: true, message: 'tag not found' })
    }
    return NextResponse.json(tag.name)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
