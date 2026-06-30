import Header from '@/app/(main)/_components/HeaderDesktop';
import React from 'react';
import BottomTabBar from './_components/BottomTabBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-[485px] flex-col bg-white max-[1152px]:overflow-x-hidden">
      <Header />
      <main className="flex w-full flex-1 flex-col max-[1152px]:pb-[60px] min-[1152px]:pb-0">
        {children}
      </main>

      <footer className="border-t border-gray-100 bg-gray-50 p-[20px] text-center text-[13px] text-gray-500 max-[1152px]:hidden">
        본 프로젝트는 개인 프로젝트를 위헤 제작되었으며, 상업적인 목적은 일절
        없음을 명확히 밝힙니다.
      </footer>

      <div className="block min-[1152px]:hidden">
        <BottomTabBar />
      </div>
    </div>
  );
}
