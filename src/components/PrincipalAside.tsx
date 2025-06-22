'use client'
import { navBarItems } from '@/constants'
import useWindowSize from '@/hooks/useWindowSize'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { BiLogOut } from 'react-icons/bi'
import { CiSquareChevLeft, CiSquareChevRight } from 'react-icons/ci'
import Button from './Button'
import { useState } from 'react'
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
      {openMenu ? (
        <CiSquareChevLeft
          className='absolute top-5 -right-[15px] text-3xl bg-slate-950 text-slate-600 hover:text-white cursor-pointer'
          onClick={() => setOpenMenu(!openMenu)}
        />
      ) : (
        <CiSquareChevRight
          className='absolute top-5 -right-[15px] text-3xl bg-slate-950 text-slate-600 hover:text-white cursor-pointer'
          onClick={() => setOpenMenu(!openMenu)}
        />
      )}

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
          </div>
        ) : (
          <ul className=' w-[20vw] flex flex-col  h-full'>
            {navBarItems.map((item) => (
              <li key={item.label}>
                <Link
                  className='p-3 w-full hover:bg-[#b94d25] flex items-center gap-2 rounded-lg'
                  href={item.url}
                >
                  <i className={item.icon} />
                  {item.label}
                </Link>
              </li>
            ))}

            <li
              className='p-3 w-full hover:bg-[#b94d25] flex items-center gap-2 mt-auto cursor-pointer rounded-lg'
              onClick={() => signOut()}
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
