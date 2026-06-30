'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import Image from 'next/image';

// 타입 정의 (interface)
interface ProductImage {
  webp: string;
  fallback: string;
}

interface HeroBanner {
  id: number;
  title: string; // SEO alt 텍스트
  linkUrl: string;
  bgImageWebp: string;
  titleImageWebp: string | null;
  mainText: string | null;
  subText: string | null;
  productsJson: ProductImage[]; // @JsonRawValue에서 rawJSON으로 저장헤서 문자열이 아니라 배열로 바로 들어옴
}

export default function HeroBanner() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);

  const BANNER_WIDTH = 540;
  const BANNER_GAP = 12;

  // 데이터 fetch 및 초기화
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get('/api/display/hero-banners');
        setBanners(response.data);
        setCurrentIndex(response.data.length);
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 배너 순간이동 로직
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
  const isTransitioningRef = useRef(isTransitioning);
  useEffect(() => {
    if (banners.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      if (isTransitioningRef.current) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [banners.length, isPaused, resetTimer]);

  // 배너 위치 계산
  const getTranslateX = () => {
    if (typeof window === 'undefined' || banners.length === 0) return 0;

    // 배너 정 중앙 위치
    const centerOffset = (window.innerWidth - BANNER_WIDTH) / 2;

    // idx 에 따른 이동 거리 계산
    const moveDistance = currentIndex * (BANNER_WIDTH + BANNER_GAP);

    return centerOffset - moveDistance;
  };

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

  if (isLoading || banners.length === 0) return null;

  const extendedBanners = [...banners, ...banners, ...banners];

  // 게이지 바 인덱스
  const realIdx = currentIndex % banners.length;

  return (
    <div className="relative flex w-full flex-col overflow-hidden pt-[20px] pb-[10px]">
      {/* 슬라이드 영역 */}
      <div
        className={`flex ease-out ${isTransitioning ? 'transition-transform duration-500' : 'transition-none'}`}
        style={{
          transform: `translateX(${getTranslateX()}px)`,
          gap: `${BANNER_GAP}px`,
        }}
      >
        {extendedBanners.map((item, idx) => (
          // 배열 복사를 했으므로 고유한 key값 다시 생성 (item.id + idx)
          <div
            key={`${item.id}-${idx}`}
            className="relative h-[260px] w-[540px] flex-shrink-0"
          >
            <Link href={item.linkUrl} className="relative block h-full w-full">
              {/* 이미지, 텍스트 렌더링 로직 */}
              <Image
                src={item.bgImageWebp}
                alt={item.title}
                fill
                priority
                sizes="540px"
                className="rounded-[12px] object-cover"
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
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between pt-[21px] pb-[20px] max-[1365px]:w-[960px]">
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
    </div>
  );
}
