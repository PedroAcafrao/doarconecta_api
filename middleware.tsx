import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/doacoes/:path*',
    '/profile/:path*',
    '/settings/:path*'

  ]
}
export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token || token === 'undefined') {
    console.log("sem token")
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { pathname } = req.nextUrl;

  if (pathname === '/doacoes') {
    console.log("Doacoes")
    // Example logic for the dashboard
    //return NextResponse.next();
    //return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();


}

// Roda o middleware apenas para essas rotas

//aqui voce vai colocar as rotas q vc quer proteger, ai ele ta falando que vai proteger a rota dashboard/ infinitas, ai vc adapta pra sua situacao