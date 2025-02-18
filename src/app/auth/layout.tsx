import React from 'react'

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background text-white'>
      <div className='w-full max-w-md p-8 space-y-8'>{children}</div>
    </div>
  )
}

export default AuthLayout
