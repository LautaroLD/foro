'use client'
import api from '@/services/config'
import { LikePost, Post } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { LuCircleAlert, LuLoader } from 'react-icons/lu'
import { toast } from 'react-toastify'

export default function LikeButtonPost({
  post,
}: {
  post: Post & { likes: { id: string }[] }
}) {
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient()

  const {
    data: likes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['post_likes', post.id],
    queryFn: async () => {
      const { data } = await api.get<{ likes: LikePost[] }>(
        '/api/posts/likes',
        {
          params: { postId: post.id },
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
        return api.patch(`/api/posts/likes`, {
          userId: user?.id,
          postId: post.id,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post_likes', post.id] })
    },
  })
  if (isError) {
    return <LuCircleAlert />
  }

  if (isLoading) return <LuLoader className='animate-spin' />

  return (
    <button
      disabled={isLoading}
      className='flex gap-1 items-center hover:bg-slate-500 p-1 rounded-lg '
      onClick={() => handleLike.mutate()}
    >
      {handleLike.isPending ? (
        <LuLoader className='animate-spin' />
      ) : likes?.some(
          (like) => like.userId === user?.id && like.postId === post?.id
        ) ? (
        <BiSolidLike />
      ) : (
        <BiLike />
      )}
      {likes?.length}
    </button>
  )
}
