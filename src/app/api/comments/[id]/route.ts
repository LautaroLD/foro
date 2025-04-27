import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Params } from '@/models/params'

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const comment = await prisma?.comment.findFirst({
      where: {
        id,
      },
      include: {
        author: true,
      },
    })
    if (!comment) {
      return NextResponse.json({ error: true, message: 'comment not found' })
    }
    return NextResponse.json(comment)
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
    const comment = await prisma?.comment.delete({
      where: {
        id,
      },
    })
    if (!comment) {
      return NextResponse.json({ error: true, message: 'comment not found' })
    }
    return NextResponse.json({ message: 'comment deleted' })
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
    const data = await request.json()
    const comment = await prisma?.comment.update({
      where: {
        id,
      },
      data,
    })
    return NextResponse.json(comment)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
