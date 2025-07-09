'use client'
import PostsList from '@/components/PostsList'

import { useParams } from 'next/navigation'
import { Dropdown } from 'primereact/dropdown'
import React, { useState } from 'react'

export default function TagPage() {
  const params = useParams()
  const tagName = params.tagName
  const [orderList, setOrderList] = useState('recent=desc')

  return (
    <article>
      <div className='flex justify-between items-center px-6 py-4'>
        <h1 className='text-2xl font-bold '>
          {decodeURIComponent(tagName as string)}
        </h1>
        <Dropdown
          className='w-fit  text-xs'
          value={orderList}
          onChange={(e) => setOrderList(e.value)}
          options={[
            { label: 'Mas recientes', value: 'recent=desc' },
            { label: 'Mas antiguos', value: 'recent=asc' },
            { label: 'Mas populares', value: 'likes=desc' },
            { label: 'Menos populares', value: 'likes=asc' },
          ]}
        />
      </div>
      <PostsList urlFetch={`/api/tags/${tagName}`} orderList={orderList} />
    </article>
  )
}
