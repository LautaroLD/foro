'use client'
import React, { useEffect } from 'react'
import PostItem from './PostItem'
import { PostExtended } from '@/models/post.model'
import { LuLoader } from 'react-icons/lu'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import api from '@/services/config'

export default function PostsList({
  orderList,
  urlFetch,
  children,
}: {
  orderList?: string
  urlFetch: string
  children?: React.ReactNode
}) {
  const { ref, inView } = useInView()
  const {
    isLoading,
    data,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', orderList, urlFetch],
    queryFn: async ({ pageParam }) => {
      const res = await api.get(
        `${urlFetch}${
          orderList ? `?${orderList}&page=${pageParam}` : `?page=${pageParam}`
        }   `
      )
      return res.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 0 ? null : allPages.length + 1
    },
  })
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])
  if (isLoading) {
    return (
      <div className='flex flex-col gap-3 p-3'>
        <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
        <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
      </div>
    )
  }
  if (isError) return <div>Error loading posts</div>

  return (
    <>
      {children}
      {data?.pages.map((page, i) => (
        <ul
          key={i + '-page'}
          className='list-none flex flex-col   w-full h-full divide-y divide-slate-600 border-t border-t-slate-600'
          // className='list-none flex flex-col gap-6  w-full h-full overflow-y-scroll '
        >
          {page.map((post: PostExtended) => (
            <PostItem key={post.id} post={post} />
          ))}
        </ul>
      ))}
      {hasNextPage && (
        <span ref={ref} className='pb-4 '>
          {isFetchingNextPage && (
            <LuLoader className='animate-spin m-auto' size={30} />
          )}
        </span>
      )}
    </>
  )
}
