'use client'
import PrincipalAside from '@/components/PrincipalAside'
import { ScrollTop } from 'primereact/scrolltop'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className=' md:grid  md:grid-cols-[auto_1fr] divide-slate-700 divide-x flex-grow overflow-y-hidden h-[calc(100vh-56px)]'>
      <PrincipalAside />
      <section className=' max-h-full h-full overflow-y-scroll'>
        {children}
        <ScrollTop
          target='parent'
          className='bg-white  rounded-full animate-pulse z-30 ml-auto'
          icon='pi pi-arrow-up font-bold  text-slate-900'
        />
      </section>
    </main>
  )
}
