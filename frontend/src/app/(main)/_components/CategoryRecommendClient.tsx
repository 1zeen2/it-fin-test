'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useLoginAlertModal } from '@/feature/auth/LoginAlertModalContext';
import { useAuth } from '@/feature/auth/AuthContext';
import type { CategoryRecommendProduct } from '@/types/product';
import AdTooltip from '@/components/common/AdTooltip';
import ProductCardVertical from '@/components/common/ProductCardVertical';
import api from '@/lib/axios';
import IconChevron from '@/components/common/icons/IconChevron';

interface CategoryRecommendClientProps {
  categories: string[];
  initialProducts: CategoryRecommendProduct[];
}

export default function CategoryRecommendClient({
  categories,
  initialProducts,
}: CategoryRecommendClientProps) {
  const [currentCategoryIdx, setCurrentCategoryIdx] = useState(0);
  const currentCategory = categories[currentCategoryIdx];

  // 서버에서 내려준 데이터를 초기 상태로 저장
  const [products, setProducts] =
    useState<CategoryRecommendProduct[]>(initialProducts);

  const { isLoggedIn } = useAuth();
  const [wishList, setWishList] = useState<number[]>([]);
  const { openLoginAlertModal } = useLoginAlertModal();

  const isFirstRender = useRef(true);

  // 카테고리 무작위 셔플 (서버 Hydration 에러 방어용 비동기 타이머 트릭)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/products', {
          params: {
            category1: currentCategory,
          },
        });
        setProducts(res.data);
      } catch (err) {
        console.error('API 호출 에러: ', err);
      }
    };
    fetchProducts();
  }, [currentCategory]);

  const handleWishClick = useCallback(
    (productId: number) => {
      if (!isLoggedIn) {
        openLoginAlertModal();
        return;
      }

      setWishList((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );
    },
    [isLoggedIn, openLoginAlertModal],
  );

  const handlePrevCategory = () => {
    setCurrentCategoryIdx((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1,
    );
  };

  const handleNextCategory = () => {
    setCurrentCategoryIdx((prev) =>
      prev === categories.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section className="flex w-full flex-col items-center justify-center border-b border-[#e8ecef] py-[40px] max-[1152px]:pt-[30px] max-[1152px]:pb-[29px]">
      <div className="flex w-full max-w-[1280px] flex-col gap-[16px] max-[1365px]:w-[960px] max-[1152px]:h-auto max-[1152px]:w-full max-[1152px]:gap-[12px]">
        {/* 섹션 타이틀 */}
        <div className="inline-flex items-center gap-[6px]">
          <h2 className="text-[24px] leading-[32px] font-bold text-[#121212] max-[1152px]:pl-[16px] max-[1152px]:text-[18px] max-[1152px]:leading-[26px]">
            <span className="text-[#7346f3]">{currentCategory}</span> 상품
            어떠세요?
          </h2>
          <div className="hidden shrink-0 max-[1152px]:block">
            <AdTooltip />
          </div>
        </div>
        {/* 카테고리 탭 */}
        <div className="flex gap-[4px] max-[1152px]:pl-[16px]">
          {categories.map((category, idx) => (
            <button
              key={category}
              onClick={() => setCurrentCategoryIdx(idx)}
              className={`shrink-0 cursor-pointer rounded-[20px] border px-[11px] py-[11.5px] text-[13px] max-[1152px]:py-[9.5px] ${
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
        <div className="mt-[4px] mb-[12px] grid h-auto w-full grid-cols-6 gap-x-[16px] gap-y-[20px] pr-[16px] max-[1365px]:grid-cols-5 max-[1152px]:mt-[4px] max-[1152px]:mb-0 max-[1152px]:grid-cols-[repeat(8,180px)] max-[1152px]:gap-x-[12px] max-[1152px]:gap-y-[16px] max-[1152px]:overflow-x-auto max-[1152px]:pl-[16px] [&::-webkit-scrollbar]:hidden">
          {products.map((product, idx) => (
            <ProductCardVertical
              key={product.id}
              product={product}
              isWished={wishList.includes(product.id)}
              onWishClick={handleWishClick} // 💡 메모이제이션된 캐시 함수 주입
              className={idx >= 10 ? 'max-[1365px]:!hidden' : ''}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="relative flex w-full items-center justify-center max-[1152px]:hidden">
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <AdTooltip />
          </div>
          <button
            onClick={handlePrevCategory}
            className="flex items-center justify-center rounded-[8px] border border-[#d3dadf] bg-white px-[31px] py-[10.5px] text-[#121212] transition-colors hover:bg-[#f5f6f4]"
          >
            <IconChevron className="h-[16px] w-[16px] rotate-none" />
          </button>

          <span className="px-[43px] text-[16px] font-bold text-[#121212]">
            {currentCategoryIdx + 1}{' '}
            <span className="font-medium text-[#949494]">
              / {categories.length}
            </span>
          </span>

          <button
            onClick={handleNextCategory}
            className="flex items-center justify-center rounded-[8px] border border-[#d3dadf] bg-white px-[31px] py-[10.5px] text-[#121212] transition-colors hover:bg-[#f5f6f4]"
          >
            <IconChevron className="h-[16px] w-[16px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
