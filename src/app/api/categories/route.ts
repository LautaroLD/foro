import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import slugify from 'slugify'
export async function GET() {
  try {
    const categories = await prisma?.category.findMany()
    return NextResponse.json(categories)
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
      const newCategories = await Promise.all(
        data.map(async (category) => {
          const newCategory = await prisma.category.create({
            data: {
              name: category,
              slug: slugify(category, { lower: true, strict: true }),
            },
          })
          return newCategory
        })
      )
      return NextResponse.json(newCategories)
    } else {
      const newCategory = await prisma.category.create({
        data: {
          name: data.name,
          slug: slugify(data.name, { lower: true, strict: true }),
        },
      })
      return NextResponse.json(newCategory)
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
