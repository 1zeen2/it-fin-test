'use client';

import IconCategory from '@/components/common/icons/IconCategory';
import IconHome from '@/components/common/icons/IconHome';
import IconMyShopping from '@/components/common/icons/IconMyShopping';
import IconSearch from '@/components/common/icons/IconSearch';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/feature/auth/AuthContext';
import React from 'react';

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const isHome = pathname === '/';
  const isCategory = pathname === '/category';
  const isMyShopping = pathname === '/myshopping';

  const handleMyShoppingClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/login?returnUrl=/myshopping');
    }
  };

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-50 flex h-[56px] justify-center bg-white shadow-[inset_0_1px_0_0_#e8ecef]">
      <div className="flex h-full w-full max-w-[568px] justify-between">
        {/* 홈 아이콘 */}
        <Link
          href="/"
          className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212]"
        >
          <IconHome isActive={isHome} className="h-[24px] w-[24px]" />

          <span
            className={`flex items-center tracking-[-0.033px] ${isHome ? 'text-[13px] font-extrabold' : 'text-[11px]'}`}
          >
            홈
          </span>
        </Link>

        {/* 카테고리 아이콘 */}
        <Link
          href="/category"
          className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212] select-none"
        >
          <IconCategory isActive={isCategory} className="h-[24px] w-[24px]" />

          <span
            className={`flex items-center tracking-[-0.033px] transition-all ${
              isCategory ? 'text-[13px] font-extrabold' : 'text-[11px]'
            }`}
          >
            카테고리
          </span>
        </Link>

        {/* 검색 아이콘 */}
        <a
          href="https://shopping.naver.com/ns/home#SMART_STORE_SEARCH_LAYER"
          className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212] select-none"
        >
          <IconSearch className="h-[24px] w-[24px]" />

          <span className="flex items-center text-[11px] leading-[13px] font-bold tracking-[-.033px]">
            검색
          </span>
        </a>

        {/* 마이쇼핑 아이콘 */}
        <Link
          href="/myshopping"
          onClick={handleMyShoppingClick}
          className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212] select-none"
        >
          <IconMyShopping
            isActive={isMyShopping}
            className="h-[24px] w-[24px]"
          />

          <span
            className={`flex items-center tracking-[-0.033px] ${
              isMyShopping
                ? 'text-[13px] font-extrabold'
                : 'text-[11px] font-bold'
            }`}
          >
            마이쇼핑
          </span>
        </Link>

        {/* 세로 구분선 */}
        <div className="h-[40px] w-[1px] shrink-0 self-center bg-[#e6e6ea]"></div>

        {/* 네이버 아이콘 */}
        <button className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="#03C75A" rx="5.4"></rect>
            <path
              fill="#fff"
              d="M14.67 11.77l-3.885-5.61a.375.375 0 00-.308-.16H7.594a.234.234 0 00-.235.234v10.313c0 .13.105.234.235.234h3.001c.13 0 .235-.105.235-.234V11.01l3.885 5.609c.07.1.185.161.308.161h2.883c.13 0 .235-.105.235-.234V6.234A.234.234 0 0017.906 6h-3.001a.234.234 0 00-.235.234v5.536z"
            ></path>
          </svg>
          <span className="flex items-center text-[11px] leading-[13px] tracking-[-.033px] text-[#121212]">
            네이버
          </span>
        </button>
      </div>
    </div>
  );
}
