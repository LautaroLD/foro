'use client'
import Link from 'next/link'
import Search from './Search'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { navBarItems } from '@/constants'
import { useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { PrimeIcons } from 'primereact/api'
import useWindowSize from '@/hooks/useWindowSize'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()
  const user = session?.user
  const screenWidth = useWindowSize()

  const menuLeft = useRef<null | Menu>(null)
  return (
    <header className='bg-slate-700 text-white shadow-md w-full min-h-14 grid grid-cols-2 px-4'>
      <div className='w-full flex  h-full max-w-[180px] '>
        {screenWidth.width && screenWidth.width >= 768 && (
          <Link className='h-full relative w-[200px]' href='/'>
            <Image src={'/logo.svg'} fill alt='logo' className='invert' />
          </Link>
        )}
        {screenWidth.width && screenWidth.width < 768 && (
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
              icon='pi pi-chevron-down'
              className='flex flex-row-reverse gap-2  h-full w-full'
              onClick={(event) =>
                menuLeft.current && menuLeft.current.toggle(event)
              }
              aria-controls='popup_menu_left'
              aria-haspopup
            >
              <Link className='h-full w-full relative' href='/'>
                <Image src={'/logo.svg'} fill alt='logo' className='invert' />
              </Link>
            </Button>
          </>
        )}
      </div>
      <Search />
    </header>
  )
}
