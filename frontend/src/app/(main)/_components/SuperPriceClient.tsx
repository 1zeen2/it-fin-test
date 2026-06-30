'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/feature/auth/AuthContext';
import { useLoginAlertModal } from '@/feature/auth/LoginAlertModalContext';
import type { SuperPriceProduct } from '@/types/promotions';

interface SuperPriceClientProps {
  initialProducts: SuperPriceProduct[];
}

export default function SuperPriceClient({
  initialProducts,
}: SuperPriceClientProps) {
  const { isLoggedIn } = useAuth();
  const { openLoginAlertModal } = useLoginAlertModal();
  const [wishList, setWishList] = useState<number[]>([]);

  // 0은 1페이지, 1은 2페이지
  const [page, setPage] = useState(0);

  const handleWishClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number,
  ) => {
    e.preventDefault();

    if (!isLoggedIn) {
      openLoginAlertModal();
      return;
    }

    setWishList((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      'https://shopping.naver.com/festa/onsale/brand/6a06a3ea83b92b144795f0ff',
      '_blank',
      'noopener,noreferrer',
    );
  };

  // 버튼 클릭시 페이지 토글
  const handlePage = () => {
    setPage((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <section className="mx-auto flex h-auto max-w-[1280px] flex-col gap-[18px] py-[40px] max-[1365px]:w-[960px]">
      {/* 상단 텍스트 및 전체보기 */}
      <div className="flex items-center justify-between leading-[32px]">
        <h3 className="text-[24px] font-bold text-[#000000]">
          멤버십 고객은
          <span className="ml-[6px] text-[#7346f3]">추가 10% 할인</span>
        </h3>
        <div className="flex cursor-pointer items-center text-[17px] text-[#757575]">
          <span>전체보기</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.5 13l5-5-5-5"
            ></path>
          </svg>
        </div>
      </div>

      {/* 중앙 그리드 */}
      <div className="mt-[2px] grid w-full grid-cols-6 gap-x-[16px] gap-y-[20px] max-[1365px]:grid-cols-5">
        {page === 0 && (
          <div
            className="relative col-span-1 row-span-2 cursor-pointer overflow-hidden rounded-[8px]"
            onClick={handleBannerClick}
          >
            <Image
              src="https://shopping-window.pstatic.net/public/nshome/images/202508291200/superprice.jpg?type=w360"
              alt="멤버십 고객 추가 10% 슈퍼 특가 배너"
              fill
              priority
              unoptimized={true}
              className="rounded-[8px] object-cover"
            />
          </div>
        )}

        {/* 우측 상품 영역 */}

        {initialProducts.map((product, idx) => {
          const isWished = wishList.includes(product.id);

          const showOnDesktop =
            (page === 0 && idx < 10) || (page === 1 && idx >= 10);
          const showOnMobile =
            (page === 0 && idx < 8) || (page === 1 && idx >= 8);

          let visibilityClass = 'hidden';

          if (showOnDesktop && showOnMobile) {
            visibilityClass = 'flex';
          } else if (showOnDesktop && !showOnMobile) {
            visibilityClass = 'hidden min-[1365px]:flex';
          } else if (!showOnDesktop && showOnMobile) {
            visibilityClass = 'hidden max-[1365px]:flex';
          }

          return (
            <a
              key={product.id}
              href={product.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex cursor-pointer flex-col gap-[10px] ${visibilityClass}`}
            >
              {/* 1. 썸네일 & 뱃지 영역 */}
              <div className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-[8px]">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  unoptimized
                  sizes="(max-width: 1365px) 180px, 200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* 좌측 상단 뱃지 (+세일, 슈퍼특가) */}
                <div className="absolute top-0 left-0 flex h-[26px] w-[64px] items-center justify-center rounded-br-[8px] bg-[#7346f3]">
                  <Image
                    src="https://shop-phinf.pstatic.net/20250630_136/1751246565827GLTbl_PNG/PromotionLogo_EC8A88ED8DBCED8AB9EAB080_white.png"
                    alt="슈퍼특가"
                    width={48}
                    height={26}
                    className="object-contain"
                  />
                </div>

                <button
                  onClick={(e) => handleWishClick(e, product.id)}
                  className="absolute right-[4px] bottom-[4px] z-10 flex h-[32px] w-[32px] cursor-pointer items-center justify-center"
                >
                  <div
                    className={`flex h-[24px] w-[24px] items-center justify-center rounded-full text-white transition-colors ${
                      isWished ? 'bg-[#ff3d25]' : 'bg-black/25'
                    }`}
                  >
                    <svg
                      viewBox="0 0 12 10"
                      className={`h-[12px] w-[12px] fill-none ${
                        isWished
                          ? 'animate-[heart-pulse_0.45s_ease-in-out]'
                          : 'drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]'
                      }`}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.2"
                        d="M5.096 1.408A2.6 2.6 0 0 0 3.263.667a2.6 2.6 0 0 0-1.832.741 2.503 2.503 0 0 0 0 3.598l4.56 4.388L10.7 4.867c.89-.985.842-2.512-.128-3.459A2.6 2.6 0 0 0 8.74.667c-.693 0-1.345.262-1.834.741L4.89 3.353a1.2 1.2 0 0 0-.386.881c0 .332.137.646.386.882a1.38 1.38 0 0 0 1.871 0l1.964-1.887"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* 2. 텍스트 정보 영역 */}
              <div className="flex flex-col px-[4px]">
                <span className="line-clamp-2 text-[14px] leading-[19px] break-all text-ellipsis text-[#121212]">
                  {product.title}
                </span>

                {product.originalPrice && (
                  <span className="mt-[4px] text-[12px] text-[#949494] line-through">
                    {product.originalPrice.toLocaleString()}원
                  </span>
                )}

                <div className="mt-[-1px] flex items-start text-[15px] leading-[24px]">
                  {product.discountRate && (
                    <strong className="mr-[2px] font-bold tracking-[0px] text-[#d40022]">
                      {product.discountRate}%
                    </strong>
                  )}
                  <strong className="text-[18px] font-bold text-[#121212]">
                    {product.price.toLocaleString()}
                  </strong>
                  <span>원</span>
                </div>

                {product.shippingFee > 0 && (
                  <div className="mt-[2px] flex items-center gap-[1px] text-[12px] leading-[18px] font-normal text-[#949494]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                    >
                      <g
                        stroke="currentColor"
                        strokeWidth="0.85"
                        clipPath="url(#a)"
                      >
                        <path
                          d="M12.24 11.6a1.201 1.201 0 0 0-2.4 0 1.2 1.2 0 0 0 1.2 1.2c.666-.004 1.2-.54 1.2-1.2Zm-6.08 0a1.2 1.2 0 0 0-1.2-1.2c-.663 0-1.197.537-1.2 1.2a1.203 1.203 0 0 0 1.2 1.2 1.203 1.203 0 0 0 1.2-1.2Z"
                          clipRule="evenodd"
                        ></path>
                        <path
                          strokeLinecap="square"
                          d="M7.667 4v0a.333.333 0 0 0-.334-.333h-5A.333.333 0 0 0 2 4v4.333m1.667 3.334H2.333A.333.333 0 0 1 2 11.333v-3m0 0h7.333m0-.006v-2.66c0-.184.15-.334.334-.334h2.794c.126 0 .241.072.298.185l1.206 2.412a.33.33 0 0 1 .035.149v3.254c0 .184-.15.334-.333.334h-1.334m-6 0h3.334"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="a">
                          <path fill="#fff" d="M0 0h16v16H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                    {product.shippingFee.toLocaleString()}원
                  </div>
                )}

                {/* 하단 태그 */}
                <div className="mt-[8px] w-fit rounded-[2px] bg-[#7346f3]/7 px-[5px] text-[12px] leading-[22px] tracking-[0px] text-[#7346f3]">
                  #{product.displayTag}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* 하단 페이지네이션 */}
      <div className="mt-[7px] flex w-full items-center justify-center">
        <button
          onClick={handlePage}
          className="flex h-[40px] w-[80px] cursor-pointer items-center justify-center rounded-[8px] border border-[#d3dadf] bg-white text-[#121212] transition-colors hover:bg-[#f3f6f8]"
        >
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            className="rotate-180"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.667 13.5l5-5-5-5"
            ></path>
          </svg>
        </button>

        <span className="px-[43px] text-[16px] font-bold text-[#121212]">
          {page + 1} <span className="font-medium text-[#949494]">/ 2</span>
        </span>

        <button
          onClick={handlePage}
          className="flex h-[40px] w-[80px] cursor-pointer items-center justify-center rounded-[8px] border border-[#d3dadf] bg-white text-[#121212] transition-colors hover:bg-[#f3f6f8]"
        >
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.667 13.5l5-5-5-5"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
}
