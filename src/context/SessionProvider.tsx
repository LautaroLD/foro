'use client'
import { SessionProvider } from 'next-auth/react'
import { QueryProvider } from './QueryProvider'

import { PrimeReactProvider } from 'primereact/api'

interface Props {
  children: React.ReactNode
}

export function SessionAuthProvider({ children }: Props) {
  return (
    <QueryProvider>
      <SessionProvider>
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </SessionProvider>
    </QueryProvider>
  )
}
