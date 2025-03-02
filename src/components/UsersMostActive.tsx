'use client'
import useWindowSize from '@/hooks/useWindowSize'
import { UserExtended } from '@/models/user.model'
import api from '@/services/config'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Avatar } from 'primereact/avatar'
import React from 'react'

export default function UsersMostActive() {
  const screenWidth = useWindowSize()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users-most-active'],
    queryFn: async () => {
      const res = await api.get('/api/users/most-active')
      return res.data
    },
  })
  if (isLoading)
    return (
      <aside className='col-span-1 text-white  space-y-2 px-2 py-4 hidden md:block'>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
      </aside>
    )
  if (isError) return <div>Error loading users</div>
  if (screenWidth.width && screenWidth.width < 768) return null
  return (
    <aside className='col-span-1 text-white text-center py-3 px-2 space-y-3 overflow-y-scroll hidden md:block'>
      <b>Usuarios mas activos</b>
      <ul className=' space-y-2'>
        {data?.map((user: UserExtended, i: number) => (
          <Link
            href={`/user/${user.id}`}
            className='p-2 border rounded-lg relative overflow-hidden flex flex-col gap-1 hover:bg-slate-600 transition-all cursor-pointer'
            key={user.id}
          >
            <Avatar
              label={`${user.firstName[0]}${user.lastName[0]}`}
              shape='circle'
              className='m-auto'
            />
            <b className='text-sm font-bold'>
              {user.firstName} {user.lastName}
            </b>
            <p className='text-xs'>posts: {user.posts.length}</p>
            <p className='text-xs'>
              Usuario desde: {new Date(user.createdAt).toLocaleDateString()}{' '}
            </p>
            {i < 3 && (
              <div
                className={`absolute top-0 left-0 w-3  h-full ${
                  i === 0 && 'bg-yellow-300'
                } ${i === 1 && 'bg-slate-400'}
                ${i === 2 && 'bg-yellow-600'}`}
              ></div>
            )}
          </Link>
        ))}
      </ul>
    </aside>
  )
}
