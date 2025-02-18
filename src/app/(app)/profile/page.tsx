'use client'
import PostsList from '@/components/PostsList'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Avatar } from 'primereact/avatar'
import React from 'react'
import { IoSettingsOutline } from 'react-icons/io5'

export default function Page() {
  const { data: session } = useSession()
  const user = session?.user
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      const { data: res } = await api.get(`/api/users/${user?.id}`)
      return res
    },
  })
  if (isLoading) return <div className='text-white col-span-3'>Loading...</div>
  if (isError) return <div>Error loading user</div>

  return (
    <article className='pb-4'>
      <div className='grid  grid-flow-col w-fit gap-3 m-4'>
        <div className='w-fit ml-auto'>
          <Avatar
            label={`${userData.firstName[0]}${userData.lastName[0]}`}
            shape='circle'
            size='large'
          />
        </div>
        <div>
          <h1 className='text-3xl font-bold'>
            {userData?.firstName} {userData?.lastName}
          </h1>
          <p>{userData?.email}</p>
          Usuario desde: {new Date(
            userData.createdAt
          ).toLocaleDateString()}{' '}
        </div>
        <Link
          href={'/profile/settings'}
          className='my-auto w-fit hover:bg-white hover:text-black transition-all p-1 rounded-lg'
        >
          <IoSettingsOutline size={30} />
        </Link>
      </div>
      <div>
        <h2 className='text-xl  font-bold m-4'>
          Mis Posts ({userData?.posts?.length})
        </h2>
        <div className='p-4'>
          {userData?.posts?.length === 0 ? (
            <div className='flex  flex-col'>
              <p className=' text-center mb-3'>
                No tienes ningún post... todavía ;){' '}
              </p>
              <Link
                href='/create-post'
                className=' text-center font-bold border rounded-lg w-fit m-auto  p-2 hover:bg-white hover:text-black transition-all'
              >
                Crea uno ahora!
              </Link>
            </div>
          ) : (
            <PostsList posts={userData?.posts ?? []} />
          )}
        </div>
      </div>
    </article>
  )
}
