'use client'
import Button from '@/components/Button'
import CategoryPin from '@/components/CategoryPin'
import CommentsSection from '@/components/CommentsSection'
import LikeButtonPost from '@/components/LikeButtonPost'
import TagPin from '@/components/TagPin'
import { PostExtended } from '@/models/post.model'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import MDEditor from '@uiw/react-md-editor'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
// import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Avatar } from 'primereact/avatar'
import { Carousel } from 'primereact/carousel'
import { Image } from 'primereact/image'
import { IoSettingsSharp } from 'react-icons/io5'

export default function PostPage() {
  const { data: session } = useSession()
  const user = session?.user
  const params = useParams()
  const postId = params.postId

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const { data: post } = await api.get<PostExtended>(`/api/posts/${postId}`)

      return post
    },
  })

  if (isLoading)
    return (
      <aside className='col-span-1 text-white  space-y-2 m-6 hidden md:block'>
        <div className='p-8 w-2/3 bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-60 m-auto w-4/5 bg-slate-600 animate-pulse rounded-lg'></div>
      </aside>
    )
  if (error) return <div>Error loading post</div>

  if (!post) return <div>Post not found</div>

  return (
    <article className='p-6'>
      <section className='  text-white space-y-2'>
        <div className='gap-2 p-4 border flex flex-col rounded-lg w-full md:w-4/5 m-auto'>
          <p className='text-xl font-semibold break-all text-center'>
            {post.title}
          </p>
          <p className='text-center text-sm'>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          {user && post.author.id === user?.id && (
            <Link href={`/post/${post.id}/settings`} className='w-fit ml-auto'>
              <Button className='w-fit' primary>
                <IoSettingsSharp size={30} className='p-1' />
              </Button>
            </Link>
          )}
        </div>
        {post.categories && (
          <ul className='flex gap-2 list-none justify-center flex-wrap'>
            {post.categories.map((category) => (
              <li key={category.id}>
                <Link href={`/categories/${category.slug}`}>
                  <CategoryPin category={category} />
                </Link>
              </li>
            ))}
          </ul>
        )}
        {post.tags && (
          <ul className='flex gap-2 list-none justify-center flex-wrap'>
            {post.tags.map((tag) => (
              <li key={tag.id}>
                <Link href={`/tags/${tag.slug}`}>
                  <TagPin tag={tag} />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className='flex gap-2 items-center '>
          <div>
            <Avatar
              label={`${post.author.firstName[0]} ${post.author.lastName[0]}`}
              size='large'
              shape='circle'
            />
          </div>
          <div>
            <Link href={`/user/${post.author.id}`} className='font-bold'>
              {post.author.firstName} {post.author.lastName}
            </Link>
            <p>{post.author.email}</p>
          </div>
        </div>
      </section>
      <section className='w-full md:w-5/6 m-auto py-4 text-white'>
        {post.typeContent === 'text' && post.content && (
          <MDEditor.Markdown
            source={post.content}
            style={{ backgroundColor: 'transparent' }}
          />
        )}
        {post.typeContent === 'image' && (
          <Carousel
            value={post.files}
            numScroll={1}
            circular
            numVisible={1}
            itemTemplate={(item) => {
              return (
                <div className=' h-[300px] w-full'>
                  {item.type.includes('image') ? (
                    <Image
                      preview
                      src={item.src}
                      alt={post.files.findIndex((f) => f === item).toString()}
                      style={{ height: '100%', width: '100%' }}
                      imageStyle={{
                        height: '100%',
                        objectFit: 'contain',
                        margin: 'auto',
                      }}
                    />
                  ) : (
                    <video
                      src={item.src}
                      controls
                      className='h-full w-full  m-auto'
                    />
                  )}
                </div>
              )
            }}
          />
        )}
      </section>
      <section className='w-5/6 m-auto py-4 text-white'>
        <LikeButtonPost post={post} />
      </section>
      <CommentsSection post={post} />
    </article>
  )
}
