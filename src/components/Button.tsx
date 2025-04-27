import React from 'react'
import { LuLoader } from 'react-icons/lu'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
  primary?: boolean
}
export default function Button({
  loading,
  children,
  primary,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={` ${
        primary ? 'bg-[#b94d25]' : 'bg-transparent border border-[#b94d25]'
      }  text-white rounded-lg hover:bg-opacity-70 w-full font-bold text-lg flex justify-center items-center max-w-sm mx-auto ${
        props?.className
      }`}
      name='button'
    >
      {loading ? (
        <LuLoader className='animate-spin mx-auto m-2' size={28} />
      ) : (
        <>{children}</>
      )}
    </button>
  )
}
