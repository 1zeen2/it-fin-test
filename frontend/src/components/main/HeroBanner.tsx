"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const BANNER_ITEMS = [
  {
    id: 1,
    link: "https://shopping.naver.com/mega-week",
    bgColor: "#FFFFFF",
    // 배경 이미지
    bgImage: {
      webp: "https://shop-phinf.pstatic.net/20260306_151/1772769836549hQhRH_PNG/EAB080ECA084EAB080EAB5AC%2BEBA994EAB080EC9C84ED81AC_EAB0.png?type=a1600_webp_q80",
      fallback:
        "https://shop-phinf.pstatic.net/20260306_151/1772769836549hQhRH_PNG/EAB080ECA084EAB080EAB5AC%2BEBA994EAB080EC9C84ED81AC_EAB0.png",
    },
    // 1-2. 타이틀 텍스트 이미지
    titleLogo: {
      webp: "https://shop-phinf.pstatic.net/20260306_154/1772769838137AYci9_PNG/EAB080ECA084EAB080EAB5AC%2BEBA994EAB080EC9C84ED81AC_ECB5.png?type=w640_webp_q80",
      fallback:
        "https://shop-phinf.pstatic.net/20260306_154/1772769838137AYci9_PNG/EAB080ECA084EAB080EAB5AC%2BEBA994EAB080EC9C84ED81AC_ECB5.png",
      alt: "가전가구 메가위크",
    },
    // 1-3. 서브 텍스트 및 미니 상품 썸네일 배열
    subText: "삶의 질 상승! 인기 가전 최대 할인",
    products: [
      {
        webp: "https://shop-phinf.pstatic.net/20260119_174/1768785818738cfpYv_JPEG/21072798565250466_764818877.jpg?type=w240_webp_q80",
        fallback:
          "https://shop-phinf.pstatic.net/20260119_174/1768785818738cfpYv_JPEG/21072798565250466_764818877.jpg",
      },
      {
        webp: "https://shop-phinf.pstatic.net/20250314_255/1741918966428qfmGF_JPEG/14238105237608439_2043266647.jpg?type=w240_webp_q80",
        fallback:
          "https://shop-phinf.pstatic.net/20250314_255/1741918966428qfmGF_JPEG/14238105237608439_2043266647.jpg",
      },
    ],
  },
  // ... 2, 3, 4번 배너도 이 규격에 맞춰 데이터만 넣으시면 됩니다!
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // 슬라이드 타이머 로직 (동일)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % BANNER_ITEMS.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + BANNER_ITEMS.length) % BANNER_ITEMS.length,
    );

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-white pt-[20px] pb-[40px]">
      <div className="relative h-[340px] w-full">
        <ul
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(50% - 480px - ${currentIndex * (960 + 20)}px))`,
          }}
        >
          {BANNER_ITEMS.map((item, index) => (
            <li
              key={item.id}
              className="relative h-[260px] w-[540px] shrink-0 overflow-hidden rounded-[12px] transition-opacity duration-300"
              style={{
                backgroundColor: item.bgColor,
                marginRight: "20px",
                opacity: currentIndex === index ? 1 : 0.4,
              }}
            >
              {/* 🌟 레이어 1: 배경 이미지 */}
              <picture className="absolute inset-0 z-0 block h-full w-full">
                <source srcSet={item.bgImage.webp} type="image/webp" />
                <img
                  src={item.bgImage.fallback}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </picture>

              {/* 🌟 레이어 2 & 3: 컨텐츠 영역 (타이틀 폰트 이미지 + 서브텍스트 + 미니 상품) */}
              {/* padding 값을 조절하여 텍스트의 상하좌우 위치(11시, 7시 등)를 제어할 수 있습니다. */}
              <div className="relative z-10 flex h-full w-full flex-col justify-center px-[26px]">
                {/* 타이틀 로고 이미지 (네이버 원본 사이즈에 맞게 높이 조정) */}
                <picture className="mb-[10px] block h-auto w-[340px]">
                  <source srcSet={item.titleLogo.webp} type="image/webp" />
                  <img
                    src={item.titleLogo.fallback}
                    alt={item.titleLogo.alt}
                    className="w-full object-contain"
                  />
                </picture>

                {/* 서브 텍스트 */}
                <p className="mb-[14px] text-[18px] leading-[24px] tracking-[-.5px] text-[#fff]">
                  {item.subText}
                </p>

                {/* 미니 썸네일 상품 리스트 */}
                {item.products && item.products.length > 0 && (
                  <ul className="flex gap-[8px]">
                    {item.products.map((prod, idx) => (
                      <li
                        key={idx}
                        className="h-[86px] w-[86px] overflow-hidden rounded-[8px] border border-white/20"
                      >
                        <picture className="block h-full w-full">
                          <source srcSet={prod.webp} type="image/webp" />
                          <img
                            src={prod.fallback}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </picture>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 🌟 레이어 4: 전체 클릭을 담당하는 투명 링크 (접근성 포함) */}
              <Link
                href={item.link}
                className="absolute inset-0 z-20 block outline-none"
              >
                <span className="sr-only">자세히 보러 가기</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 컨트롤러 영역 (동일) */}
      <div className="absolute bottom-[20px] left-1/2 z-30 flex h-[36px] -translate-x-1/2 items-center rounded-full bg-black/40 px-[16px] text-[13px] text-white backdrop-blur-sm">
        <span className="font-bold">{currentIndex + 1}</span>
        <span className="mx-[4px] text-white/50">/</span>
        <span className="mr-[12px] text-white/50">{BANNER_ITEMS.length}</span>

        <div className="flex items-center gap-[12px]">
          <button onClick={prevSlide} className="hover:text-white/70">
            <svg
              width="8"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 1L2 6l5 5" />
            </svg>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center hover:text-white/70"
          >
            {isPlaying ? (
              <svg width="10" height="12" fill="currentColor">
                <path d="M0 0h3v12H0zM7 0h3v12H7z" />
              </svg>
            ) : (
              <svg width="10" height="12" fill="currentColor">
                <path d="M0 0l10 6-10 6z" />
              </svg>
            )}
          </button>

          <button onClick={nextSlide} className="hover:text-white/70">
            <svg
              width="8"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 1l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
