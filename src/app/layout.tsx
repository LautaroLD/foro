import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/Header'
import { ToastContainer } from 'react-toastify'
import { SessionAuthProvider } from '@/context/SessionProvider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950  flex flex-col min-h-dvh min-w-dvw max-h-dvh max-w-dvw `}
        >
          <ToastContainer theme='dark' autoClose={1200} />
          <Header />
          {children}
        </body>
      </html>
    </SessionAuthProvider>
  )
}
