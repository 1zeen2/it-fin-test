'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLoginAlertModal } from '@/feature/auth/LoginAlertModalContext';
import { useAuth } from '@/feature/auth/AuthContext';
import type { RecommendProduct } from '@/types/product';
import AdTooltip from '@/components/common/AdTooltip';
import api from '@/lib/axios';

const CATEGORIES = [
  '출산/육아',
  '화장품/미용',
  '스포츠/레저',
  '디지털/가전',
  '생활/건강',
  '식품',
  '패션의류',
  '패션잡화',
  '가구/인테리어',
];

export default function CategoryRecommend() {
  const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);
  const { isLoggedIn } = useAuth();
  const { openLoginAlertModal } = useLoginAlertModal();
  const [wishList, setWishList] = useState<number[]>([]);
  const [products, setProducts] = useState<RecommendProduct[]>([]);
  const currentCategory = CATEGORIES[currentCategoryIdx];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products', {
          params: {
            category1: currentCategory,
          },
        });

        setProducts(response.data);
      } catch (error) {
        console.error('API 호출 에러: ', error);
      }
    };
    fetchProducts();
  }, [currentCategory]);

  const filteredProducts = products.filter(
    (product) => product.category1 === currentCategory,
  );

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

  const handlePrevCategory = () => {
    setCurrentCategoryIdx((prev) =>
      prev === 0 ? CATEGORIES.length - 1 : prev - 1,
    );
  };

  const handleNextCategory = () => {
    setCurrentCategoryIdx((prev) =>
      prev === CATEGORIES.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section className="flex w-full flex-col items-center border-b border-[#e8ecef] py-[40px]">
      <div className="flex w-full max-w-[1280px] flex-col gap-[16px] max-[1365px]:w-[960px] md:min-h-[794px]">
        {/* 섹션 타이틀 */}
        <h2 className="text-[24px] leading-[32px] font-bold text-[#121212]">
          <span className="text-[#7346f3]">{currentCategory}</span> 상품
          어떠세요?
        </h2>
        {/* 카테고리 탭 */}
        <div className="flex gap-[4px]">
          {CATEGORIES.map((category, idx) => (
            <button
              key={category}
              onClick={() => setCurrentCategoryIdx(idx)}
              className={`shrink-0 cursor-pointer rounded-[20px] border px-[11px] py-[11.5px] text-[13px] ${
                currentCategoryIdx === idx
                  ? 'border-[#121212] bg-[#121212] font-bold text-white'
                  : 'border-[#e8ecef] bg-white text-[#3f3f3f]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 상품 목록 */}
        <div className="mt-[4px] mb-[12px] grid h-auto w-full grid-cols-6 gap-x-[16px] gap-y-[20px] max-[1365px]:grid-cols-5">
          {filteredProducts.map((product, idx) => {
            const isWished = wishList.includes(product.id);
            const discountRate =
              product.originalPrice && product.originalPrice > product.price
                ? Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )
                : null;

            return (
              <a
                key={product.id}
                href={product.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group cursor-pointer flex-col gap-[10px] ${
                  idx >= 10 ? 'flex max-[1365px]:!hidden' : ''
                }`}
              >
                {/* 썸네일 & 찜 버튼 영역 */}
                <div className="relative mb-[10px] aspect-square w-full shrink-0 overflow-hidden rounded-[8px]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    unoptimized={true}
                    sizes="(max-width: 1365px) 180px, 200px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <button
                    onClick={(e) => handleWishClick(e, product.id)}
                    className="absolute right-[4px] bottom-[4px] z-10 flex h-[32px] w-[32px] items-center justify-center"
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

                {/* 상품 정보 텍스트 영역 */}
                <div className="flex flex-col px-[4px]">
                  <span className="line-clamp-2 text-[14px] leading-[19px] text-[#121212]">
                    {product.title}
                  </span>

                  {/* 취소선 (원래 가격) */}
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="mt-[4px] text-[12px] leading-[14px] text-[#949494] line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    )}

                  <div className="flex items-start text-[15px] leading-[24px]">
                    {discountRate && (
                      <strong className="mr-[3px] font-bold text-[#d40022]">
                        {discountRate}%
                      </strong>
                    )}
                    <strong className="text-[18px] font-bold text-[#121212]">
                      {product.price.toLocaleString()}
                    </strong>
                    <span>원</span>
                  </div>

                  {/* 배송비 정보 (조건부 렌더링) */}
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
                </div>
              </a>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        <div className="relative flex w-full items-center justify-center">
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <AdTooltip />
          </div>
          <button
            onClick={handlePrevCategory}
            className="flex items-center justify-center rounded-[8px] border border-[#d3dadf] bg-white px-[31px] py-[10.5px] text-[#121212] transition-colors hover:bg-[#f5f6f4]"
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
            {currentCategoryIdx + 1}{' '}
            <span className="font-medium text-[#949494]">
              / {CATEGORIES.length}
            </span>
          </span>

          <button
            onClick={handleNextCategory}
            className="flex items-center justify-center rounded-[8px] border border-[#d3dadf] bg-white px-[31px] py-[10.5px] text-[#121212] transition-colors hover:bg-[#f5f6f4]"
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
      </div>
    </section>
  );
}
