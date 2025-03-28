'use client'
import { CommentExtended } from '@/models/Comment.model'
import api from '@/services/config'
import { LikeComment } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React from 'react'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { LuLoader } from 'react-icons/lu'
import { toast } from 'react-toastify'

export default function LikeButtonComment({
  comment,
}: {
  comment: CommentExtended
}) {
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient()

  const {
    data: likes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['comment_likes', comment.id],
    queryFn: async () => {
      const { data } = await api.get<{ likes: LikeComment[] }>(
        '/api/comments/likes',
        {
          params: { commentId: comment.id },
        }
      )

      return data.likes
    },
  })

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
      queryClient.invalidateQueries({ queryKey: ['comment_likes', comment.id] })
    },
  })
  if (isError) return

  if (!likes) return
  if (isLoading) return <LuLoader className='animate-spin' />

  return (
    <button
      className='flex gap-1 items-center'
      onClick={() => handleLike.mutate()}
    >
      {handleLike.isPending ? (
        <LuLoader className='animate-spin' />
      ) : likes.some(
          (like) => like.userId === user?.id && like.commentId === comment?.id
        ) ? (
        <BiSolidLike />
      ) : (
        <BiLike />
      )}
      {likes.length}
    </button>
  )
}
