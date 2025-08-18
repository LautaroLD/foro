import Button from '@/components/Button'
import { UserExtended } from '@/models/user.model'
import api from '@/services/config'
import { useMutation } from '@tanstack/react-query'

import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function ChangePassword({
  enableEdit,
  userData,
}: {
  enableEdit: boolean
  userData: UserExtended
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const updatePassword = useMutation({
    mutationFn: async () => {
      const data = new FormData()
      data.append('oldPassword', currentPassword)
      data.append('newPassword', newPassword)
      return await api.patch(
        `/api/users/${userData?.id}/password/`,
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    },
    onSuccess: () => {
      toast.success(`Contraseña cambiada correctamente.`)
    },
    onError: (error: { response: { data: { message: string } } }) => {
      const errorMessage =
        error.response?.data?.message || 'Error al cambiar la contraseña'
      toast.error(errorMessage)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updatePassword.mutate()
  }
  return (
    <form onSubmit={handleSubmit} className='pt-6 space-y-6'>
      <h2 className='text-2xl font-semibold'>Cambiar contraseña</h2>
      <label className='flex flex-col gap-2'>
        <b className='text-xl'>Contraseña actual</b>
        <input
          disabled={!enableEdit}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          type='password'
          placeholder='Contraseña actual'
          className='p-2 bg-black border border-slate-500 text-white rounded-lg w-fit disabled:opacity-50 disabled:cursor-not-allowed'
        />
      </label>
      <label className='flex flex-col gap-2'>
        <b className='text-xl'>Nueva contraseña</b>
        <input
          disabled={!enableEdit}
          value={newPassword}
          pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$'
          title='La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número'
          required
          onChange={(e) => setNewPassword(e.target.value)}
          type='password'
          placeholder='Nueva contraseña'
          className='p-2 bg-black border border-slate-500 text-white rounded-lg w-fit disabled:opacity-50 disabled:cursor-not-allowed'
        />
      </label>
      {enableEdit && (
        <Button size='sm' primary loading={updatePassword.isPending}>
          Guardar contraseña
        </Button>
      )}
    </form>
  )
}
