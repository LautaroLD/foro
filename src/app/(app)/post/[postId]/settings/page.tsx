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
      // method.setValue('files', post.files)
      method.setValue('authorId', post.authorId)
      method.setValue('id', post.id)
      method.setValue('typeContent', post.typeContent as 'text' | 'image')
      method.setValue('title', post.title)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])
  const { handleSubmit, register } = method
  const onSubmit = (data: Inputs) => {
    const formData = new FormData()

    for (const key in data) {
      if (
        key === 'files' ||
        key === 'categories' ||
        (key === 'tags' && data[key].length > 0)
      ) {
        data[key]?.forEach((item) => {
          formData.append(key, item)
        })
      } else {
        formData.append(key, data[key] as string)
      }
    }

    if (user) {
      formData.append('authorId', user.id)
      updatePost.mutate(formData)
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
    mutationFn: async (data: FormData) => {
      return await api.patch(`/api/posts/${postId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    onSuccess: (data) => {
      const postId = data.data.id

      queryClient.refetchQueries({ queryKey: ['posts', postId] })
      toast.success(`Post actualizado correctamente.`)
      router.push(`/post/${postId}`)
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
    <article className='p-6'>
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

            <Button loading={updatePost.isPending} primary>
              <p className='p-2'>Publicar</p>
            </Button>
          </form>
        </FormProvider>
      )}
    </article>
  )
}
