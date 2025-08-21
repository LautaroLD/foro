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
import axios from 'axios'
import CreateNewCategory from './CreateNewCategory'
import CreateNewTag from './CreateNewTag'
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
      title: '',
      typeContent: 'image',
      categories: [],
      tags: [],
    },
  })
  const { handleSubmit, register } = method
  const onSubmit = (data: Inputs) => {
    const formData = new FormData()
    const formDataCloudinary = new FormData()

    for (const key in data) {
      if (key === 'files') {
        data[key].forEach((item: File | string) => {
          formDataCloudinary.append(key, item)
        })
      }
      if (key === 'categories' || (key === 'tags' && data[key].length > 0)) {
        data[key].forEach((item: File | string) => {
          formData.append(key, item)
        })
      } else {
        formData.append(key, data[key] as string)
      }
    }
    if (user) {
      formData.append('authorId', user.id)
      createPost.mutate({ formData, formDataCloudinary })
    } else {
      toast.error('User not authenticated')
    }
  }

  const createPost = useMutation({
    mutationFn: async ({
      formData,
      formDataCloudinary,
    }: {
      formData: FormData
      formDataCloudinary?: FormData
    }) => {
      const newPost = await api.post(`/api/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (formDataCloudinary) {
        const uploadPromises = Array.from(formDataCloudinary.entries()).map(
          async ([, value]) => {
            const formDataFile = new FormData()
            formDataFile.append('file', value)
            formDataFile.append('upload_preset', 'post_foro')
            formDataFile.append('resource_type', 'auto')
            formDataFile.append('folder', `foro/post/${newPost.data.id}`)

            const { data } = await axios.post(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              formDataFile
            )

            return {
              resource_type: data.resource_type,
              secure_url: data.secure_url,
              public_id: data.public_id,
              postId: newPost.data.id,
            }
          }
        )

        const files = await Promise.all(uploadPromises)

        await api.post(`/api/file`, files)
      }
      return newPost
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
        <div>
          <CategoriesInput />
          <CreateNewCategory />
        </div>
        <div>
          <TagsInput />
          <CreateNewTag />
        </div>

        <ContentInput />

        <Button loading={createPost.isPending} primary>
          Publicar
        </Button>
      </form>
    </FormProvider>
  )
}
