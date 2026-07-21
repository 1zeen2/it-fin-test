'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TrendingKeywordData } from '@/types/display';

interface TrendingKeywordClientProps {
  initialKeywords: TrendingKeywordData[];
}

export default function TrendingKeywordClient({
  initialKeywords,
}: TrendingKeywordClientProps) {
  const [keywords] = useState(initialKeywords);
  const [currentPage, setCurrentPage] = useState(0);
  const itemPerPage = 5;

  const totalPages = Math.ceil(keywords.length / itemPerPage);
  const currentItems = keywords.slice(
    currentPage * itemPerPage,
    (currentPage + 1) * itemPerPage,
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));

  return (
    <div className="flex h-auto w-full items-center justify-center border-b border-[#e8ecef] py-[40px] max-[1152px]:py-[30px]">
      <div className="flex w-[1280px] flex-col justify-between gap-[20px] max-[1152px]:gap-[16px]">
        {/* 타이틀 영역 */}
        <div className="flex items-center gap-[6px] text-[24px] leading-[32px] font-bold tracking-[-.5px] text-[#111] max-[1152px]:gap-[4.5px] max-[1152px]:px-[16px] max-[1152px]:text-[18px] max-[1152px]:leading-[26px]">
          <span>어제 네이버 급상승</span>
          <span className="text-[#7346f3]">쇼핑</span>
          <span>키워드</span>
        </div>

        {/* 상품 출력 영역 */}
        <div className="mb-[10px] grid w-full grid-cols-5 gap-[16px] max-[1152]:mb-0 max-[1152px]:flex max-[1152px]:shrink-0 max-[1152px]:pl-[16px]">
          {currentItems.map((item, idx) => {
            const rank = currentPage * itemPerPage + idx + 1;

            return (
              <a
                key={item.id}
                href={item.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-[21px] max-[1152px]:gap-[12px]"
              >
                {/* 이미지 + keyword 출력 영역 */}
                <div className="relative aspect-square w-full overflow-hidden rounded-[8px] max-[1152px]:w-[180px] max-[1152px]:rounded-[4px]">
                  <Image
                    src={item.imageUrl}
                    alt={item.keyword}
                    fill
                    sizes="20vW, 243px"
                    unoptimized={true}
                    className="object-cover transition-transform duration-250 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0)_100%)]" />
                  <div className="pointer-events-none absolute inset-0 z-10 bg-black/6 transition-colors duration-250"></div>

                  <div className="absolute bottom-[6px] left-[16px] z-20 h-[64px] max-[1152px]:bottom-[3px] max-[1152px]:left-[9px] max-[1152px]:h-[46px]">
                    <img
                      src={`/images/ranks/trend-${rank}.svg`}
                      alt={String(rank)}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <p className="px-[4px] text-[20px] font-medium tracking-[-.5px] text-[#333] max-[1152px]:mt-[2px] max-[1152px]:pl-[2px] max-[1152px]:text-[16px]">
                  {item.normalizedKeyword}
                </p>
              </a>
            );
          })}
        </div>

        {/* 페이지네이션 컨트롤 (데이터가 5개 이하일 때 등) */}
        {totalPages > 1 && (
          <div className="flex h-auto w-auto items-center justify-center gap-[44px] font-medium">
            <button
              onClick={handlePrev}
              className="flex h-auto w-auto cursor-pointer items-center justify-center rounded-[8px] border border-[#d3dadf] px-[31px] py-[11px] text-[#121212] transition-colors hover:bg-[#f3f6f8]"
            >
              <svg
                viewBox="0 0 16 16"
                className="h-[16px] w-[16px] rotate-180 fill-none"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.667 13.5l5-5-5-5"
                ></path>
              </svg>
            </button>
            <div className="text-[16px] leading-[40px] font-bold text-[#000]">
              <span>{currentPage + 1} </span>
              <span className="font-medium text-[#00000080]">
                / {totalPages}
              </span>
            </div>
            <button
              onClick={handleNext}
              className="flex h-auto w-auto cursor-pointer items-center justify-center rounded-[8px] border border-[#d3dadf] px-[31px] py-[11px] text-[#121212] transition-colors hover:bg-[#f3f6f8]"
            >
              <svg viewBox="0 0 16 16" className="h-[16px] w-[16px] fill-none">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.667 13.5l5-5-5-5"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
