import { Tag } from '@prisma/client'

export interface Trends extends Tag {
  posts: number
}
