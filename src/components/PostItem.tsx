'use client'
import { PostExtended } from '@/models/post.model'
import MDEditor from '@uiw/react-md-editor'
import Link from 'next/link'
import { BiComment } from 'react-icons/bi'
import CategoryPin from './CategoryPin'
import TagPin from './TagPin'
import Image from 'next/image'
import LikeButtonPost from './LikeButtonPost'
import { Carousel } from 'primereact/carousel'
import { Tag } from 'primereact/tag'
import { FaUserCircle } from 'react-icons/fa'
export default function PostItem({ post }: { post: PostExtended }) {
  return (
    <li className='px-6 py-4 w-full text-white space-y-2'>
      <Link href={`/post/${post.id}`} className='space-y-2'>
        <div>
          <div className='flex gap-1'>
            <span className='relative w-14 h-14 rounded-full overflow-hidden'>
              {post.author?.image ? (
                <Image
                  fill
                  className='rounded-full border-slate-500 border'
                  src={post.author?.image as string}
                  alt={`${post.author?.firstName} ${post.author?.lastName}`}
                />
              ) : (
                <FaUserCircle className='w-full h-full' />
              )}
            </span>

            <div className='flex flex-col justify-center'>
              <b className='text-sm overflow-hidden text-ellipsis'>
                {post.author?.firstName} {post.author?.lastName}
              </b>
              <p className='text-xs '>
                {new Date(post.createdAt).toLocaleDateString()} -{' '}
                {new Date(post.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <h2 className='text-lg md:text-xl font-semibold break-all break-words'>
          {post.title}
        </h2>
        {post.categories.length > 0 && (
          <ul className='flex gap-1 list-none flex-wrap'>
            {post.categories.length > 3 ? (
              <>
                {post.categories.slice(0, 3).map((category) => (
                  <li key={category.id}>
                    <CategoryPin category={category} />
                  </li>
                ))}
                <li>
                  <Tag
                    className='text-xs text-white bg-slate-600'
                    value={`+${post.categories.length - 3}`}
                    rounded
                  />
                </li>
              </>
            ) : (
              post.categories.map((category) => (
                <li key={category.id}>
                  <CategoryPin category={category} />
                </li>
              ))
            )}
          </ul>
        )}
        {post.tags.length > 0 && (
          <ul className='flex gap-1 list-none flex-wrap'>
            {post.tags.length > 3 ? (
              <>
                {post.tags.slice(0, 3).map((tag) => (
                  <li key={tag.id}>
                    <TagPin tag={tag} />
                  </li>
                ))}
                <li>
                  <Tag
                    className='text-xs text-white bg-slate-600'
                    value={`+${post.tags.length - 3}`}
                    rounded
                  />
                </li>
              </>
            ) : (
              post.tags.map((tag) => (
                <li key={tag.id}>
                  <TagPin tag={tag} />
                </li>
              ))
            )}
          </ul>
        )}

        {post.typeContent === 'text' && post.content && (
          <MDEditor.Markdown
            disallowedElements={['a']}
            skipHtml
            components={{
              h1: ({ children }) => (
                <p className='text-lg font-bold'>{children}</p>
              ),
            }}
            source={
              post.content.length > 350
                ? post.content.slice(0, 350) + '...'
                : post.content
            }
            style={{ backgroundColor: 'transparent' }}
          />
        )}
        {post.typeContent === 'image' && (
          <Carousel
            value={post.files}
            showIndicators={post.files.length > 1 ? true : false}
            showNavigators={post.files.length > 1 ? true : false}
            numScroll={1}
            circular
            numVisible={1}
            itemTemplate={(item) => {
              return (
                <div className='bg-black bg-opacity-40 rounded-lg overflow-hidden aspect-video w-full relative'>
                  {item.type.includes('image') ? (
                    <Image
                      quality={50}
                      src={item.src}
                      alt={post.files.findIndex((f) => f === item).toString()}
                      fill
                      sizes='10%'
                      className='object-contain'
                      priority
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
      </Link>

      <div className='flex gap-4'>
        <LikeButtonPost post={post} />
        <div className='flex gap-1 items-center'>
          <BiComment />
          {post.comments.length}
        </div>
      </div>
    </li>
  )
}
