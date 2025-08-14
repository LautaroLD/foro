'use client'
import { Topic } from '@/models/topics.model'
import api from '@/services/config'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import NewTopicsModal from './NewTopicsModal'
import Button from './Button'
import { useQuery } from '@tanstack/react-query'

export default function TopicsSection() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const user = session?.user

  const {
    data,
    isLoading,
    isError,
    isRefetching,
    refetch: refetchTopics,
  } = useQuery({
    queryKey: ['topics', user?.id],
    queryFn: async () => {
      const res = await api.get(`/api/topics/${user?.id}`)
      return res.data
    },
    enabled: !!user?.id,
  })

  return (
    <section
      className={`w-full text-white overflow-hidden   flex flex-col space-y-2`}
    >
      <b className={`text-xl px-6 mt-3`}>Mis temas favoritos</b>
      <Button
        onClick={() => setIsOpen(true)}
        className='p-1 font-normal ml-6 text-sm'
      >
        Editar temas de tu interés
      </Button>
      {(status !== 'authenticated' || isError) && null}
      {(status === 'loading' || isLoading || isRefetching) && (
        <section className=' text-white  space-y-2 p-6 '>
          <div className='p-8 w-full bg-slate-600 animate-pulse rounded-lg'></div>
          <div className='p-8 w-full bg-slate-600 animate-pulse rounded-lg'></div>
          <div className='p-8 w-full bg-slate-600 animate-pulse rounded-lg'></div>
          <div className='p-8 w-full bg-slate-600 animate-pulse rounded-lg'></div>
          <div className='p-8 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        </section>
      )}
      {status === 'authenticated' &&
        !isLoading &&
        !isRefetching &&
        !isError &&
        data && (
          <ul
            className={`w-full flex flex-col  overflow-y-scroll gap-3 divide-y divide-gray-600 border-t border-b border-gray-600 `}
          >
            {data?.topics.length === 0 && (
              <div className='w-full h-full flex items-center justify-center'>
                <p className='text-gray-400'>No tienes temas favoritos</p>
              </div>
            )}
            {data.topics.map((topic: Topic) => (
              <li key={topic.id} className=' flex w-full h-full  flex-col px-6'>
                <Link
                  className='w-full h-full py-2 px-1'
                  href={`/${topic.type === 'tag' ? 'tags' : 'categories'}/${
                    topic.slug
                  }`}
                >
                  <b>{topic.name}</b>
                  <p className='text-sm text-gray-400'>{topic.posts} posts</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

      {isOpen && (
        <NewTopicsModal
          setIsOpen={setIsOpen}
          refetchTopics={refetchTopics}
          userId={user?.id as string}
          defaultTopics={data.topics}
        />
      )}
    </section>
  )
}
