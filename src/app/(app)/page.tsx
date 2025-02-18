'use client'
import PostsList from '@/components/PostsList'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import { Dropdown } from 'primereact/dropdown'
import { useState } from 'react'

export default function HomePage() {
  const [orderList, setOrderList] = useState('recent=desc')
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['post', 'posts', orderList],
    queryFn: async () => {
      const res = await api.get(`/api/posts?${orderList}`)
      return res.data
    },
  })
  if (isLoading)
    return (
      <div className=' flex flex-col gap-6 p-6  mx-auto h-full animate-pulse'>
        <div className='bg-slate-600 rounded-lg  w-full h-48'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48'></div>
      </div>
    )
  if (isError) return <div>Error loading posts</div>

  return (
    <div className='flex flex-col p-4 gap-4 '>
      <Dropdown
        className=' w-full md:w-fit'
        value={orderList}
        onChange={(e) => setOrderList(e.value)}
        options={[
          { label: 'Mas recientes', value: 'recent=desc' },
          { label: 'Mas antiguos', value: 'recent=asc' },
          { label: 'Mas populares', value: 'likes=desc' },
          { label: 'Menos populares', value: 'likes=asc' },
        ]}
      />
      <PostsList posts={posts} />
    </div>
  )
}
