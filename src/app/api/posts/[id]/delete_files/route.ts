import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import { v2 as cloudinary } from 'cloudinary'

export async function PATCH(request: Request) {
  const data = await request.json()
  try {
    data.forEach(async (file: { publicId: string; id: string }) => {
      await cloudinary.uploader.destroy(file.publicId)
      await prisma.file.delete({
        where: { id: file.id },
      })
    })
    return NextResponse.json({ message: 'Images deleted successfully' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      })
    }
  }
}
