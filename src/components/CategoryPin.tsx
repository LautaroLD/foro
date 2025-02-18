import { Category } from '@prisma/client'
import React from 'react'

export default function CategoryPin({ category }: { category: Category }) {
  return (
    <li
      className='text-xs p-1 bg-blue-500 rounded-lg font-bold'
      key={category.id}
    >
      {category.name}
    </li>
  )
}
