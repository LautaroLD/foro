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
    console.log(data)
    const formData = new FormData()
    for (const key in data) {
      if (key === 'files' && data[key].length > 0) {
        data[key].forEach((file: File) => {
          console.log(file)
          console.log(key)
          formData.append(key, file)
        })
      } else {
        formData.append(key, data[key] as string)
      }
    }
    console.log(formData.get('files'))
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
      console.log(data)

      queryClient.refetchQueries({ queryKey: ['posts'] })
      toast.success(`Post creado ${postId}`)
      router.push(`/post/${postId}`)
    },
  })
  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className='flex flex-col gap-2'>
          <b className='text-xl'>Titulo</b>
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
        <button className='p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700'>
          Publicar
        </button>
      </form>
    </FormProvider>
  )
}
