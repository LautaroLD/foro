import ai from '@/services/gemini'
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const categories =
      data.categories.length > 0
        ? await prisma?.category.findMany({
            where: {
              id: { in: data.categories },
            },
            select: {
              name: true,
            },
          })
        : []
    const tags =
      data.tags.length > 0
        ? await prisma?.tag.findMany({
            where: {
              id: { in: data.tags },
            },
            select: {
              name: true,
            },
          })
        : []
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Debes escribir el contenido de un post de blog donde el titulo es este: ${data.title}.`,
      config: {
        systemInstruction: `debes usar etiquetas html, no usar markdown. Responde solo con el contenido del post, sin ningún tipo de metadatos ni información adicional, ni vuelvas a escribir el titulo. el texto debe ser lo mas natural posible, no debe parecer que fue escrito por una IA.
      ${
        categories?.length &&
        'tiene en cuenta las siguientes categorías para la redacción: ' +
          categories
      }
        ${
          tags?.length &&
          'tiene en cuentas las siguientes etiquetas para la redacción: ' + tags
        }
      `,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    })
    return NextResponse.json(res.text)
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Error generating content' },
      { status: 500 }
    )
  }
}
