'use client'
import Link from 'next/link'
import Search from './Search'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { navBarItems } from '@/constants'
import { useEffect, useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { PrimeIcons } from 'primereact/api'

export default function Header() {
  const [screenWidth, setScreenWidth] = useState(0)
  const { data: session } = useSession()
  const user = session?.user
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuLeft = useRef<null | Menu>(null)
  return (
    <header className='bg-slate-700 text-white shadow-md w-full min-h-14 grid grid-cols-2 sm:grid-cols-3 px-4'>
      <div className='container mx-auto flex justify-between items-center h-full '>
        {screenWidth >= 768 && (
          <Link className='p-2 font-bold text-2xl' href='/'>
            My App
          </Link>
        )}
        {screenWidth < 768 && (
          <>
            <Menu
              model={
                user
                  ? [
                      ...navBarItems,
                      {
                        label: 'Cerrar sesión',
                        icon: PrimeIcons.SIGN_OUT,
                        command: () => signOut(),
                      },
                    ]
                  : [
                      {
                        label: 'Inicio',
                        url: '/',
                        icon: PrimeIcons.HOME,
                      },
                      {
                        label: 'Iniciar sesión',
                        url: '/auth/login',
                        icon: PrimeIcons.SIGN_IN,
                      },
                      {
                        label: 'Registrarse',
                        url: '/auth/register',
                        icon: PrimeIcons.USER_PLUS,
                      },
                    ]
              }
              popup
              ref={menuLeft}
              id='popup_menu_left'
            />
            <Button
              label='My App'
              icon='pi pi-chevron-down'
              className='flex flex-row-reverse gap-2 items-center p-2 font-bold text-2xl'
              onClick={(event) =>
                menuLeft.current && menuLeft.current.toggle(event)
              }
              aria-controls='popup_menu_left'
              aria-haspopup
            />
          </>
        )}
      </div>
      <Search />
    </header>
  )
}
