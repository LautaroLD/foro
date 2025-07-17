'use client'
import PostsList from '@/components/PostsList'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Dropdown } from 'primereact/dropdown'
import React, { useState } from 'react'

export default function TagPage() {
  const params = useParams()
  const tagSlug = params.tagSlug
  const [orderList, setOrderList] = useState('recent=desc')
  const {
    data: title,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tag', tagSlug],
    queryFn: async () => {
      const res = await api.get(`/api/tags/${tagSlug}/name`)
      return res.data
    },
  })
  return (
    <article>
      <div className='flex justify-between items-center px-6 py-4'>
        {!isLoading && !isError && (
          <h1 className='text-2xl font-bold'>{title}</h1>
        )}
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
      <PostsList urlFetch={`/api/tags/${tagSlug}`} orderList={orderList} />
    </article>
  )
}
