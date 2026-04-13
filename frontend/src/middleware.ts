import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // 로그인 후에만 이용 가능한 페이지들 설정
  const isProtectedRoute =
    pathname.startsWith('/mypage') || pathname.startsWith('/cart');

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);

    return NextResponse.redirect(loginUrl);
  }

  /**
   * undefined가 반환되어도 Next가 알아서 다음 페이지로 넘겨주지만 (MainPage)
   * 공식 문서에는 명시적으로 next()를 선언하는 것을 권장함.
   */
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
