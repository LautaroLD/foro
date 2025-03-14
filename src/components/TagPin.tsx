import { Tag } from '@prisma/client'
import { Tag as TagPrime } from 'primereact/tag'
import React from 'react'

export default function TagPin({ tag }: { tag: Tag }) {
  return (
    <TagPrime
      value={tag.name}
      rounded
      className='text-xs bg-purple-600 font-bold text-white'
      key={tag.id}
    ></TagPrime>
  )
}
