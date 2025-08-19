import { useState } from 'react'
import Button from '../Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/config'
import { toast } from 'react-toastify'

export default function CreateNewTag() {
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [tagName, setTagName] = useState('')
  const queryClient = useQueryClient()
  const createTag = useMutation({
    mutationFn: async () => {
      await api.post('/api/tags', {
        name: tagName,
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tags'] })
      setTagName('')
      setShowCreateTag(false)
      toast.success('Etiqueta creada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear la etiqueta')
      console.error('Error creating tag:', error)
    },
  })
  return (
    <div>
      <div className='flex gap-2'>
        <p className='text-gray-400 text-sm'>¿No encontraste tu etiqueta?</p>
        <p
          className='text-[#b94d25] text-sm hover:cursor-pointer'
          onClick={() => setShowCreateTag(true)}
        >
          ¡Crea una nueva!
        </p>
      </div>
      {showCreateTag && (
        <div className='flex gap-2 items-center justify-start'>
          <input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            type='text'
            placeholder='Nombre de la etiqueta'
            className='px-2 py-1  bg-black border border-slate-500 text-white rounded-lg'
          />
          <Button
            disabled={!tagName}
            primary
            type='button'
            size='sm'
            className='text-sm font-light'
            onClick={() => createTag.mutate()}
          >
            Crear
          </Button>
        </div>
      )}
    </div>
  )
}
