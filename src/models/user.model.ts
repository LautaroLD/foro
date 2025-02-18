import { User } from '@prisma/client'
import { CommentExtended } from './Comment.model'
import { PostExtended } from './post.model'
import { Tag } from 'primereact/tag'

export interface UserExtended extends User {
  posts: PostExtended[]
  comments: CommentExtended[]
  likePosts: PostExtended[]
  likeComments: CommentExtended[]
  Tags: Tag[]
}
