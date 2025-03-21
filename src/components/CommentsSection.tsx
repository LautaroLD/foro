'use client'
import api from '@/services/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import MDEditor from '@uiw/react-md-editor'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import '@uiw/react-markdown-preview/markdown.css'
import '@uiw/react-md-editor/markdown-editor.css'
import { PostExtended } from '@/models/post.model'
import LikeButtonComment from './LikeButtonComment'
import { Editor } from 'primereact/editor'
import Button from './Button'
export default function CommentsSection({ post }: { post: PostExtended }) {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const user = session?.user
  const [comment, setComment] = useState('')
  const addComment = useMutation({
    mutationFn: async () => {
      await api.post(`/api/comments`, {
        content: comment,
        postId: post.id,
        authorId: user?.id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', post.id] })
      setComment('')
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
        <form
          className='flex gap-2 flex-col'
          onSubmit={(e) => {
            e.preventDefault()
            addComment.mutate()
          }}
        >
          <Editor
            value={comment}
            onTextChange={(val) => setComment(val.htmlValue || '')}
            style={{
              height: 200,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              overflow: 'hidden',
              padding: 2,
              border: '1px solid #64748b ',
            }}
          />

          <Button loading={addComment.isPending} primary>
            <p className='p-2'>Comentar</p>
          </Button>
        </form>
      )}
      <ul className=' divide-y divide-slate-600 '>
        {post.comments.map((comment) => (
          <li key={comment.id} className='p-2 space-y-3'>
            <div className='flex justify-between'>
              <b>
                {comment.author.firstName} {comment.author.lastName}
              </b>
              <p className='text-center text-sm'>
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
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
