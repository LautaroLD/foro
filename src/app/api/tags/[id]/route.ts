import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { Params } from '@/models/params'

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const tag = await prisma?.tag.findFirst({
      where: {
        id,
      },
    })
    if (!tag) {
      return NextResponse.json({ error: true, message: 'tag not found' })
    }
    return NextResponse.json(tag)
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
    const tag = await prisma?.tag.delete({
      where: {
        id,
      },
    })
    if (!tag) {
      return NextResponse.json({ error: true, message: 'tag not found' })
    }
    return NextResponse.json(tag)
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
    const tag = await prisma?.tag.update({
      where: {
        id,
      },
      data,
    })
    return NextResponse.json(tag)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
