'use client'
import CategoryPin from '@/components/CategoryPin'
import CommentsSection from '@/components/CommentsSection'
import LikeButtonPost from '@/components/LikeButtonPost'
import TagPin from '@/components/TagPin'
import { PostExtended } from '@/models/post.model'
import api from '@/services/config'
import { useQuery } from '@tanstack/react-query'
import MDEditor from '@uiw/react-md-editor'
// import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Avatar } from 'primereact/avatar'
import { Galleria } from 'primereact/galleria'
import { Image } from 'primereact/image'

// type Params = Promise<{ postId: string }>
// export async function generateMetadata({ params }: { params: Params }) {
//   const { postId } = await params
// }

export default function PostPage() {
  const params = useParams()
  const postId = params.postId

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data: post } = await api.get<PostExtended>(`/api/posts/${postId}`)

      return post
    },
  })

  if (isLoading)
    return (
      <aside className='col-span-1 text-white  space-y-2 px-2 py-4 hidden md:block'>
        <div className='p-8 w-2/3 bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-60 m-auto w-4/5 bg-slate-600 animate-pulse rounded-lg'></div>
      </aside>
    )
  if (error) return <div>Error loading post</div>

  if (!post) return <div>Post not found</div>
  console.log(post)

  return (
    <article className='p-4'>
      <section className='  text-white space-y-2'>
        <div className='space-y-2 p-4 border rounded-lg w-full md:w-2/3 m-auto'>
          <p className='text-xl font-semibold break-all text-center'>
            {post.title}
          </p>
          <p className='text-center text-sm'>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        {post.categories && (
          <ul className='flex gap-2 list-none justify-center'>
            {post.categories.map((category) => (
              <CategoryPin category={category} key={category.id} />
            ))}
          </ul>
        )}
        {post.tags && (
          <ul className='flex gap-2 list-none justify-center '>
            {post.tags.map((tag) => (
              <TagPin tag={tag} key={tag.id} />
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
            <b>
              {post.author.firstName} {post.author.lastName}
            </b>
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
          <Galleria
            value={post.files}
            circular
            showItemNavigators
            showItemNavigatorsOnHover
            showIndicators
            showThumbnails={false}
            item={(item) => {
              console.log(item)

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
