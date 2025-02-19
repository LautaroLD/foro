import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/favicon.ico',
  '/_next/static',
  '/public',
  '/',
] // Define your public routes here

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('__Secure-next-auth.session-token')
  const { pathname } = request.nextUrl

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
export const config = {
  matcher: ['/profile', '/settings', '/help', '/create-post'],
}
