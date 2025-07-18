'use client'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import CategoriesInput from './CategoriesInput'
import TagsInput from './TagsInput'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import api from '@/services/config'
import { toast } from 'react-toastify'
import ContentInput from './ContentInput'
import Button from '../Button'
interface Inputs {
  [key: string]: string | string[] | File[]
  title: string
  content: string
  authorId: string
  categories: string[]
  typeContent: string
  tags: string[]
  files: File[]
}
export default function Form() {
  const queryClient = useQueryClient()
  const { data: session, status } = useSession()
  const user = status === 'authenticated' && session?.user

  const router = useRouter()

  const method = useForm<Inputs>({
    defaultValues: {
      typeContent: 'image',
    },
  })
  const { handleSubmit, register } = method
  const onSubmit = (data: Inputs) => {
    const formData = new FormData()

    for (const key in data) {
      if (
        key === 'files' ||
        key === 'categories' ||
        (key === 'tags' && data[key].length > 0)
      ) {
        data[key].forEach((item: File | string) => {
          formData.append(key, item)
        })
      } else {
        formData.append(key, data[key] as string)
      }
    }
    if (user) {
      formData.append('authorId', user.id)
      createPost.mutate(formData)
    } else {
      toast.error('User not authenticated')
    }
  }

  const createPost = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.post(`/api/posts`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    onSuccess: (data) => {
      const postId = data.data.id

      queryClient.refetchQueries({ queryKey: ['posts'] })
      toast.success(`Post creado correctamente.`)
      router.push(`/post/${postId}`)
    },
  })
  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
        <label className='flex flex-col gap-2'>
          <p className='text-xl font-semibold'>Titulo</p>
          <input
            {...register('title')}
            type='text'
            required
            placeholder='Título'
            className='p-2 bg-black border border-slate-500 text-white rounded-lg'
          />
        </label>
        <CategoriesInput />
        <TagsInput />
        <ContentInput />

        <Button
          loading={createPost.isPending}
          primary
          className='max-w-[200px] min-w-[200px]'
        >
          <p className='p-2'>Publicar</p>
        </Button>
      </form>
    </FormProvider>
  )
}
