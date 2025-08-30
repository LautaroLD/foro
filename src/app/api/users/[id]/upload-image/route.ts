import { Params } from '@/models/params'
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import prisma from '@/libs/prisma'
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})
export async function PATCH(request: Request, { params }: Params) {
  const data = await request.formData()
  const file = data?.get('image') as File
  if (!file) {
    return NextResponse.json({ message: 'No image provided', status: 400 })
  }
  try {
    const { id } = await params
    const user = await prisma?.user.findFirst({ where: { id } })
    if (!user) {
      return NextResponse.json({ message: 'User not found', status: 404 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const mimeType = file.type
    const base64 = buffer.toString('base64')
    const dataUri = `data:${mimeType};base64,${base64}`

    const { secure_url: secureUrl } = await cloudinary.uploader.upload(
      dataUri,
      {
        folder: 'foro/user/' + id,
        resource_type: 'image',
        public_id: 'avatar',
      }
    )

    await prisma?.user.update({
      where: { id },
      data: { image: secureUrl },
    })
    return NextResponse.json({ message: 'Image uploaded successfully' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message, status: 500 })
    }
  }
}
