import { Category, Post, Tag, User, File } from '@prisma/client'
import { CommentExtended } from './Comment.model'

export interface PostExtended extends Post {
  categories: Category[]
  tags: Tag[]
  likes: { id: string }[]
  comments: CommentExtended[]
  author: User
  files: File[]
}
