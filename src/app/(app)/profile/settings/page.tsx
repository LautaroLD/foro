'use client'
import Button from '@/components/Button'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BiEdit } from 'react-icons/bi'
import { toast } from 'react-toastify'

interface Inputs {
  name: string
  email: string
}
export default function Page() {
  const { data: session } = useSession()
  const [enableEdit, setEnableEdit] = useState(false)
  const user = session?.user
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>()
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
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading user</div>

  const userDataToForm = [
    {
      label: 'Nombre',
      property: 'firstName',
      value: userData?.firstName,
    },
    {
      label: 'Apellido',
      property: 'lastName',
      value: userData?.lastName,
    },
    {
      label: 'Email',
      property: 'email',
      value: userData?.email,
    },
  ]

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    api
      .patch(`/api/users/${user?.id}`, data)
      .then(() => {
        toast.success('Usuario actualizado')
        setEnableEdit(false)
      })
      .catch((error) => {
        console.error('Error updating user:', error)
      })
  }
  return (
    <section className='p-4 space-y-4'>
      <h1 className='text-3xl font-bold flex gap-2'>
        Configuraciones de perfil{' '}
        <BiEdit
          onClick={() => setEnableEdit(!enableEdit)}
          size={35}
          className='hover:bg-white hover:text-black transition-all p-1 rounded-lg cursor-pointer'
        />{' '}
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
        {enableEdit && (
          <Button primary buttonProps={{ className: 'max-w-[150px]' }}>
            <p className='p-2'>Guardar</p>
          </Button>
        )}
        <div className='flex flex-wrap justify-evenly gap-4'>
          {userDataToForm.map((data) => (
            <label className='flex flex-col gap-2' key={data.label}>
              <b className='text-xl'>{data.label}</b>
              <input
                disabled={!enableEdit}
                type='text'
                defaultValue={data.value}
                {...register(data.property as 'name' | 'email', {
                  required: 'Campo requerido',
                  pattern:
                    data.property === 'email'
                      ? {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'El correo no es válido',
                        }
                      : undefined,
                })}
                className='p-2 bg-black border border-slate-500 text-white rounded-lg w-fit disabled:opacity-50'
              />
              {errors[data.property as 'name' | 'email'] && (
                <p className='text-red-500'>
                  {errors[data.property as 'name' | 'email']?.message}
                </p>
              )}
            </label>
          ))}
        </div>
      </form>
    </section>
  )
}
