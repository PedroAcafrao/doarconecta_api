import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/doacoes/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/',
    '/login',
    '/registrar'


  ]
}
export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  
  if (token && req.url.includes('login') == true ){
    
    return NextResponse.redirect(new URL('/',req.nextUrl.origin))
  }
  if (token && req.url.includes('registrar') == true ){
    
    return NextResponse.redirect(new URL('/',req.nextUrl.origin))
  }
  if (!token || token === 'undefined' ) {
    if (req.url.includes('login') == true ||req.url.includes('registrar') == true){
      return NextResponse.next();
    }
    
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();


}

// Roda o middleware apenas para essas rotas

//aqui voce vai colocar as rotas q vc quer proteger, ai ele ta falando que vai proteger a rota dashboard/ infinitas, ai vc adapta pra sua situacao