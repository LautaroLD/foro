'use client'
import PostsList from '@/components/PostsList'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Avatar } from 'primereact/avatar'
import React from 'react'

export default function Page() {
  const { userId } = useParams()

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [userId],
    queryFn: async () => {
      const { data: res } = await api.get(`/api/users/${userId}`)
      return res
    },
  })
  if (isLoading)
    return (
      <div className='col-span-1 text-white  space-y-2 m-6'>
        <div className='p-8 w-2/3 bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-10 w-1/2 bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='flex flex-col gap-3 p-3'>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
        </div>
      </div>
    )
  if (isError) return <div>Error loading user</div>

  return (
    <article>
      <div className='grid  grid-flow-col w-fit gap-3 m-4'>
        <div className='w-fit ml-auto'>
          <Avatar
            label={`${userData.firstName[0]}${userData.lastName[0]}`}
            shape='circle'
            size='large'
          />
        </div>
        <div>
          <h1 className='text-3xl font-bold'>
            {userData?.firstName} {userData?.lastName}
          </h1>
          <p>{userData?.email}</p>
          Usuario desde: {new Date(
            userData.createdAt
          ).toLocaleDateString()}{' '}
        </div>
      </div>
      <div>
        <h2 className='text-xl  font-bold m-4'>
          Posts ({userData?.posts?.length}){' '}
        </h2>
        <div>
          {userData?.posts?.length === 0 ? (
            <p className='col-span-3 text-center'>Nada por aquí todavía</p>
          ) : (
            <PostsList urlFetch={`/api/users/${userData?.id}/posts`} />
          )}
        </div>
      </div>
    </article>
  )
}
