import { Account, User, UserFollow } from '@prisma/client'
import { CommentExtended } from './Comment.model'
import { PostExtended } from './post.model'
import { Tag } from 'primereact/tag'
import { Session } from 'inspector/promises'

export interface UserExtended extends User {
  posts: PostExtended[]
  comments: CommentExtended[]
  likePosts: PostExtended[]
  likeComments: CommentExtended[]
  Tags: Tag[]
  accounts: Account[]
  sessions: Session[]
  followers: UserFollow[]
  following: UserFollow[]
}
