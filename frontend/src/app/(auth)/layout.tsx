import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-pretendard bg-white">
      {/* Auth 공통 헤더 (네이버 로고와 언어 선택기 등) */}
      <header></header>

      {/* Auth 컨텐츠 영역 (로그인 폼, 회원가입, 등) */}
      <main>{children}</main>

      <footer></footer>
    </div>
  );
}
