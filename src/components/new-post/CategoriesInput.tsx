import api from '@/services/config'
import { Category } from '@prisma/client'
import React, { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

export default function CategoriesInput() {
  const { setValue } = useFormContext()
  const refInputSearchCategories = useRef<HTMLInputElement | null>(null)
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    api.get('/api/categories').then((res) => {
      setFilteredCategories(res.data)
      setCategories(res.data)
    })
  }, [])
  useEffect(() => {
    setFilteredCategories(categories)
    if (refInputSearchCategories.current) {
      refInputSearchCategories.current.value = ''
    }

    setValue('categories', categoriesSelected)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesSelected])
  return (
    <section className=' gap-2 flex flex-col'>
      <p className='text-xl font-semibold'>Categorías</p>
      <input
        ref={refInputSearchCategories}
        className='p-2 bg-black border border-slate-500 text-white rounded-lg'
        type='text'
        list='categoriesList'
        placeholder='Buscar'
        onChange={(e) => {
          if (e.target.value) {
            setFilteredCategories((prev) => {
              const filtered = prev.filter((category) =>
                category.name
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .includes(
                    e.target.value
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                  )
              )
              return filtered
            })
          } else {
            setFilteredCategories(categories)
          }
        }}
      />
      <datalist id='categoriesList'>
        {categories.map((category) => (
          <option value={category.name} key={category.id} />
        ))}
      </datalist>
      <ul className='flex flex-wrap gap-1'>
        {filteredCategories.map((category, index) => (
          <li
            key={index}
            className={`p-1 text-sm  text-white rounded-lg hover:bg-blue-800 cursor-pointer ${
              categoriesSelected.includes(category.id) && 'bg-blue-600'
            }`}
            onClick={() => {
              if (categoriesSelected.includes(category.id)) {
                setCategoriesSelected((prev) => {
                  const newList = prev.filter((i) => i !== category.id)
                  // setValue('category', newList)
                  return newList
                })
              } else {
                setCategoriesSelected((prev) => [...prev, category.id])
              }
            }}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
