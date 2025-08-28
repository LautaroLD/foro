'use client'
import Button from '@/components/Button'
import PostsList from '@/components/PostsList'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { IoSettingsSharp } from 'react-icons/io5'

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
  if (isLoading)
    return (
      <div className='col-span-1 text-white  space-y-2 m-6'>
        <div className='p-8 w-2/3 bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-10 w-1/2 bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='flex flex-col gap-3 p-3'>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
          <div className='bg-slate-600 rounded-lg  w-full h-48 animate-pulse'></div>
        </div>
      </div>
    )
  if (isError) return <div>Error loading user</div>

  return (
    <article className='pb-4'>
      <div className='grid  grid-flow-col w-fit gap-3 m-6'>
        <span className='relative w-20 h-20 rounded-full overflow-hidden'>
          {userData?.image ? (
            <Image
              fill
              className='rounded-full border-slate-500 border'
              src={userData?.image as string}
              alt={`${userData?.firstName} ${userData?.lastName}`}
            />
          ) : (
            <FaUserCircle className='w-full h-full' />
          )}
        </span>

        <div>
          <h1 className='text-3xl font-bold flex justify-center align-center gap-2'>
            {userData?.firstName} {userData?.lastName}
            <Link href={'/profile/settings'}>
              <Button size='sm' primary>
                <IoSettingsSharp size={25} />
              </Button>
            </Link>
          </h1>
          <p>{userData?.email}</p>
          <p>
            Usuario desde: {new Date(userData.createdAt).toLocaleDateString()}{' '}
          </p>
        </div>
      </div>
      <div className='flex gap-4 mx-4'>
        <div className='flex flex-col  text-center'>
          <b className='text-sm'>Seguidores</b>
          <b className='text-3xl'>{userData?.followers?.length ?? 0}</b>
        </div>
        <div className='flex flex-col  text-center'>
          <b className='text-sm'>Siguiendo </b>
          <b className='text-3xl'>{userData?.following?.length ?? 0}</b>
        </div>
      </div>
      <div>
        <h2 className='text-xl  font-bold m-6'>
          Mis Posts ({userData?.posts?.length})
        </h2>
        <div className='flex flex-col gap-4 '>
          {userData?.posts?.length === 0 ? (
            <div className='flex  flex-col'>
              <p className=' text-center mb-3'>
                No tienes ningún post... todavía ;){' '}
              </p>
              <Button primary size='sm' className='mx-auto'>
                <Link href='/create-post'>Crea uno ahora!</Link>
              </Button>
            </div>
          ) : (
            <PostsList urlFetch={`/api/users/${user?.id}/posts`} />
          )}
        </div>
      </div>
    </article>
  )
}
