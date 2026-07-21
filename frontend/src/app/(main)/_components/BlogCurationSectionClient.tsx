'use client';

import { useState, useCallback } from 'react';
import BlogCurationCard from './BlogCurationCard';
import type { BlogCuration } from '@/types/product';
import { useLoginAlertModal } from '@/feature/auth/LoginAlertModalContext';
import { useAuth } from '@/feature/auth/AuthContext';
import IconChevron from '@/components/common/icons/IconChevron';

interface BlogCurationSectionClientProps {
  initialCurations: BlogCuration[];
}

export default function BlogCurationSectionClient({
  initialCurations,
}: BlogCurationSectionClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.max(
    1,
    Math.ceil(initialCurations.length / itemsPerPage),
  );
  const [wishList, setWishList] = useState<number[]>([]);

  const { openLoginAlertModal } = useLoginAlertModal();
  const { isLoggedIn } = useAuth();

  const handleWishClick = useCallback(
    (productId: number) => {
      if (!isLoggedIn) {
        openLoginAlertModal();
        return;
      }
      setWishList((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );
    },
    [isLoggedIn, openLoginAlertModal],
  );

  return (
    <section className="flex w-full items-center justify-center border-b border-[#e8ecef] py-[40px] max-[1152px]:pt-[30px] max-[1152px]:pb-[29px]">
      <div className="flex w-full max-w-[1280px] flex-col gap-[24px] max-[1365px]:w-[960px] max-[1152px]:w-full max-[1152px]:gap-[15px]">
        {/* 타이틀 영역 */}
        <div className="flex flex-col justify-center gap-[6px] tracking-[-.5px] max-[1152px]:gap-[3px] max-[1152px]:px-[16px]">
          <h2 className="text-[24px] leading-[32px] font-bold text-[#000000] max-[1152px]:text-[18px] max-[1152px]:leading-[26px]">
            인기 <span className="text-[#7346f3]">패션</span> 블로그와 함께 찾는
            상품
          </h2>
          <p className="text-[15px] leading-[20px] font-normal text-[#757575] max-[1152px]:text-[13px] max-[1152px]:leading-[18px]">
            최근 7일간{' '}
            <span className="mr-[5.5px] text-[#121212] max-[1152px]:mr-[2px]">
              패션
            </span>
            분야 클릭 많은 블로그
          </p>
        </div>

        {/* pc버전 전용 레이아웃 (1x2) */}
        <div className="grid w-full grid-cols-2 gap-[16px] max-[1152px]:hidden">
          {initialCurations
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((curation) => (
              <BlogCurationCard
                key={curation.id}
                curation={curation}
                wishList={wishList}
                onWishClick={handleWishClick}
              />
            ))}
        </div>

        {/* 모바일 전용 레이아웃 (1x5) */}
        <div className="hidden max-[1152px]:flex max-[1152px]:w-full max-[1152px]:gap-[12px] max-[1152px]:overflow-x-auto max-[1152px]:px-[16px] max-[1152px]:pb-[10px] [&::-webkit-scrollbar]:hidden">
          {initialCurations.map((curation) => (
            <div
              key={`m-${curation.id}`}
              className="w-[372px] shrink-0 max-[768px]:w-[320px]"
            >
              <BlogCurationCard
                curation={curation}
                wishList={wishList}
                onWishClick={handleWishClick}
              />
            </div>
          ))}
        </div>

        {/* pc 전용 하단 페이지네이션 */}
        <div className="flex w-full items-center justify-center max-[1152px]:hidden">
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1))
            }
            className="flex items-center justify-center rounded-[8px] border border-[#d3dadf] bg-white px-[31px] py-[10.5px] text-[#121212] transition-colors hover:bg-[#f5f6f4]"
          >
            <IconChevron className="h-[17px] w-[16px] rotate-180" />
          </button>

          <span className="px-[43px] text-[16px] font-bold text-[#121212]">
            {currentPage}{' '}
            <span className="font-medium text-[#949494]">/ {totalPages}</span>
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1))
            }
            className="flex items-center justify-center rounded-[8px] border border-[#d3dadf] bg-white px-[31px] py-[10.5px] text-[#121212] transition-colors hover:bg-[#f5f6f4]"
          >
            <IconChevron className="h-[17px] w-[16px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
