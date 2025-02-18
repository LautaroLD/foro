import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Params } from '@/models/params'

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const category = await prisma?.category.findFirst({
      where: {
        id,
      },
    })
    if (!category) {
      return NextResponse.json({ error: true, message: 'category not found' })
    }
    return NextResponse.json(category)
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
    const category = await prisma?.category.delete({
      where: {
        id,
      },
    })
    if (!category) {
      return NextResponse.json({ error: true, message: 'category not found' })
    }
    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const data = await request.json()
    const category = await prisma?.category.update({
      where: {
        id,
      },
      data,
    })
    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
