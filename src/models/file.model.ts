import { Post } from '@prisma/client'

export interface PostFile {
  id: string
  type: string
  src: string
  postId: string
  post?: Post
  publicId: string
}
