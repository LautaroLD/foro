import React from 'react'
import { IoConstructOutline } from 'react-icons/io5'

export default function UnderDevelopment() {
  return (
    <div className='flex items-center justify-center h-full flex-col'>
      <IoConstructOutline className='text-6xl mb-4' />
      <h1 className='text-3xl font-bold'>Pagina en desarrollo</h1>
    </div>
  )
}
