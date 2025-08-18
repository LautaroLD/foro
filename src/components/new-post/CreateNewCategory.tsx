import { useState } from 'react'
import Button from '../Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/config'
import { toast } from 'react-toastify'

export default function CreateNewCategory() {
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const queryClient = useQueryClient()
  const createCategory = useMutation({
    mutationFn: async () => {
      await api.post('/api/categories', {
        name: categoryName,
      })
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['categories'] })
      setCategoryName('')
      setShowCreateCategory(false)
      toast.success('Categoría creada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear la categoría')
      console.error('Error creating category:', error)
    },
  })
  return (
    <div>
      <div className='flex gap-2'>
        <p className='text-gray-400 text-sm'>¿No encontraste tu categoría?</p>
        <p
          className='text-[#b94d25] text-sm hover:cursor-pointer'
          onClick={() => setShowCreateCategory(true)}
        >
          ¡Crea una nueva!
        </p>
      </div>
      {showCreateCategory && (
        <div className='flex gap-2 items-center justify-start'>
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            type='text'
            placeholder='Nombre de la categoría'
            className='px-2 py-1  bg-black border border-slate-500 text-white rounded-lg'
          />
          <Button
            primary
            type='button'
            size='sm'
            className='text-sm font-light'
            onClick={() => createCategory.mutate()}
          >
            Crear
          </Button>
        </div>
      )}
    </div>
  )
}
