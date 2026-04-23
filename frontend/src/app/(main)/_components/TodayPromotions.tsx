'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/axios';

interface TodayPromotions {
  id: number;
  title: string;
  imageUrl: string;
  badgeText?: string;
  badgeBgColor?: string;
  highlightText?: string;
  linkUrl: string;
}

export default function TodayPromotions() {
  const [promotions, setPromotions] = useState<TodayPromotions[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get('/api/display/today-promotions');

        setPromotions(response.data);
      } catch (error) {
        console.error('오늘의 이벤트 로딩 실패', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-sm text-gray-500">
        프로모션을 불러오는 중입니다...
      </div>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className="flex h-auto w-full items-center justify-center border-b border-[#e8ecef] pt-[29px] pb-[41px]">
      <div className="flex h-auto w-[1280px] flex-col items-center justify-between gap-[11px]">
        <div className="flex h-auto w-full flex-row items-center justify-between py-[18px]">
          <div className="flex h-auto w-auto gap-[6px] text-[24px] font-bold tracking-[-.5px]">
            <span className="text-[#7346f3]">오늘의 행사</span>
            <span className="text-[#000]">놓치지 마세요!</span>
          </div>
          <Link
            href="https://shopping.naver.com/promotion?type=RANKING"
            className="flex h-auto w-auto items-center text-[17px] text-[#757575]"
          >
            <span>전체보기</span>
            <svg viewBox="0 0 16 16" className="h-[16px] w-[16px] fill-none">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.5 13l5-5-5-5"
              />
            </svg>
          </Link>
        </div>
        <div className="grid h-auto w-full grid-cols-6 gap-x-[16px] gap-y-[22px]">
          {promotions.map((item) => (
            <Link
              key={item.id}
              href={item.linkUrl}
              className="group flex w-full flex-col gap-[10px]"
            >
              <div className="relative aspect-square h-[200px] w-[200px] overflow-hidden rounded-[8px]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1280px) 200px, 200px"
                  className="object-cover transition-transform duration-250 group-hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-0 z-10 bg-black/3 transition-colors duration-250"></div>

                {item.badgeText && (
                  <span
                    className="absolute top-0 left-0 rounded-br-[8px] px-[8px] py-[2px] text-[14px] leading-[22px] font-bold text-[#fff]"
                    style={{ backgroundColor: item.badgeBgColor }}
                  >
                    {item.badgeText}
                  </span>
                )}
              </div>

              <p className="line-clamp-2 max-h-[36px] px-[4px] text-[14px] leading-[19px] font-normal tracking-[-0.5px] wrap-break-word break-all text-[#121212]">
                {item.highlightText && (
                  <span className="mr-[4px] font-bold text-[#7346f3]">
                    {item.highlightText}
                  </span>
                )}
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
