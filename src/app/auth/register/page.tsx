'use client'

import api from '@/services/config'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuLoader } from 'react-icons/lu'
import { toast } from 'react-toastify'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>()
  const router = useRouter()
  const onSubmit = async (data: RegisterInputs) => {
    setLoading(true)
    try {
      const { data: dataApi } = await api.post('/api/auth/register', data)
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // })

      if (dataApi.status === 500) {
        toast.error(dataApi.message)
      } else {
        toast.success('Registro exitoso')
        router.push('/auth/login')
      }

      // const user = await response.json()

      // Handle register success
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className='text-2xl font-bold text-center'>Registrarse</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 flex flex-col'
      >
        <div className='grid grid-cols-2 gap-4'>
          <label className='flex flex-col space-y-1'>
            <p>Nombre</p>
            <input
              type='text'
              className='p-2 bg-black border border-slate-500 text-white rounded-lg'
              {...register('firstName', { required: 'El nombre es requerido' })}
            />
            {errors.firstName && (
              <p className='text-red-500'>{errors.firstName.message}</p>
            )}
          </label>
          <label className='flex flex-col space-y-1 '>
            <p>Apellido</p>
            <input
              type='text'
              className='p-2 bg-black border border-slate-500 text-white rounded-lg'
              {...register('lastName', {
                required: 'El apellido es requerido',
              })}
            />
            {errors.lastName && (
              <p className='text-red-500'>{errors.lastName.message}</p>
            )}
          </label>
        </div>
        <label className='flex flex-col space-y-1'>
          <p>Correo</p>
          <input
            type='email'
            className='p-2 bg-black border border-slate-500 text-white rounded-lg'
            {...register('email', {
              required: 'El correo es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'El correo no es válido',
              },
            })}
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}
        </label>

        <label className='flex flex-col space-y-1'>
          <p>Contraseña</p>
          <input
            type='password'
            className='p-2 bg-black border border-slate-500 text-white rounded-lg'
            {...register('password', {
              required: 'La contraseña es requerida',
            })}
          />
          {errors.password && (
            <p className='text-red-500'>{errors.password.message}</p>
          )}
        </label>

        <button className='p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 w-full '>
          {loading ? (
            <LuLoader className='animate-spin mx-auto' />
          ) : (
            'Registrarse'
          )}
        </button>
      </form>
      <p className='text-center mt-4 text-sm text-gray-300 '>
        Ya tienes cuenta?
        <Link
          href={'/auth/login'}
          className='text-blue-500 hover:text-blue-700 mx-2'
        >
          Iniciar Sesión
        </Link>
      </p>
    </>
  )
}

interface RegisterInputs {
  email: string
  password: string
  firstName: string
  lastName: string
}
