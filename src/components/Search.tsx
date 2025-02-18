'use client'
import { PostExtended } from '@/models/post.model'
import api from '@/services/config'
import { Category, Post, Tag } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'

export default function Search() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    if (search) {
      api.get(`api/posts?q=${search}`).then((response) => {
        setSearchResults(response.data)
      })
    } else {
      setSearchResults([])
    }
  }, [search])
  const handleRoute = (post: Post) => {
    router.push(`/post/${post.id}`)
    setSearchResults([])
    setSearch('')
  }
  return (
    <div className='flex items-center gap-2 w-full h-fit m-auto  focus:outline-none  text-sm relative p-2 bg-black border border-slate-500 text-white rounded-lg'>
      <BiSearch />
      <input
        type='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Buscar'
        className='focus:outline-none  bg-transparent w-full'
      />
      {searchResults.length > 0 && (
        <div className='fixed sm:absolute top-10 lg:top-full w-screen sm:w-[50vw]  lg:w-full left-0  mt-2 rounded-lg py-4 bg-slate-500 divide-y z-50'>
          {searchResults.map((post: PostExtended) => (
            <div
              className='py-2 px-4 hover:bg-slate-600 cursor-pointer'
              key={post.id}
              onClick={() => handleRoute(post)}
            >
              <div className='flex gap-2 items-center justify-between'>
                <b>{post.title}</b>
                <p className='text-xs '>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <ul className='flex gap-2 list-none'>
                {post.categories.map((category: Category) => (
                  <li className='text-xs' key={category.id}>
                    {category.name}
                  </li>
                ))}
              </ul>
              <ul className='flex gap-2 list-none'>
                {post.tags.map((tag: Tag) => (
                  <li className='text-xs' key={tag.id}>
                    {tag.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
