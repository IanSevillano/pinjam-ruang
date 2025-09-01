
// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = [
  '/',
  '/login',
  '/api/roles', 
  '/register',
  '/forgot-password/:path*',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/verify',
  '/api/public/:path*' 
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for public paths
  const isPublicPath = publicPaths.some(publicPath => 
    pathname === publicPath || 
    (publicPath.endsWith('*') && pathname.startsWith(publicPath.slice(0, -2)))
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected paths
  const token = req.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify token
    const verifyRes = await fetch(`${req.nextUrl.origin}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!verifyRes.ok) {
      throw new Error('Token verification failed');
    }

    const { valid } = await verifyRes.json();
    
    if (!valid) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/choose-role",
    "/api/((?!public|auth).*)", // Protect all API except /api/public and /api/auth
  ],
};



// // middleware.ts

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// const publicPaths = [
//   '/',
//   '/login',
//   '/register',
//   '/forgot-password',
//   '/api/auth/login',
//   '/api/auth/register',
//   '/api/public:path*'
// ];
// export async function middleware(req: NextRequest) {
//     const token = req.cookies.get('token')?.value;

//     if (publicPaths.includes(req.nextUrl.pathname)) {
//         return NextResponse.next();
//     }

//     if (!token) {
//         return NextResponse.redirect(new URL('/login', req.url));
//     }

//     // Panggil API verify
//     const verifyRes = await fetch(`${req.nextUrl.origin}/api/auth/verify`, {
//         method: 'POST',
//         body: JSON.stringify({ token }),
//     });
//     const { valid } = await verifyRes.json();

//     if (!valid) {
//         return NextResponse.redirect(new URL('/login', req.url));
//     }

//     return NextResponse.next();
//     }

// export const config = {
//   matcher: ["/dashboard/:path*", "/choose-role", ],
// };


//untuk mencegah langsung lihat hasil api modal ganti link dikit
// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/choose-role",
//     "/api/:path*", // Tangkap semua API
//   ],
// };