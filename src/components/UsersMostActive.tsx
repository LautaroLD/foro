'use client'
import { UserExtended } from '@/models/user.model'
import api from '@/services/config'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Avatar } from 'primereact/avatar'
import React from 'react'

export default function UsersMostActive({ isMobile }: { isMobile?: boolean }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users-most-active'],
    queryFn: async () => {
      const res = await api.get('/api/users/most-active')
      return res.data
    },
  })
  if (isLoading)
    return (
      <aside className='col-span-1 text-white  space-y-2 px-2 py-4 '>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
      </aside>
    )
  if (isError) return <div>Error loading users</div>
  return (
    <aside className={`col-span-1 text-white  py-3 px-2 flex flex-col `}>
      <b className={`${isMobile ? 'text-start' : 'text-center'}`}>
        Usuarios mas activos
      </b>
      <ul
        className={`space-y-2 text-center ${
          isMobile ? 'flex gap-2 w-auto space-y-0 overflow-x-auto p-2' : ''
        }`}
      >
        {data?.map((user: UserExtended, i: number) => (
          <Link
            href={`/user/${user.id}`}
            className='py-2 px-4 min-w-[130px] border rounded-lg relative overflow-hidden flex flex-col gap-1 hover:opacity-50 transition-all cursor-pointer'
            key={user.id}
          >
            {i < 3 && (
              <div
                className={`absolute top-0 left-0 w-full  h-1/3 -z-10 ${
                  i === 0 && 'bg-yellow-300'
                } ${i === 1 && 'bg-slate-400'}
                ${i === 2 && 'bg-yellow-600'}`}
              ></div>
            )}
            <Avatar
              label={`${user.firstName[0]}${user.lastName[0]}`}
              shape='circle'
              className='m-auto '
            />
            <b className='text-sm font-bold'>
              {user.firstName} {user.lastName}
            </b>
            <p className='text-xs'>posts: {user.posts.length}</p>
          </Link>
        ))}
      </ul>
    </aside>
  )
}
