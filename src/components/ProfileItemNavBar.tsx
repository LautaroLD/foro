'use client'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

export default function ProfileItemNavBar({ userId }: { userId: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await api.get(`/api/users/${userId}`)
      return res.data
    },
  })
  if (isLoading) {
    return (
      <div className='p-9 w-full bg-slate-600 animate-pulse rounded-lg'></div>
    )
  }
  return (
    <Link
      href={'/profile'}
      className='border border-slate-600  p-2 rounded-lg hover:bg-[#b94d25] flex items-center gap-2'
    >
      <div className='flex gap-2 items-center '>
        <span className='relative w-14 h-14 rounded-full overflow-hidden'>
          {user?.image ? (
            <Image
              fill
              className='rounded-full border-slate-500 border'
              src={user?.image as string}
              alt={`${user?.firstName} ${user?.lastName}`}
            />
          ) : (
            <FaUserCircle className='w-full h-full' />
          )}
        </span>
        <div>
          <b>
            {user?.firstName} {user?.lastName}
          </b>
          <p>{user?.email}</p>
        </div>
      </div>
    </Link>
  )
}
