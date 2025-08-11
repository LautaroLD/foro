'use client'
import { navBarItems } from '@/constants'
import useWindowSize from '@/hooks/useWindowSize'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { BiLogOut } from 'react-icons/bi'
import { RiMenuUnfold4Line } from 'react-icons/ri'

import Button from './Button'
import { useState } from 'react'
import ItemNavbar from './ItemNavbar'
export default function PrincipalAside() {
  const [openMenu, setOpenMenu] = useState(true)
  const screenWidth = useWindowSize()
  const { data: session, status } = useSession()
  if (screenWidth.width && screenWidth.width < 768) return null
  const user = session?.user
  if (status === 'loading')
    return (
      <aside className={`w-auto relative p-4 hidden lg:flex`}>
        <div className='w-[20vw] flex flex-col gap-4'>
          <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
          <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
          <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
          <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
          <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        </div>
      </aside>
    )

  return (
    <aside className={`w-auto relative p-4 `}>
      <RiMenuUnfold4Line
        className={`absolute top-4 -right-[15px] text-3xl bg-slate-950 text-slate-600 hover:text-white cursor-pointer rounded-lg  ${
          openMenu ? 'rotate-0' : 'rotate-180'
        } `}
        onClick={() => setOpenMenu(!openMenu)}
      />
      <section
        className={`${
          openMenu ? 'w-[20vw]' : 'w-[0vw]'
        } overflow-hidden  text-white transition-all duration-300 ease-in-out h-full`}
      >
        {!user ? (
          <div className='text-center space-y-3 w-[20vw]'>
            <b className='text-xl'>
              Inicia sesión para tener una experiencia completa
            </b>
            <Button primary className='flex'>
              <Link href='/auth/login' className='w-full h-full p-2'>
                Iniciar sesión
              </Link>
            </Button>
            <p>¿No tienes una cuenta?</p>
            <Button className='flex'>
              <Link href='/auth/register' className='w-full h-full p-2'>
                Registrarse
              </Link>
            </Button>
            <ul className='flex flex-col border-t border-slate-600 mt-4 py-1'>
              {navBarItems.map(
                (item) =>
                  !item.private && <ItemNavbar key={item.label} item={item} />
              )}
            </ul>
          </div>
        ) : (
          <ul className=' w-[20vw] flex flex-col  h-full'>
            {navBarItems.map((item) => (
              <ItemNavbar key={item.label} item={item} />
            ))}

            <li
              className='p-3 w-full hover:bg-[#b94d25] flex items-center gap-2 mt-auto cursor-pointer rounded-lg'
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <BiLogOut size={20} />
              Salir
            </li>
          </ul>
        )}
      </section>
    </aside>
  )
}
