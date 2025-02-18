import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
export async function GET() {
  try {
    const categories = await prisma?.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      });
    }
  }
}
export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (Array.isArray(data)) {
      const newCategories = await Promise.all(
        data.map(async (category) => {
          const newCategory = await prisma.category.create({
            data: {
              name: category,
            },
          });
          return newCategory;
        })
      );
      return NextResponse.json(newCategories);
    } else {
      const newCategory = await prisma.category.create({
        data,
      });
      return NextResponse.json(newCategory);
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: error.message,
        status: 500,
      });
    }
  }
}
