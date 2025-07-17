'use client'
import PostsList from '@/components/PostsList'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'

import { useParams } from 'next/navigation'
import { Dropdown } from 'primereact/dropdown'
import React, { useState } from 'react'

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.categorySlug

  const [orderList, setOrderList] = useState('recent=desc')
  const {
    data: title,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: async () => {
      const res = await api.get(`/api/categories/${categorySlug}/name`)
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
      <PostsList
        urlFetch={`/api/categories/${categorySlug}`}
        orderList={orderList}
      />
    </article>
  )
}
