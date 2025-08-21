import React from 'react'
import { RiLoader5Line } from 'react-icons/ri'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
  primary?: boolean
  unStyled?: boolean
  size?: 'sm' | 'lg'
}
export default function Button({
  loading,
  children,
  primary,
  size,
  unStyled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading}
      className={` ${
        primary ? 'bg-[#b94d25]' : 'bg-transparent border border-[#b94d25]'
      } ${
        !unStyled &&
        `text-white rounded-lg hover:opacity-70  font-bold text-lg  h-fit  disabled:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-60 ${
          size === 'sm' ? 'p-1 w-fit' : 'p-2 w-full'
        }`
      }  ${props?.className}`}
      name='button'
    >
      {loading ? (
        <RiLoader5Line className='animate-spin mx-auto' size={28} />
      ) : (
        <>{children}</>
      )}
    </button>
  )
}
