import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

prisma.$use(async (params, next) => {
  const modelsWithSlug = ['Tag', 'Category']
  const actionsWithSlug = ['create', 'update']

  if (
    modelsWithSlug.includes(params.model as string) &&
    actionsWithSlug.includes(params.action)
  ) {
    const data = params.args.data as { name?: string; slug?: string }
    if (typeof data.name === 'string') {
      data.slug = slugify(data.name, {
        lower: true,
        strict: true,
      })
    }
  }

  return next(params)
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
