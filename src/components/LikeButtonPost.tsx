'use client'
import api from '@/services/config'
import { Post } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { LuLoader } from 'react-icons/lu'
import { toast } from 'react-toastify'

export default function LikeButtonPost({
  post,
}: {
  post: Post & { likes: { id: string }[] }
}) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient()
  const handleLike = useMutation({
    mutationFn: () => {
      setLoading(true)
      if (user === undefined) {
        toast.error('Debes iniciar sesión para dar like')
        return Promise.reject()
      } else {
        return api.patch(`/api/posts/likes`, {
          userId: user?.id,
          postId: post.id,
          hasLike: post.likes.some((like) => like.id === user?.id),
        })
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['post'] }).finally(() => {
        setLoading(false)
      })
    },
  })
  return (
    <button
      disabled={loading}
      className='flex gap-1 items-center'
      onClick={() => handleLike.mutate()}
    >
      {loading ? (
        <LuLoader className='animate-spin' />
      ) : post.likes.some((like) => like.id === user?.id) ? (
        <BiSolidLike />
      ) : (
        <BiLike />
      )}
      {post.likes.length}
    </button>
  )
}
