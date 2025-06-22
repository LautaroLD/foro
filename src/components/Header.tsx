'use client'
import Link from 'next/link'
import Search from './Search'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { navBarItems } from '@/constants'
import { useRef, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { PrimeIcons } from 'primereact/api'
import useWindowSize from '@/hooks/useWindowSize'
import Image from 'next/image'

export default function Header() {
  const { data: session } = useSession()
  const user = session?.user
  const [menuOpen, setMenuOpen] = useState(false)
  const screenWidth = useWindowSize()

  const menuLeft = useRef<null | Menu>(null)

  return (
    <header className='bg-slate-700 text-white shadow-md w-full min-h-14 grid grid-flow-col px-4'>
      <div className='w-full flex  h-full max-w-[180px] '>
        {screenWidth.width && screenWidth.width >= 768 && (
          <Link className='h-full relative w-[150px] flex' href='/'>
            <Image src={'/logo_desktop.svg'} fill alt='logo' priority />
          </Link>
        )}
        {screenWidth.width && screenWidth.width < 768 && (
          <>
            <Menu
              onShow={() => {
                setMenuOpen(true)
              }}
              onHide={() => {
                setMenuOpen(false)
              }}
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
                        label: 'Tendencias',
                        url: '/trends',
                        icon: PrimeIcons.CHART_LINE,
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
              icon={`pi ${
                menuOpen ? 'pi-chevron-up' : 'pi-chevron-down'
              }  text-xl`}
              className='flex flex-row-reverse justify-end  gap-1  h-full w-full focus:shadow-none'
              onClick={(event) => {
                return menuLeft.current && menuLeft.current.toggle(event)
              }}
              aria-controls='popup_menu_left'
              aria-haspopup
            >
              <div className='h-full w-fit flex  '>
                <Image
                  src={'/logo_mobile.svg'}
                  width={30}
                  height={30}
                  alt='logo'
                  priority
                />
              </div>
            </Button>
          </>
        )}
      </div>
      <Search />
    </header>
  )
}
