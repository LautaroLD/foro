'use client'
import Button from '@/components/Button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type LoginFormInputs = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true)
    try {
      const response = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (response && !response.ok) {
        toast.error('Credenciales incorrectas')
      }

      if (response && response.ok) {
        router.push('/')
      }

      // Handle login success
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <h1 className='text-2xl font-bold text-white text-center'>
        Iniciar sesión
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className=' space-y-4'>
        <label className='flex flex-col space-y-1'>
          <p>Correo</p>
          <input
            type='email'
            {...register('email', {
              required: 'El correo es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'El correo no es válido',
              },
            })}
            className='p-2 bg-black border border-slate-500 text-white rounded-lg'
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}
        </label>

        <label className='flex flex-col space-y-1'>
          <p>Contraseña</p>
          <input
            type='password'
            {...register('password', {
              required: 'La contraseña es requerida',
            })}
            className='p-2 bg-black border border-slate-500 text-white rounded-lg'
          />
          {errors.password && (
            <p className='text-red-500'>{errors.password.message}</p>
          )}
        </label>

        <Button
          loading={loading}
          primary
          className='flex w-full max-w-full justify-center'
        >
          <p className='p-2'>Iniciar sesión</p>
        </Button>
      </form>
      <p className='text-center mt-4 text-sm text-gray-300 '>
        ¿No tienes una cuenta?
        <Link
          href={'/auth/register'}
          className='text-blue-500 hover:text-blue-700 mx-2'
        >
          Regístrate
        </Link>
      </p>
    </>
  )
}
