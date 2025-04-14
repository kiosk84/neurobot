import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp } from 'firebase-admin/app'

// Инициализация Firebase Admin
const app = initializeApp()
const auth = getAuth(app)

export async function middleware(request: NextRequest) {
  // Проверяем защищенные пути
  if (request.nextUrl.pathname.startsWith('/settings') || 
      request.nextUrl.pathname.startsWith('/smm')) {
      
    const sessionCookie = request.cookies.get('session')?.value

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      // Проверяем сессию через Firebase Admin
      await auth.verifySessionCookie(sessionCookie)
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/settings/:path*', '/smm/:path*']
}
