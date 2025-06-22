'use client'
import { PostExtended } from '@/models/post.model'
import api from '@/services/config'
import { Post } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { Tag as TagPrime } from 'primereact/tag'

export default function Search() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    if (search) {
      api.get(`/api/posts?q=${search}`).then((response) => {
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
    <div className='flex items-center gap-2 w-full md:max-w-[40vw] h-fit m-auto  focus:outline-none  text-sm relative p-2 bg-black border border-slate-500 text-white rounded-lg'>
      <BiSearch />
      <input
        type='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Buscar'
        className='focus:outline-none  bg-transparent w-full'
      />
      {searchResults.length > 0 && search && (
        <div className='fixed sm:absolute top-10 lg:top-full w-screen sm:w-[50vw]  lg:w-full left-0  mt-2 px-0 rounded-lg py-4 bg-slate-700 divide-y divide-slate-600 z-50 max-h-[calc(100vh-56px)] overflow-y-auto '>
          {searchResults.map((post: PostExtended) => (
            <div
              className='py-2 px-4 hover:bg-slate-900 cursor-pointer flex flex-col gap-1 '
              key={post.id}
              onClick={() => handleRoute(post)}
            >
              <div className='flex gap-2 items-center justify-between'>
                <b>{post.title}</b>
                <p className='text-xs '>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              {post.categories.length > 0 && (
                <ul className='flex gap-1 list-none flex-wrap'>
                  {post.categories.length > 3 ? (
                    <li className='flex gap-1 items-center'>
                      {post.categories.slice(0, 3).map((category) => (
                        <p className='text-xs' key={category.id}>
                          {category.name}
                        </p>
                      ))}
                      <TagPrime
                        className='text-[10px]  text-white bg-slate-600'
                        value={`+${post.categories.length - 3}`}
                        rounded
                      />
                    </li>
                  ) : (
                    post.categories.map((category) => (
                      <li className='text-xs' key={category.id}>
                        {category.name}
                      </li>
                    ))
                  )}
                </ul>
              )}
              {post.tags.length > 0 && (
                <ul className='flex gap-1 list-none flex-wrap'>
                  {post.tags.length > 3 ? (
                    <li className='flex gap-1 items-center '>
                      {post.tags.slice(0, 3).map((tag) => (
                        <p className='text-xs' key={tag.id}>
                          {tag.name}
                        </p>
                      ))}
                      <TagPrime
                        className='text-[10px] text-white bg-slate-600'
                        value={`+${post.tags.length - 3}`}
                        rounded
                      />
                    </li>
                  ) : (
                    post.tags.map((tag) => (
                      <li className='text-xs' key={tag.id}>
                        {tag.name}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
