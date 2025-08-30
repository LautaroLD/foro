import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newComment = await prisma.comment.create({
      data,
    })
    return NextResponse.json(newComment)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
