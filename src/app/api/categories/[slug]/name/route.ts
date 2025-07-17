import { Params } from '@/models/params'
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = await params
    const category = await prisma?.category.findFirst({
      where: {
        slug,
      },
      select: {
        name: true,
      },
    })
    if (!category) {
      return NextResponse.json({ error: true, message: 'category not found' })
    }
    return NextResponse.json(category.name)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
