'use client'
import Button from '@/components/Button'
import React, { useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import ChangePassword from './components/ChangePassword'
import ChangeDataUser from './components/ChangeDataUser'
import { useSession } from 'next-auth/react'

export default function Page() {
  const [enableEdit, setEnableEdit] = useState(false)
  const { data: session, status } = useSession()
  const user = session?.user
  if (status !== 'authenticated' || !user) {
    return <div className='p-6'>Debes iniciar sesión para ver esta página.</div>
  }
  return (
    <section className='p-6 space-y-8'>
      <h1 className='text-2xl font-bold flex gap-4 w-fit '>
        Configuraciones de perfil{' '}
        <Button type='button' primary className=' mx-0'>
          <BiEdit
            onClick={() => setEnableEdit(!enableEdit)}
            size={30}
            className=' p-1 '
          />{' '}
        </Button>
      </h1>
      <div className='space-y-8 divide-y'>
        <ChangeDataUser enableEdit={enableEdit} userId={user.id} />
        <ChangePassword enableEdit={enableEdit} userId={user.id} />
      </div>
    </section>
  )
}
