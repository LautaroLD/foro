import api from '@/services/config'
import { Tag } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { RiLoader5Line } from 'react-icons/ri'

export default function TagsInput({ idSelected }: { idSelected?: string[] }) {
  const { setValue } = useFormContext()
  const [tagsSelected, setTagsSelected] = useState<string[]>(idSelected || [])
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const refInputSearchTags = useRef<HTMLInputElement | null>(null)
  const {
    data: tagsData,
    isLoading: loadingTags,
    isError,
  } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await api.get('/api/tags')
      return res.data
    },
  })

  useEffect(() => {
    if (!loadingTags && !isError && tagsData) {
      setFilteredTags(tagsData)
      setTags(tagsData)
    }
  }, [loadingTags, tagsData, isError])
  useEffect(() => {
    if (tags.length > 0) {
      setFilteredTags(tags)
    }
    if (refInputSearchTags.current) {
      refInputSearchTags.current.value = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsSelected])
  return (
    <section className=' gap-2 flex flex-col'>
      <p className='text-xl font-semibold'>Etiquetas</p>
      <input
        ref={refInputSearchTags}
        className='p-2 bg-black border border-slate-500 text-white rounded-lg'
        type='text'
        list='tagsList'
        placeholder='Buscar'
        onChange={(e) => {
          if (e.target.value) {
            setFilteredTags((prev) => {
              const filtered = prev.filter((tag) =>
                tag.name
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
            setFilteredTags(tags)
          }
        }}
      />
      <datalist id='tagsList'>
        {tags.map((tag) => (
          <option value={tag.name} key={tag.id} />
        ))}
      </datalist>
      <ul className='flex flex-wrap gap-2 border rounded-lg border-slate-500 p-2 max-h-[150px] min-h-[70px] h-auto overflow-y-auto'>
        {loadingTags && (
          <RiLoader5Line className='animate-spin m-auto' size={28} />
        )}
        {filteredTags.map((tag, index) => (
          <li
            key={index}
            className={`p-1 text-sm  text-white rounded-lg hover:bg-purple-800 cursor-pointer ${
              tagsSelected.includes(tag.id) && 'bg-purple-600'
            }`}
            onClick={() => {
              if (tagsSelected.includes(tag.id)) {
                setTagsSelected((prev) => {
                  const newList = prev.filter((i) => i !== tag.id)
                  setValue('tags', newList)
                  return newList
                })
              } else {
                setTagsSelected([...tagsSelected, tag.id])
                setValue('tags', [...tagsSelected, tag.id])
              }
            }}
          >
            {tag.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
