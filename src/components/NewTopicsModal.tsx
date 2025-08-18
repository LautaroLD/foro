import React from 'react'
import CategoriesInput from './new-post/CategoriesInput'
import TagsInput from './new-post/TagsInput'
import Button from './Button'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import api from '@/services/config'
import { toast } from 'react-toastify'
import { Category, Tag } from '@prisma/client'
import { Topic } from '@/models/topics.model'
interface Inputs {
  categories: string[]
  tags: string[]
}
export default function NewTopicsModal({
  setIsOpen,
  userId,
  refetchTopics,
  defaultTopics,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  userId: string
  refetchTopics: () => void
  defaultTopics: Topic[]
}) {
  const method = useForm<Inputs>({
    defaultValues: {
      tags: defaultTopics
        ?.filter((topic) => topic.type === 'tag')
        .map((tag: Tag) => tag.id),
      categories: defaultTopics
        ?.filter((topic) => topic.type === 'category')
        .map((category: Category) => category.id),
    },
  })

  const updateTopics = useMutation({
    mutationFn: async (data: Inputs) => {
      const res = await api.patch(`/api/users/${userId}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Temas actualizados correctamente')
      refetchTopics()
      setIsOpen(false)
    },
    onError: (error) => {
      toast.error('Error al actualizar los temas')
      console.error('Error creating topic:', error)
    },
  })
  const onSubmit = (data: Inputs) => {
    updateTopics.mutate(data)
  }
  return (
    <div className='w-screen h-screen bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center'>
      <div className='bg-slate-900 text-white p-6 rounded-lg shadow-lg w-full md:w-1/2 '>
        <h2 className='text-2xl font-semibold mb-4'>
          Elige los temas de tu interés
        </h2>
        <FormProvider {...method}>
          <form
            onSubmit={method.handleSubmit(onSubmit)}
            className='space-y-4 flex flex-col'
          >
            <CategoriesInput idSelected={method.watch('categories')} />
            <TagsInput idSelected={method.watch('tags')} />
            <div className='flex flex-col md:flex-row gap-4 justify-end'>
              <Button primary loading={updateTopics.isPending}>
                Guardar
              </Button>
              <Button type='button' onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
