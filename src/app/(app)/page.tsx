'use client'
import PostsList from '@/components/PostsList'
import TagsTrends from '@/components/TagsTrends'
import useWindowSize from '@/hooks/useWindowSize'
import { Dropdown } from 'primereact/dropdown'
import { useState } from 'react'

export default function HomePage() {
  const [orderList, setOrderList] = useState('recent=desc')
  const { width } = useWindowSize()
  return (
    <div className='flex flex-col  '>
      <PostsList orderList={orderList} urlFetch={`/api/posts`}>
        <Dropdown
          className='w-fit m-3 text-xs'
          value={orderList}
          onChange={(e) => setOrderList(e.value)}
          options={[
            { label: 'Mas recientes', value: 'recent=desc' },
            { label: 'Mas antiguos', value: 'recent=asc' },
            { label: 'Mas populares', value: 'likes=desc' },
            { label: 'Menos populares', value: 'likes=asc' },
          ]}
        />
        {width && width < 768 && <TagsTrends isMobile />}
      </PostsList>
    </div>
  )
}
