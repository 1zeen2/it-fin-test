'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import LoginAlertModal from '@/feature/auth/components/LoginAlertModal';
import { useAuth } from '@/feature/auth/AuthContext';
import BlogCurationCard from './BlogCurationCard';

export interface CurationProduct {
  productId: number;
  title: string;
  originalPrice: number | null;
  price: number;
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
  shippingFee: number;
}

export interface BlogCuration {
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
  const itemsPerPage = 2;
  const totalPages = Math.max(1, Math.ceil(curations.length / itemsPerPage));

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCurations = curations.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
            {currentCurations.map((curation) => (
              <BlogCurationCard
                key={curation.curationId}
                curation={curation}
                wishList={wishList}
                onWishClick={handleWishClick}
              />
            ))}
          </div>

          <div className="mt-[16px] flex w-full items-center justify-center gap-[12px]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-[#d3dadf] bg-white text-[#121212] transition-colors hover:bg-[#f5f6f4]"
            >
              &lt;
            </button>
            <span className="text-[14px] font-medium text-[#121212]">
              {currentPage}{' '}
              <span className="text-[#949494]">/ {totalPages}</span>
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-[#d3dadf] bg-white text-[#121212] transition-colors hover:bg-[#f5f6f4]"
            >
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
