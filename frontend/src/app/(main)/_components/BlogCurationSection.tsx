'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useLoginAlertModal } from '@/feature/auth/LoginAlertModalContext';
import { useAuth } from '@/feature/auth/AuthContext';
import BlogCurationCard from './BlogCurationCard';
import { BlogCuration } from '@/types/product';

const itemsPerPage = 2;

export default function BlogCurationSection() {
  const [curations, setCurations] = useState<BlogCuration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(curations.length / itemsPerPage));

  const [wishList, setWishList] = useState<number[]>([]);

  const { openLoginAlertModal } = useLoginAlertModal();
  const { isLoggedIn } = useAuth();

  // 서버에서 데이터를 받아오는 훅
  useEffect(() => {
    const fetchCurations = async () => {
      try {
        const response = await api.get('/api/display/blog-curations');

        setCurations(response.data);
      } catch (error) {
        console.error('큐레이션 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurations();
  }, []);

  // 페이지네이션 이미지를 미리 다운로드 받는 훅
  useEffect(() => {
    if (curations.length > 0) {
      const nextPageIndex = currentPage === totalPages ? 1 : currentPage + 1;
      const nextStartIndex = (nextPageIndex - 1) * itemsPerPage;
      const nextCurations = curations.slice(
        nextStartIndex,
        nextStartIndex + itemsPerPage,
      );

      nextCurations.forEach((curation) => {
        const thumbnailImg = new Image();
        thumbnailImg.src = curation.postThumbnailUrl;

        curation.products.forEach((product) => {
          const productImg = new Image();
          productImg.src = product.imageUrl;
        });
      });
    }
  }, [currentPage, curations, totalPages]);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCurations = curations.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <section className="flex h-auto w-full flex-col items-center border-b border-[#e8ecef] py-[40px]">
      <div className="flex h-auto w-full max-w-[1280px] flex-col gap-[23px]">
        <div className="flex h-auto flex-col gap-[6px] tracking-[-.5px]">
          <h2 className="text-[24px] leading-[32px] font-bold text-[#000000]">
            인기 <span className="text-[#7346f3]">패션</span> 블로그와 함께 찾는
            상품
          </h2>
          <p className="text-[15px] leading-[20px] font-normal text-[#757575]">
            최근 7일간 <span className="mr-[5.5px] text-[#121212]">패션</span>
            분야 클릭 많은 블로그
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-[14px] md:grid-cols-2">
          {currentCurations.map((curation, index) => (
            <BlogCurationCard
              key={index}
              curation={curation}
              wishList={wishList}
              onWishClick={handleWishClick}
            />
          ))}
        </div>

        <div className="mt-[1px] flex w-full items-center justify-center">
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1))
            }
            disabled={isLoading}
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
          <span className="px-[44px] text-[16px] font-bold text-[#121212]">
            {currentPage}{' '}
            <span className="font-medium text-[#949494]">/ {totalPages}</span>
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1))
            }
            disabled={isLoading}
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
