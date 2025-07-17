import React from 'react'
import prisma from '@/libs/prisma'

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
  })
  if (!tag) return { notFound: true }
  return { props: { tag } }
}
export default function TagNameTitle({ tag }: { tag?: { name: string } }) {
  return <div>{tag?.name}</div>
}
