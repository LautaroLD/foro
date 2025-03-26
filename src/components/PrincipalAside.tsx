'use client'
import { navBarItems } from '@/constants'
import useWindowSize from '@/hooks/useWindowSize'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { BiLogOut } from 'react-icons/bi'
import Button from './Button'
export default function PrincipalAside() {
  const screenWidth = useWindowSize()
  const { data: session, status } = useSession()
  if (screenWidth.width && screenWidth.width < 768) return null
  const user = session?.user
  if (status === 'loading')
    return (
      <aside className=' text-white  space-y-2 px-2 py-4 hidden md:block'>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
      </aside>
    )

  return (
    <aside className='w-[25vw] text-white   hidden md:block'>
      {!user ? (
        <div className='text-center space-y-3 p-4 lg:p-10'>
          <b className='text-xl'>
            Inicia sesión para tener una experiencia completa
          </b>
          <Button primary>
            <Link href='/auth/login' className='w-full h-full p-2'>
              Iniciar sesión
            </Link>
          </Button>
          <p>¿No tienes una cuenta?</p>
          <Button>
            <Link href='/auth/register' className='w-full h-full p-2'>
              Registrarse
            </Link>
          </Button>
        </div>
      ) : (
        <ul className=' divide-y divide-slate-600 w-full flex flex-col  h-full'>
          {navBarItems.map((item) => (
            <li key={item.label}>
              <Link
                className='p-3 w-full hover:bg-slate-600 flex items-center gap-2'
                href={item.url}
              >
                <i className={item.icon} />
                {item.label}
              </Link>
            </li>
          ))}

          <li
            className='p-3 w-full hover:bg-slate-600 flex items-center gap-2 mt-auto cursor-pointer'
            onClick={() => signOut()}
          >
            <BiLogOut size={20} />
            Salir
          </li>
        </ul>
      )}
    </aside>
  )
}
