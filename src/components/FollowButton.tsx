import React from 'react'
import Button from './Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/config'
import { UserFollow } from '@prisma/client'
import { useSession } from 'next-auth/react'

export default function FollowButton({
  followingId,
  followers,
  following,
}: {
  followingId: string
  followers: UserFollow[]
  following: UserFollow[]
}) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const queryClient = useQueryClient()
  const followUser = useMutation({
    mutationFn: async () => {
      await api.post('/api/follow', { followingId })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [followingId] })
    },
  })
  const isFollowing = followers.some(
    (follower) => follower.followerId === userId
  )
  const isFollowed = following.some(
    (follower) => follower.followingId === userId
  )
  if (followingId === userId) {
    return null
  }
  return (
    <>
      <Button
        onClick={() => {
          followUser.mutate()
        }}
        primary={!isFollowing}
        size='sm'
        loading={followUser.isPending}
      >
        <span className='flex items-center text-sm'>
          {isFollowing ? <>Siguiendo</> : <>Seguir</>}
        </span>
      </Button>
      {isFollowed && <p className='text-sm text-gray-400'>Te sigue</p>}
    </>
  )
}
