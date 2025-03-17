'use client'
import { Trends } from '@/models/tags.model'
import api from '@/services/config'

import { useQuery } from '@tanstack/react-query'
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
      <aside className='col-span-1 text-white  space-y-2 px-2 py-4 '>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg h-32'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg h-32'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg h-32'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg h-32'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg h-32'></div>
      </aside>
    )
  if (isError) return <div>Error loading users</div>
  return (
    <aside
      className={`col-span-1 text-white  py-3 px-2 flex flex-col space-y-2`}
    >
      <b className={`text-xl ${isMobile ? 'text-start' : 'text-center'}`}>
        Tendencias
      </b>
      <ul
        className={` text-center  w-full   ${
          isMobile
            ? 'flex gap-2 space-y-0 overflow-x-auto p-2 mx-0'
            : 'max-w-sm mx-auto space-y-2 max-h-[calc(100vh-76px)] overflow-y-scroll pb-10'
        }`}
      >
        {data?.map((tagTrend: Trends) => (
          <li key={tagTrend.id} className=' items-center flex flex-col'>
            <p className='text-base font-semibold w-max'>{tagTrend.name}</p>
            <p className='text-sm text-slate-500'>{tagTrend.posts} posts</p>
          </li>
        ))}
      </ul>
    </aside>
  )
}
