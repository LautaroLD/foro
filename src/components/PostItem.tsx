'use client'
import { PostExtended } from '@/models/post.model'
import MDEditor from '@uiw/react-md-editor'
import Link from 'next/link'
import { BiComment } from 'react-icons/bi'
import CategoryPin from './CategoryPin'
import TagPin from './TagPin'
import { Avatar } from 'primereact/avatar'
import { Galleria } from 'primereact/galleria'
import Image from 'next/image'
import LikeButtonPost from './LikeButtonPost'

export default function PostItem({ post }: { post: PostExtended }) {
  return (
    <li className='p-4 bg-slate-700 rounded-lg shadow-md hover:bg-slate-800 transition-all w-full  text-white space-y-2'>
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
              <p className='text-sm overflow-hidden text-ellipsis'>
                {post.author?.email}
              </p>
            </div>
          </div>
        </div>
        <p className='text-xs '>
          {new Date(post.createdAt).toLocaleDateString()} -{' '}
          {new Date(post.createdAt).toLocaleTimeString()}
        </p>
        <h2 className='text-lg md:text-xl font-semibold break-all'>
          {post.title}
        </h2>
        {post.categories.length > 0 && (
          <ul className='flex gap-2 list-none flex-wrap'>
            {post.categories.map((category) => (
              <CategoryPin category={category} key={category.id} />
            ))}
          </ul>
        )}
        {post.tags.length > 0 && (
          <ul className='flex gap-2 list-none flex-wrap'>
            {post.tags.map((tag) => (
              <TagPin tag={tag} key={tag.id} />
            ))}
          </ul>
        )}

        {post.typeContent === 'text' && post.content && (
          <MDEditor.Markdown
            source={
              post.content.length > 300
                ? post.content.slice(0, 300) + '...'
                : post.content
            }
            style={{ backgroundColor: 'transparent' }}
          />
        )}
        {post.typeContent === 'image' && (
          <Galleria
            value={post.files}
            circular
            showItemNavigators
            showItemNavigatorsOnHover
            showIndicators
            showThumbnails={false}
            item={(item) => {
              return (
                <div className='bg-black bg-opacity-40 rounded-lg overflow-hidden h-[300px] w-full'>
                  {item.type.includes('image') ? (
                    <Image
                      src={item.src}
                      alt={post.files.findIndex((f) => f === item).toString()}
                      fill
                      objectFit='contain'
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
        <p className='flex gap-1 items-center hover:bg-slate-500 p-1 rounded-lg  cursor-pointer'>
          <LikeButtonPost post={post} />
        </p>
        <Link
          href={`/post/${post.id}`}
          className='flex gap-1 items-center hover:bg-slate-500 p-1 rounded-lg  cursor-pointer'
        >
          <BiComment />
          {post.comments.length}
        </Link>
      </div>
    </li>
  )
}
