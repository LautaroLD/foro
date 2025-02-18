'use client'
import { navBarItems } from '@/constants'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { BiLogOut } from 'react-icons/bi'
export default function PrincipalAside() {
  const { data: session, status } = useSession()
  const user = session?.user
  if (status === 'loading')
    return (
      <aside className='col-span-1 text-white  space-y-2 px-2 py-4 hidden md:block'>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
        <div className='p-6 w-full bg-slate-600 animate-pulse rounded-lg'></div>
      </aside>
    )
  return (
    <aside className='col-span-1 text-white h-full  hidden md:block'>
      {!user ? (
        <div className='text-center space-y-3 p-4 lg:p-10'>
          <b className='text-xl'>
            Inicia sesión para tener una experiencia completa
          </b>
          <Link
            href='/auth/login'
            className='bg-slate-600 p-2 rounded-lg w-full hover:scale-105 transition-all flex justify-center'
          >
            Iniciar sesión
          </Link>
          <p>¿No tienes una cuenta?</p>
          <Link
            href='/auth/register'
            className='border p-2 rounded-lg w-full hover:scale-105 transition-all flex justify-center'
          >
            Registrarse
          </Link>
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
