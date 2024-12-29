import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/(auth)')
  const isApiRequest = request.nextUrl.pathname.startsWith('/api')

  if (!isApiRequest) {
    if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}