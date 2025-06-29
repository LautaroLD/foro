'use client'
import { PostExtended } from '@/models/post.model'
import MDEditor from '@uiw/react-md-editor'
import Link from 'next/link'
import { BiComment } from 'react-icons/bi'
import CategoryPin from './CategoryPin'
import TagPin from './TagPin'
import { Avatar } from 'primereact/avatar'
import Image from 'next/image'
import LikeButtonPost from './LikeButtonPost'
import { Carousel } from 'primereact/carousel'
import { Tag } from 'primereact/tag'

export default function PostItem({ post }: { post: PostExtended }) {
  return (
    <li className='px-6 py-4 w-full text-white space-y-2'>
      <Link href={`/post/${post.id}`} className='space-y-2'>
        <div>
          <div className='flex gap-1'>
            <div className='m-0'>
              <Avatar
                label={`${post.author.firstName[0]}${post.author.lastName[0]}`}
                size='large'
                shape='circle'
              />
            </div>
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
