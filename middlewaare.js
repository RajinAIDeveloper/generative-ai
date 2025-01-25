// middleware.ts
import { NextResponse } from 'next/server'


export const config = {
  matcher: '/api/:path*',
}

export const runtime = 'edge'

export function middleware(request) {
  return NextResponse.next()
}