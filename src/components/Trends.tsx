'use client'
import { Trends } from '@/models/trend.model'
import api from '@/services/config'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
import Button from './Button'

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
      className={`w-full text-white overflow-hidden  py-3 px-2 flex flex-col space-y-2`}
    >
      <b className={`text-xl `}>Tendencias</b>
      <ul
        className={`w-full grid grid-cols-2  md:grid-cols-4  overflow-y-scroll gap-3`}
      >
        {data?.map((trend: Trends) => (
          <li
            key={trend.id}
            className=' items-center flex w-full h-full  flex-col'
          >
            <Button
              buttonProps={{
                className: 'hover:bg-[#b94d25] transition-all h-full',
              }}
            >
              <Link
                className='w-full h-full py-2 px-1'
                href={`/trends/${trend.type}/${trend.name}`}
              >
                <b>{trend.name}</b>
                <p>{trend.posts} posts</p>
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
