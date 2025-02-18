'use client'
import api from '@/services/config'
import { Post } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React from 'react'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { toast } from 'react-toastify'

export default function LikeButtonPost({
  post,
}: {
  post: Post & { likes: { id: string }[] }
}) {
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient()
  const handleLike = useMutation({
    mutationFn: () => {
      if (user === undefined) {
        toast.error('Debes iniciar sesión para dar like')
        return Promise.reject()
      } else {
        return api.patch(`/api/posts/likes`, {
          userId: user?.id,
          postId: post.id,
        })
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['post'] })
    },
  })
  return (
    <button
      className='flex gap-1 items-center'
      onClick={() => handleLike.mutate()}
    >
      {post.likes.some((like) => like.id === user?.id) ? (
        <BiSolidLike />
      ) : (
        <BiLike />
      )}
      {post.likes.length}
    </button>
  )
}
