'use client'
import PostsList from '@/components/PostsList'
import { Dropdown } from 'primereact/dropdown'
import { useState } from 'react'

export default function HomePage() {
  const [orderList, setOrderList] = useState('recent=desc')

  return (
    <div className='flex flex-col p-4 gap-4 '>
      <PostsList orderList={orderList} urlFetch={`/api/posts`}>
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
      </PostsList>
    </div>
  )
}
