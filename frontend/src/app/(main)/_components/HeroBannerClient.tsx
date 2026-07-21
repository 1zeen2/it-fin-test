'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroBannerData } from '@/types/display';

interface HeroBannerClientProps {
  banners: HeroBannerData[];
}

export default function HeroBannerClient({ banners }: HeroBannerClientProps) {
  const [currentIndex, setCurrentIndex] = useState(banners.length);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);

  const isTransitioningRef = useRef(isTransitioning);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // 화면 크기 감지 및 반응형 로직
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1152px)');

    const handleMediaChange = () => {
      setIsTransitioning(false);

      setTimeout(() => setIsTransitioning(true), 50);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    let timer: NodeJS.Timeout;

    if (currentIndex === banners.length * 2) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(banners.length);
      }, 500);
    } else if (currentIndex === banners.length - 1) {
      timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(banners.length * 2 - 1);
      }, 500);
    } else if (!isTransitioning) {
      timer = setTimeout(() => setIsTransitioning(true), 50);
    }

    return () => clearTimeout(timer);
  }, [currentIndex, banners.length, isTransitioning]);

  // 오토 슬라이드
  useEffect(() => {
    if (banners.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      if (isTransitioningRef.current) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [banners.length, isPaused, resetTimer]);

  const handleNext = () => {
    if (!isTransitioning || currentIndex >= banners.length * 2) return;
    setCurrentIndex((prev) => prev + 1);
    setResetTimer((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isTransitioning || currentIndex <= banners.length - 1) return;
    setCurrentIndex((prev) => prev - 1);
    setResetTimer((prev) => prev + 1);
  };

  if (!banners || banners.length === 0) return null;

  const extendedBanners = [...banners, ...banners, ...banners];
  const realIdx = currentIndex % banners.length;

  return (
    <div className="relative flex w-full flex-col overflow-hidden pt-[20px] pb-[10px] max-[1152px]:pt-[14px]">
      {/* 슬라이드 영역 */}
      <div
        className={`flex ease-out ${isTransitioning ? 'transition-transform duration-500' : 'transition-none'} gap-[12px] [--bgap:12px] [--bw:540px] [--offset:-0.27] max-[1152px]:gap-[6px] max-[1152px]:[--bgap:6px] max-[1152px]:[--bw:480px] max-[1152px]:[--offset:-0.33]`}
        style={{
          transform: `translateX(calc(var(--bw) * var(--offset) - (var(--bw) + var(--bgap)) * ${currentIndex}))`,
        }}
      >
        {extendedBanners.map((item, idx) => (
          // 배열 복사를 했으므로 고유한 key값 다시 생성 (item.id + idx)
          <div
            key={`${item.id}-${idx}`}
            className="relative h-[260px] w-[540px] flex-shrink-0 max-[1152px]:h-[230px] max-[1152px]:w-[480px]"
          >
            <Link href={item.linkUrl} className="relative block h-full w-full">
              {/* 이미지, 텍스트 렌더링 로직 */}
              <Image
                src={item.bgImageWebp}
                alt={item.title}
                fill
                priority
                sizes="540px"
                className="rounded-[12px] object-cover max-[1152px]:rounded-none"
              />

              <div className="absolute inset-0 z-10 flex h-auto flex-col justify-center px-[26px]">
                {item.titleImageWebp ? (
                  <div className="mb-[4px] block w-[320px]">
                    <Image
                      src={item.titleImageWebp}
                      alt={item.mainText || item.title}
                      width={320}
                      height={80}
                      priority
                      className="mb-[16px] object-contain"
                    />
                    <p className="h-auto text-[18px] font-medium text-white">
                      {item.subText}
                    </p>
                  </div>
                ) : (
                  <div className="mb-[6px] flex h-auto flex-col gap-[12px]">
                    <h2 className="h-auto text-[32px] leading-[40px] font-bold tracking-[-1px] text-white">
                      {item.mainText}
                    </h2>
                    <p className="h-auto text-[18px] font-medium text-white">
                      {item.subText}
                    </p>
                  </div>
                )}
                {item.productsJson && item.productsJson.length > 0 && (
                  <div className="mt-4 flex gap-2">
                    {item.productsJson.map((prod, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-md border border-white/20 shadow-sm"
                      >
                        <Image
                          src={prod.fallback}
                          alt="상품 썸네일"
                          fill
                          sizes="86px"
                          unoptimized={true}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 하단 게이지 바 및 버튼 영역 */}
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between pt-[21px] pb-[20px] max-[1365px]:w-[960px] max-[1152px]:w-full max-[1152px]:px-4 max-[1152px]:py-5">
        <div className="relative mr-4 h-[2px] flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute top-0 left-0 h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${((realIdx + 1) / banners.length) * 100}%` }}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-center text-black">
          {/* 이전 버튼: 아이콘 16px + 패딩 12px = 40px 터치영역 */}
          <button
            onClick={handlePrev}
            className="flex cursor-pointer items-center justify-center rounded-full px-[5px] py-[2px]"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-[16px] w-[16px] rotate-180 fill-none"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.667 13l5-5-5-5"
              ></path>
            </svg>
          </button>

          {/* 구분선: 동적 높이 폰트 사이즈 기반 */}
          <span className="mx-1 text-gray-300">|</span>

          {/* 다음 버튼 */}
          <button
            onClick={handleNext}
            className="flex cursor-pointer items-center justify-center rounded-full px-[5px] py-[2px]"
          >
            <svg viewBox="0 0 16 16" className="h-[16px] w-[16px] fill-none">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.667 13l5-5-5-5"
              ></path>
            </svg>
          </button>

          {/* 재생/일시정지 토글 버튼 */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="ml-[5px] flex cursor-pointer items-center justify-center"
          >
            {isPaused ? (
              <svg viewBox="0 0 20 20" className="h-[20xp] w-[20px] fill-none">
                <path
                  fill="#000"
                  fillRule="evenodd"
                  d="M14.921 8.724c.944.59.944 1.964 0 2.554l-6.808 4.256a1.506 1.506 0 01-2.304-1.278v-8.51a1.506 1.506 0 012.304-1.278l6.809 4.256z"
                  clipRule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-[20px] w-[20px] fill-none">
                <path
                  fill="#000"
                  d="M7.084 4.375c.69 0 1.25.56 1.25 1.25v8.75a1.25 1.25 0 11-2.5 0v-8.75c0-.69.56-1.25 1.25-1.25zm5.834 0c.69 0 1.25.56 1.25 1.25v8.75a1.25 1.25 0 01-2.5 0v-8.75c0-.69.56-1.25 1.25-1.25z"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 전용 구분선 */}
      <div className="hidden h-[8px] w-full bg-[#f0f0f0] max-[1152px]:block" />
    </div>
  );
}
