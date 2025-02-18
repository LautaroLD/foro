import { Tag } from '@prisma/client'
import React from 'react'

export default function TagPin({ tag }: { tag: Tag }) {
  return (
    <li className='text-xs p-1 bg-purple-600 rounded-lg font-bold' key={tag.id}>
      {tag.name}
    </li>
  )
}
