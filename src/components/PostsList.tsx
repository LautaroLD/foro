'use client'
import React from 'react'
import PostItem from './PostItem'
import { PostExtended } from '@/models/post.model'

export default function PostsList({ posts }: { posts: PostExtended[] }) {
  return (
    <ul className='list-none flex flex-col gap-6  w-full h-full overflow-y-scroll '>
      {posts.map((post: PostExtended) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  )
}
