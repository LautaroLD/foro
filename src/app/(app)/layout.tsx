import PrincipalAside from '@/components/PrincipalAside'
import UsersMostActive from '@/components/UsersMostActive'
import { ScrollTop } from 'primereact/scrolltop'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className=' md:grid  md:grid-cols-5 divide-slate-700 divide-x flex-grow overflow-y-hidden h-[calc(100vh-56px)]'>
      <PrincipalAside />
      <section className='col-span-3 max-h-full h-full overflow-y-scroll'>
        {children}
        <ScrollTop className='bg-white p-2 rounded-full animate-pulse' />
      </section>
      <UsersMostActive />
    </main>
  )
}
