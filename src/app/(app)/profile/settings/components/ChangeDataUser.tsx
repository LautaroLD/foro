import Button from '@/components/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
import api from '@/services/config'
import { toast } from 'react-toastify'
import { UserExtended } from '@/models/user.model'
import Image from 'next/image'
import { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { useQueryClient } from '@tanstack/react-query'
interface Inputs {
  [key: string]: string | File
  firstName: string
  lastName: string
  email: string
  image: File
}
export default function ChangeDataUser({
  enableEdit,
  userData,
  isLoading,
  isError,
}: {
  enableEdit: boolean
  userData: UserExtended
  isLoading: boolean
  isError: boolean
}) {
  const [userImage, setUserImage] = useState<string>('')
  const [loadingChange, setLoadingChange] = useState(false)
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()
  const queryClient = useQueryClient()
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
      label: 'Imagen de perfil',
      property: 'image',
      value: userData?.image || '',
    },
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

  const onSubmit: SubmitHandler<Inputs> = async ({ image, ...data }) => {
    setLoadingChange(true)
    if (image) {
      const formData = new FormData()
      formData.append('image', image)
      api
        .patch(`/api/users/${userData?.id}/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          queryClient.refetchQueries({ queryKey: ['user', userData?.id] })
        })
        .catch((error) => {
          console.error('Error updating user:', error)
          toast.error('Error al actualizar la imagen')
        })
        .finally(() => {
          setLoadingChange(false)
        })
    }
    api
      .patch(`/api/users/${userData?.id}`, data)
      .then(() => {
        toast.success('Usuario actualizado')
        queryClient.refetchQueries({
          queryKey: ['user', userData?.id],
        })
      })
      .catch((error) => {
        console.error('Error updating user:', error)
      })
      .finally(() => {
        setLoadingChange(false)
      })
  }

  return (
    <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-6'>
        {userDataToForm.map((data) => (
          <label className='flex flex-col gap-2' key={data.label}>
            <b className='text-xl'>{data.label}</b>
            {data.property === 'image' ? (
              <span className='relative w-32 h-32 rounded-full overflow-hidden'>
                {userData?.image || userImage.length ? (
                  <Image
                    fill
                    className='rounded-full 
                    border-slate-500 border'
                    src={userImage || data.value}
                    alt={data.label}
                  />
                ) : (
                  <FaUserCircle className='w-full h-full' />
                )}
                <input
                  disabled={!enableEdit}
                  type='file'
                  accept='image/*'
                  onChange={async (e) => {
                    if (e.target.files?.length) {
                      setValue('image', e.target.files[0])
                      const reader = new FileReader()
                      reader.readAsDataURL(e.target.files[0])
                      reader.onload = (e) => {
                        setUserImage(e.target?.result as string)
                      }
                    }
                  }}
                  className='absolute inset-0 opacity-0 cursor-pointer'
                />
              </span>
            ) : (
              <>
                <input
                  disabled={
                    !enableEdit ||
                    (userData?.accounts?.length > 0 &&
                      data.property === 'email')
                  }
                  title={
                    userData?.accounts?.length > 0 && data.property === 'email'
                      ? 'No se puede cambiar el email si tiene cuenta de Google'
                      : ''
                  }
                  type='text'
                  defaultValue={data.value}
                  {...register(
                    data.property as 'firstName' | 'lastName' | 'email',
                    {
                      required: 'Campo requerido',
                      pattern:
                        data.property === 'email'
                          ? {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'El correo no es válido',
                            }
                          : undefined,
                    }
                  )}
                  className='p-2 bg-black border border-slate-500 text-white rounded-lg w-fit disabled:opacity-50 disabled:cursor-not-allowed'
                />
                {errors[
                  data.property as 'firstName' | 'lastName' | 'email'
                ] && (
                  <p className='text-red-500'>
                    {
                      errors[
                        data.property as 'firstName' | 'lastName' | 'email'
                      ]?.message
                    }
                  </p>
                )}
              </>
            )}
          </label>
        ))}
      </div>
      {enableEdit && (
        <Button primary size='sm' loading={loadingChange}>
          Guardar cambios
        </Button>
      )}
    </form>
  )
}
