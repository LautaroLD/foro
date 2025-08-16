'use client'
import Button from '@/components/Button'
import CategoriesInput from '@/components/new-post/CategoriesInput'
import ContentInput from '@/components/new-post/ContentInput'
import TagsInput from '@/components/new-post/TagsInput'
import { CommentExtended } from '@/models/Comment.model'
import { PostFile } from '@/models/file.model'
import { PostExtended } from '@/models/post.model'
import api from '@/services/config'
import { Category, Tag, User } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface Inputs {
  [key: string]:
    | User
    | CommentExtended[]
    | File[]
    | Tag[]
    | Category[]
    | string
    | string[]
    | null
    | Date
    | { id: string }[]
  title: string
  content: string
  categories: string[]
  tags: string[]
  files: File[]
  typeContent: 'text' | 'image'
}
export default function Form() {
  const [deletedFiles, setDeletedFiles] = React.useState<PostFile[]>([])
  const params = useParams()
  const postId = params.postId
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, status } = useSession()
  const user = status === 'authenticated' && session?.user

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const { data: post } = await api.get<PostExtended>(`/api/posts/${postId}`)
      return post
    },
  })
  const method = useForm<Inputs>()

  useEffect(() => {
    if (post) {
      method.setValue('content', post.content ?? '')
      method.setValue(
        'categories',
        post?.categories?.map((c) => c.id)
      )
      method.setValue(
        'tags',
        post?.tags?.map((t) => t.id)
      )
      method.setValue('authorId', post.authorId)
      method.setValue('id', post.id)
      method.setValue('typeContent', post.typeContent as 'text' | 'image')
      method.setValue('title', post.title)
    }
  }, [post])
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
      updatePost.mutate({ formData, formDataCloudinary })
      if (deletedFiles.length > 0) {
        deleteFile.mutate(deletedFiles)
      }
    } else {
      toast.error('User not authenticated')
    }
  }

  const deleteFile = useMutation({
    mutationFn: async (data: PostFile[]) => {
      return await api.patch(`/api/posts/${postId}/delete_files`, data)
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['posts', postId] })
    },
  })
  const updatePost = useMutation({
    mutationFn: async ({
      formData,
      formDataCloudinary,
    }: {
      formData: FormData
      formDataCloudinary?: FormData
    }) => {
      const postUpdated = await api.patch(`/api/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(postUpdated)
      if (formDataCloudinary) {
        const uploadPromises = Array.from(formDataCloudinary.entries()).map(
          async ([, value]) => {
            const formDataFile = new FormData()
            formDataFile.append('file', value)
            formDataFile.append('upload_preset', 'post_foro')
            formDataFile.append('resource_type', 'auto')
            formDataFile.append('folder', `foro/post/${postUpdated.data.id}`)

            const { data } = await axios.post(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              formDataFile
            )

            return {
              resource_type: data.resource_type,
              secure_url: data.secure_url,
              public_id: data.public_id,
              postId: postUpdated.data.id,
            }
          }
        )

        const files = await Promise.all(uploadPromises)
        console.log('Files to save:', files)

        await api.post(`/api/file`, files)
      }
      return postUpdated
    },
    onSuccess: (data) => {
      const postId = data.data.id

      queryClient.refetchQueries({ queryKey: ['posts'] })
      toast.success(`Post actualizado correctamente.`)

      router.push(`/post/${postId}`)
    },
  })

  const deletePost = useMutation({
    mutationFn: async () => {
      return await api.delete(`/api/posts/${postId}`)
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['posts'],
        exact: false,
      })
      toast.success(`Post eliminado correctamente.`)
      router.push('/')
    },
  })

  if (isLoading)
    return (
      <aside className='col-span-1 text-white  space-y-2 px-2 py-4 hidden md:block'>
        <div className='p-8 w-2/3 bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-60 m-auto w-4/5 bg-slate-600 animate-pulse rounded-lg'></div>
      </aside>
    )
  if (error) return <div>Error loading post</div>

  return (
    <article className='p-6 flex flex-col gap-6'>
      {post && (
        <FormProvider {...method}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-10'
          >
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
            <CategoriesInput idSelected={post?.categories?.map((c) => c.id)} />
            <TagsInput idSelected={post?.tags?.map((t) => t.id)} />
            <ContentInput
              typeContent={(post?.typeContent as 'text' | 'image') ?? undefined}
              contentInput={post?.content ?? undefined}
              filesInput={post?.files ?? undefined}
              deletedFiles={deletedFiles}
              setDeletedFiles={setDeletedFiles}
            />

            <Button
              loading={updatePost.isPending}
              primary
              className='max-w-[200px] min-w-[200px]'
            >
              <p className='p-2'>Publicar</p>
            </Button>
            <Button
              type='button'
              className='max-w-[200px] min-w-[200px]'
              loading={deletePost.isPending}
              onClick={() => deletePost.mutate()}
            >
              <p className='p-2 text-base'>Eliminar post</p>
            </Button>
          </form>
        </FormProvider>
      )}
    </article>
  )
}
