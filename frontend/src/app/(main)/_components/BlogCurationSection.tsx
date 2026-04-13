'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import api from '@/lib/axios';
import LoginAlertModal from '@/feature/auth/components/LoginAlertModal';
import { useAuth } from '@/feature/auth/AuthContext';

interface CurationProduct {
  productId: number;
  title: string;
  originalPrice: number | null;
  price: number;
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
  shippingFee: number | null;
}

interface BlogCuration {
  curationId: number;
  blogName: string;
  author: string;
  postTitle: string;
  postThumbnailUrl: string;
  blogUrl: string;
  products: CurationProduct[];
}

export default function BlogCurationSection() {
  const [curations, setCurations] = useState<BlogCuration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const [wishList, setWishList] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchCurations = async () => {
      try {
        const response = await api.get('/api/blogs/curations');

        setCurations(response.data);
      } catch (error) {
        console.error('큐레이션 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurations();
  }, []);

  const handleWishClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number,
  ) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setIsModalOpen(true);
      return;
    }

    setWishList((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <>
      <section className="flex h-auto w-full flex-col items-center py-[40px]">
        <div className="flex h-auto w-full max-w-[1280px] flex-col gap-[24px]">
          <div className="flex h-auto flex-col gap-[6px] tracking-[-.5px]">
            <h2 className="text-[24px] leading-[32px] font-bold text-[#000000]">
              인기 <span className="text-[#7346f3]">패션</span> 블로그와 함께
              찾는 상품
            </h2>
            <p className="text-[15px] leading-[20px] font-normal text-[#757575]">
              최근 7일간 <span className="mr-[5px] text-[#121212]">패션</span>
              분야 클릭 많은 블로그
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-[14px] md:grid-cols-2">
            {curations.map((curation) => (
              <div
                key={curation.curationId}
                className="flex flex-col overflow-hidden rounded-[8px] border border-[#e8ecef] bg-white"
              >
                <a
                  href={curation.blogUrl}
                  className="relative flex h-auto w-full flex-col justify-between gap-[6px] overflow-hidden rounded-t-[8px] px-[30px] pt-[36px] pb-[30px] text-white"
                  style={{
                    backgroundImage: `url(${curation.postThumbnailUrl})`,
                    backgroundPosition: '50%',
                    backgroundSize: 'cover',
                  }}
                >
                  {/* inset-0 => top:0, right:0, bottom:0, left:0 을 한 번에 적용하는 Tailwind 클래스 */}
                  <div
                    className="absolute inset-0 z-0 bg-black/25 backdrop-blur-[30px]"
                    aria-hidden="true" // 스크린 리더가 이 빈 박스를 읽지 않도록 처리 (접근성)
                  />
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 16.67%, transparent 60.67%), rgba(0, 0, 0, 0.25)',
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex h-full w-full flex-col justify-between gap-[6px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="rounded-full bg-[#03a94d] px-[10px] py-[6px] text-[11px] font-bold text-white">
                        <svg
                          viewBox="0 0 31 14"
                          className="h-[13px] w-[31px] fill-none"
                        >
                          <path
                            fill="currentColor"
                            d="M26.707 2.749c1.007 0 1.838.337 2.335.863V2.88h1.84v6.725c0 2.944-1.752 4.395-4.175 4.395-1.226 0-2.263-.337-2.905-.702l.628-1.554c.467.263 1.313.562 2.292.562 1.226 0 2.204-.89 2.218-2.033v-.304c-.336.395-1.051.88-2.16.88-2.409 0-4.044-1.641-4.044-4.029s1.636-4.071 3.971-4.071m-24.75.898c.424-.453 1.27-.908 2.335-.908 2.35 0 3.868 1.626 3.868 4.043s-1.592 4.058-4 4.058c-1.007 0-1.854-.425-2.306-.88v.747H0V0h1.957zm9.586 4.424c0 .832.28 1 .73 1 .14 0 .268-.013.277-.014l.048-.006v1.736l-.037.006c-.003 0-.29.046-.601.046-1.02 0-2.374-.258-2.374-2.485V0h1.957zm5.954-5.333c2.467 0 4.087 1.729 4.087 4.043s-1.679 4.058-4.087 4.058-4.072-1.714-4.072-4.028c0-2.315 1.722-4.073 4.072-4.073m9.357 1.744c-1.284 0-2.16.996-2.16 2.315s.889 2.3 2.16 2.3c1.313 0 2.145-.996 2.145-2.3s-.862-2.315-2.145-2.315m-22.811 0c-1.299 0-2.146.967-2.146 2.3S2.76 9.08 4.057 9.08c1.33 0 2.146-.967 2.146-2.3s-.861-2.3-2.16-2.3m13.453.03c-1.255 0-2.116.967-2.116 2.284s.875 2.27 2.13 2.27c1.286 0 2.118-.967 2.118-2.27 0-1.304-.877-2.284-2.132-2.284"
                          ></path>
                        </svg>
                      </span>
                      <span className="text-[13px] text-gray-300">
                        by. {curation.author}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-[40px]">
                      <strong className="line-clamp-2 max-h-[60px] text-[20px] leading-[30px] font-bold break-words break-keep">
                        {curation.postTitle}
                      </strong>
                      <div className="relative h-[78px] w-[78px] shrink-0 overflow-hidden rounded-[4px]">
                        <Image
                          src={curation.postThumbnailUrl}
                          alt="블로그 썸네일"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </a>

                <div className="flex flex-col gap-[12px] px-[30px] pt-[24px] pb-[30px]">
                  {curation.products.map((product) => {
                    const isWished = wishList.includes(product.productId);

                    const discountRate =
                      product.originalPrice &&
                      product.originalPrice > product.price
                        ? Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100,
                          )
                        : null;

                    return (
                      <a
                        key={product.productId}
                        href={product.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex cursor-pointer gap-[12px]"
                      >
                        <div className="relative h-[110px] w-[110px] shrink-0 overflow-hidden rounded-[8px]">
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="transition-transform duration-200 group-hover:scale-105"
                          />
                          {isWished && (
                            <div className="absolute top-0 left-0 z-10 rounded-br-[8px] bg-[#ff3d25] px-[8px] text-[14px] leading-[26px] font-bold text-white">
                              찜한 상품
                            </div>
                          )}
                          <button
                            onClick={(e) =>
                              handleWishClick(e, product.productId)
                            }
                            className="absolute right-0 bottom-0 h-[40px] w-[40px] cursor-pointer p-[8px]"
                          >
                            <div
                              className={`flex h-[24px] w-[24px] items-center justify-center rounded-full text-white ${isWished ? 'bg-[#ff3d25]' : 'bg-black/26'}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
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

                        <div className="flex flex-col justify-center">
                          <span className="line-clamp-1 text-[14px] text-[#121212]">
                            {product.title}
                          </span>

                          {/* 원래 가격 (할인이 있을 때만 표시) */}
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <span className="mt-[4px] text-[12px] text-[#949494] line-through">
                                {product.originalPrice.toLocaleString()}원
                              </span>
                            )}

                          <div className="flex items-center gap-[4px] leading-[24px]">
                            {/* 할인율 */}
                            {discountRate && (
                              <strong className="text-[15px] font-bold text-[#d40022]">
                                {discountRate}%
                              </strong>
                            )}
                            {/* 최종 가격 */}
                            <strong className="text-[18px] text-[#121212]">
                              {product.price.toLocaleString()}
                              <span className="shrink-0 text-[15px] font-medium">
                                원
                              </span>
                            </strong>

                            {product.shippingFee && product.shippingFee > 0 && (
                              <div className="relative flex max-w-[100%] text-[12px] leading-[18px] font-normal tracking-[-.5px] text-[#949494]">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-[16px] w-[16px] fill-none"
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
                                      <path
                                        fill="#fff"
                                        d="M0 0h16v16H0z"
                                      ></path>
                                    </clipPath>
                                  </defs>
                                </svg>
                                {product.shippingFee.toLocaleString()}원
                              </div>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex h-[400px] w-full items-center justify-center rounded-[8px] border border-[#e8ecef] bg-gray-50">
              <span className="text-gray-400">블로그 카드 2</span>
            </div>
          </div>

          <div className="mt-[16px] flex w-full items-center justify-center gap-[12px]">
            <button className="flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-[#d3dadf] bg-white text-[#121212] transition-colors hover:bg-[#f5f6f4]">
              &lt;
            </button>
            <span className="text-[14px] font-medium text-[#121212]">
              1 <span className="text-[#949494]">/ 5</span>
            </span>
            <button className="flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-[#d3dadf] bg-white text-[#121212] transition-colors hover:bg-[#f5f6f4]">
              &gt;
            </button>
          </div>
        </div>
      </section>
      {/* 모달 렌더링 */}
      <LoginAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
