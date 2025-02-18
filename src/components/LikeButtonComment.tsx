'use client'
import { CommentExtended } from '@/models/Comment.model'
import api from '@/services/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React from 'react'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { toast } from 'react-toastify'

export default function LikeButtonComment({
  comment,
}: {
  comment: CommentExtended
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
        return api.patch(`/api/comments/likes`, {
          userId: user?.id,
          commentId: comment.id,
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
      {comment.likes.some((like) => like.id === user?.id) ? (
        <BiSolidLike />
      ) : (
        <BiLike />
      )}
      {comment.likes.length}
    </button>
  )
}
