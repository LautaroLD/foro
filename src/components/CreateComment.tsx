import api from '@/services/config'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Editor } from 'primereact/editor'
import Button from './Button'
export default function CreateComment({
  postId,
  userId,
}: {
  postId: string
  userId: string
}) {
  const queryClient = useQueryClient()

  const [comment, setComment] = useState('')

  const addComment = useMutation({
    mutationFn: async () => {
      await api.post(`/api/comments`, {
        content: comment,
        postId,
        authorId: userId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
      setComment('')
    },
  })
  return (
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
          backgroundColor: '#000',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          overflow: 'hidden',
          padding: 2,
          border: '1px solid #64748b ',
        }}
      />

      <Button loading={addComment.isPending} primary disabled={!comment.length}>
        <p className='p-2'>Comentar</p>
      </Button>
    </form>
  )
}
