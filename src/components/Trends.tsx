'use client'
import { Trends } from '@/models/trend.model'
import api from '@/services/config'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'

export default function TrendsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['trends'],
    queryFn: async () => {
      const res = await api.get('/api/trends')
      return res.data
    },
  })
  if (isLoading)
    return (
      <section className=' text-white  space-y-2 px-2 py-4 '>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
      </section>
    )
  if (isError) return <div>Error loading users</div>

  return (
    <section
      className={`w-full text-white overflow-hidden   flex flex-col space-y-2`}
    >
      <b className={`text-xl p-6`}>Tendencias de la semana</b>
      <ul
        className={`w-full flex flex-col  overflow-y-scroll gap-3 divide-y divide-gray-600 border-t border-b border-gray-600 `}
      >
        {data?.map((trend: Trends) => (
          <li key={trend.id} className=' flex w-full h-full  flex-col px-6'>
            <Link
              className='w-full h-full py-2 px-1'
              href={`/${trend.type === 'tag' ? 'tags' : 'categories'}/${
                trend.name
              }`}
            >
              <b>{trend.name}</b>
              <p className='text-sm text-gray-400'>{trend.posts} posts</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
