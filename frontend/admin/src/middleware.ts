import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ACCESS_TOKEN, DASHBOARD_PATH, LOGIN_PATH, REGISTER_PATH } from './constants';

export function middleware(request: NextRequest) {
  // ดึง token จาก cookie
  const token = request.cookies.get(ACCESS_TOKEN)?.value;

  // กำหนด path ที่ไม่ต้อง Login ก็เข้าได้
  const publicPaths = [LOGIN_PATH, REGISTER_PATH];

  // เช็คว่า user กำลังจะเข้า path ไหน
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // กรณี 1: ถ้ามี Token แล้วยังพยายามเข้าหน้า Login -> ดีดไปหน้า Dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  // กรณี 2: ถ้าไม่มี Token และกำลังจะเข้าหน้า Private (Dashboard) -> ดีดไป Login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // ถ้าถูกต้องแล้ว ให้ผ่านไปได้
  return NextResponse.next();
}

// กำหนดว่า Middleware นี้จะทำงานกับ Path ไหนบ้าง
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};