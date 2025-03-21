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
        primary ? 'bg-[#FF6F3C]' : 'bg-transparent border border-[#FF6F3C]'
      }  text-white rounded-lg hover:bg-opacity-70 w-full text-lg flex justify-center items-center ${
        buttonProps?.className
      }`}
    >
      {loading ? (
        <LuLoader className='animate-spin mx-auto m-2' size={28} />
      ) : (
        <>{children}</>
      )}
    </button>
  )
}
