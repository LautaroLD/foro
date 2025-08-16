import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const reqFiles = await request.json()
  await prisma.file.createMany({
    data: reqFiles.map(
      ({
        resource_type,
        secure_url,
        public_id,
        postId,
      }: {
        resource_type: string
        secure_url: string
        public_id: string
        postId: string
      }) => ({
        type: resource_type,
        src: secure_url,
        postId: postId,
        publicId: public_id,
      })
    ),
  })

  return NextResponse.json({ message: 'Files saved' })
}
