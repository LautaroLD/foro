'use client'
import { Trends } from '@/models/tags.model'
import api from '@/services/config'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'

export default function TagsTrends({ isMobile }: { isMobile?: boolean }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tags-trends'],
    queryFn: async () => {
      const res = await api.get('/api/tags/trends')
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

  return (
    <aside
      className={`col-span-1 text-white ${
        !isMobile && 'h-[calc(100vh-56px)]'
      }  overflow-hidden  py-3 px-2 flex flex-col space-y-2`}
    >
      <b className={`text-xl ${isMobile ? 'text-start' : 'text-center'}`}>
        Tendencias
      </b>
      <ul
        className={` text-center  w-full   ${
          isMobile
            ? 'flex gap-2 space-y-0 overflow-x-auto p-2 mx-0'
            : 'max-w-sm mx-auto space-y-2 max-h-[calc(100vh-76px)] overflow-y-scroll pb-5'
        }`}
      >
        {data?.map((tagTrend: Trends) => (
          <li key={tagTrend.id} className=' items-center flex w-full flex-col'>
            <Link
              className={` w-full text-base font-semibold text-wrap hover:bg-slate-700 transition-all rounded-lg ${
                isMobile && 'w-max p-1'
              }`}
              href={`/tags/${tagTrend.name}`}
            >
              {tagTrend.name}
              <p className='text-sm text-slate-500'>{tagTrend.posts} posts</p>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
