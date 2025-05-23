'use client'
import api from '@/services/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import MDEditor from '@uiw/react-md-editor'
import { useSession } from 'next-auth/react'
import React from 'react'
import '@uiw/react-markdown-preview/markdown.css'
import '@uiw/react-md-editor/markdown-editor.css'
import { PostExtended } from '@/models/post.model'
import LikeButtonComment from './LikeButtonComment'

import { IoTrash } from 'react-icons/io5'
import { RiLoader5Line } from 'react-icons/ri'
import CreateComment from './CreateComment'
export default function CommentsSection({ post }: { post: PostExtended }) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const user = session?.user

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      await api.delete(`/api/comments/${commentId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', post.id] })
    },
  })
  return (
    <section className='md:w-5/6 m-auto py-4 space-y-3 text-white '>
      <p>comentarios ({post.comments.length})</p>
      {user === undefined ? (
        <div className='border rounded-lg flex justify-center items-center h-20'>
          <p>Debes iniciar sesión para dejar un comentario.</p>
        </div>
      ) : (
        <CreateComment postId={post.id} userId={user?.id as string} />
      )}
      <ul className=' divide-y divide-slate-600 '>
        {post.comments.map((comment) => (
          <li key={comment.id} className='p-2 space-y-3'>
            <div className='flex justify-between'>
              <b>
                {comment.author.firstName} {comment.author.lastName}
              </b>

              <div className='flex gap-4 items-center'>
                <p className='text-center text-sm'>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                {user?.id === comment.authorId && (
                  <>
                    {!deleteComment.isPending && (
                      <IoTrash
                        size={20}
                        className='cursor-pointer'
                        onClick={() => deleteComment.mutate(comment.id)}
                      />
                    )}
                    {deleteComment.isPending && (
                      <RiLoader5Line
                        className='animate-spin m-auto'
                        size={20}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            <MDEditor.Markdown
              source={comment.content}
              style={{
                backgroundColor: 'transparent',
              }}
            />
            <LikeButtonComment comment={comment} />
          </li>
        ))}
      </ul>
    </section>
  )
}
