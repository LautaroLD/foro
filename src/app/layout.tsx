import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { ToastContainer } from 'react-toastify'
import { SessionAuthProvider } from '@/context/SessionProvider'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Redactiva',
  description: 'Redactiva, el foro de los redactores',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SessionAuthProvider>
      <html lang='es'>
        <body
          className={` ${roboto.className} antialiased bg-slate-950  flex flex-col min-h-dvh min-w-dvw max-h-dvh max-w-dvw `}
        >
          <ToastContainer theme='dark' autoClose={1500} />
          <Header />
          {children}
        </body>
      </html>
    </SessionAuthProvider>
  )
}
