'use client'
import PrincipalAside from '@/components/PrincipalAside'
import TagsTrends from '@/components/Trends'
import useWindowSize from '@/hooks/useWindowSize'
import { ScrollTop } from 'primereact/scrolltop'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { width } = useWindowSize()
  return (
    <main className=' md:grid  md:grid-cols-5 divide-slate-700 divide-x flex-grow overflow-y-hidden h-[calc(100vh-56px)]'>
      <PrincipalAside />
      <section className='col-span-3 max-h-full h-full overflow-y-scroll'>
        {children}
        <ScrollTop
          target='parent'
          className='bg-white  rounded-full animate-pulse z-30 ml-auto'
          icon='pi pi-arrow-up font-bold  text-slate-900'
        />
      </section>
      {width && width > 768 && <TagsTrends />}
    </main>
  )
}
