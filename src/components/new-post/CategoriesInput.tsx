import api from '@/services/config'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { RiLoader5Line } from 'react-icons/ri'

export default function CategoriesInput({
  idSelected,
}: {
  idSelected?: string[]
}) {
  const { setValue } = useFormContext()
  const refInputSearchCategories = useRef<HTMLInputElement | null>(null)
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>(
    idSelected || []
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const {
    data: categoriesData,
    isLoading: loadingCategories,
    isError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/api/categories')
      return res.data
    },
  })

  useEffect(() => {
    if (!loadingCategories && !isError && categoriesData) {
      setFilteredCategories(categoriesData)
      setCategories(categoriesData)
    }
  }, [loadingCategories, categoriesData, isError])
  useEffect(() => {
    if (categories.length > 0) {
      setFilteredCategories(categories)
    }
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
      <ul className='flex flex-wrap gap-2 border rounded-lg border-slate-500 p-2 max-h-[150px] min-h-[70px] h-auto overflow-y-auto'>
        {loadingCategories && (
          <RiLoader5Line className='animate-spin m-auto' size={28} />
        )}
        {!loadingCategories &&
          filteredCategories.map((category, index) => (
            <li
              key={index}
              className={`p-1 text-sm  text-white rounded-lg hover:bg-blue-800 cursor-pointer ${
                categoriesSelected.includes(category.id) && 'bg-blue-600'
              }`}
              onClick={() => {
                if (categoriesSelected.includes(category.id)) {
                  setCategoriesSelected((prev) => {
                    const newList = prev.filter((i) => i !== category.id)
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
