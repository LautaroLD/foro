import { Category } from '@prisma/client'
import { Tag } from 'primereact/tag'
import React from 'react'

export default function CategoryPin({ category }: { category: Category }) {
  return (
    <Tag
      value={category.name}
      className='text-xs bg-blue-600  font-bold text-white'
      key={category.id}
      rounded
    ></Tag>
  )
}
