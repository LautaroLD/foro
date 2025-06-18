'use client'
import { PostExtended } from '@/models/post.model'
import api from '@/services/config'
import { LikePost } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { BiLike, BiSolidLike } from 'react-icons/bi'
import { LuCircleAlert } from 'react-icons/lu'
import { toast } from 'react-toastify'

export default function LikeButtonPost({ post }: { post: PostExtended }) {
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient()

  const {
    data: likes,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['post_likes', post.id],
    enabled: !!post?.id,
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

  if (isFetching) return <BiSolidLike className='m-2' />

  return (
    <button
      disabled={isFetching}
      className='flex gap-1 items-center  p-1'
      onClick={() => handleLike.mutate()}
    >
      {handleLike.isPending ? (
        <BiSolidLike color='#b94d25' />
      ) : likes?.some(
          (like) => like.userId === user?.id && like.postId === post?.id
        ) ? (
        <BiSolidLike color='#b94d25' />
      ) : (
        <BiLike />
      )}
      {likes?.length}
    </button>
  )
}
