import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function ItemNavbar({
  item,
}: {
  item: { label: string; url: string; icon: string }
}) {
  const path = usePathname()
  return (
    <Link
      className={
        'p-3 w-full hover:bg-[#b94d25] flex items-center gap-2 rounded-lg my-1' +
        (path === item.url ? ' bg-[#b94d25]' : '')
      }
      href={item.url}
    >
      <i className={item.icon} />
      {item.label}
    </Link>
  )
}
