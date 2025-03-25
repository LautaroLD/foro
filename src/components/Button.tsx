import React from 'react'
import { LuLoader } from 'react-icons/lu'
interface ButtonProps {
  loading?: boolean
  children: React.ReactNode
  primary?: boolean
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
}
export default function Button({
  loading,
  children,
  primary,
  buttonProps,
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      className={` ${
        primary ? 'bg-[#b94d25]' : 'bg-transparent border border-[#b94d25]'
      }  text-white rounded-lg hover:bg-opacity-70 w-full font-bold text-lg flex justify-center items-center ${
        buttonProps?.className
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
