import Button from '@/components/Button'
import { useQuery } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import api from '@/services/config'
import { toast } from 'react-toastify'

interface Inputs {
  name: string
  email: string
}
export default function ChangeDataUser({
  enableEdit,
  userId,
}: {
  enableEdit: boolean
  userId: string
}) {
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
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data: res } = await api.get(`/api/users/${userId}`)
      return res
    },
  })
  if (isLoading)
    return (
      <div className='space-y-6'>
        <div className='bg-slate-600 rounded-lg  w-1/4 p-10 animate-pulse'></div>
        <div className='bg-slate-600 rounded-lg  w-1/4 p-10 animate-pulse'></div>
        <div className='bg-slate-600 rounded-lg  w-1/4 p-10 animate-pulse'></div>
      </div>
    )
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
      .patch(`/api/users/${userId}`, data)
      .then(() => {
        toast.success('Usuario actualizado')
      })
      .catch((error) => {
        console.error('Error updating user:', error)
      })
  }
  return (
    <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-6'>
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
              className='p-2 bg-black border border-slate-500 text-white rounded-lg w-fit disabled:opacity-50 disabled:cursor-not-allowed'
            />
            {errors[data.property as 'name' | 'email'] && (
              <p className='text-red-500'>
                {errors[data.property as 'name' | 'email']?.message}
              </p>
            )}
          </label>
        ))}
      </div>
      {enableEdit && (
        <Button className=' ml-0 '>
          <p className='p-2 '>Guardar cambios</p>
        </Button>
      )}
    </form>
  )
}
