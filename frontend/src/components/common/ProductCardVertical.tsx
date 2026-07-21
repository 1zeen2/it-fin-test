'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { CategoryRecommendProduct } from '@/types/product';
import IconHeart from './icons/IconHeart';
import IconShipping from './icons/IconShipping';

interface ProductCardVerticalProps {
  product: CategoryRecommendProduct;
  isWished: boolean;
  onWishClick: (productId: number) => void;
  className?: string;
}

function ProductCardVertical({
  product,
  isWished,
  onWishClick,
  className = '',
}: ProductCardVerticalProps) {
  const discountRate =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  return (
    <div
      className={`group relative flex cursor-pointer flex-col gap-[10px] max-[1152px]:gap-[8px] ${className}`}
    >
      {/* 클릭 영역 */}
      <a href={product.linkUrl} className="absolute inset-0 z-10" />

      {/* 상품 목록 */}
      <div className="relative mb-[10px] aspect-square w-full shrink-0 overflow-hidden rounded-[8px] max-[1152px]:mb-0 max-[1152px]:rounded-[4px]">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          unoptimized={true}
          sizes="(max-width: 1152px) 180px, (max-width: 1365px) 180px, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* 찜하기 버튼 */}
        <div className="absolute right-0 bottom-0 z-20 flex h-[40px] w-[40px] cursor-pointer items-center justify-center max-[1152px]:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWishClick(product.id);
            }}
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[rgba(0,0,0,0.26)] transition-colors duration-200 ease-[cubic-bezier(0.15,0,0.15,1)]"
            aria-label="찜하기"
          >
            <IconHeart
              className={`h-[10px] w-[12px] ${
                isWished
                  ? 'animate-[heart-pulse_0.45s_ease-in-out] text-[#ff3d25]'
                  : 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]'
              }`}
              fill={isWished ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="flex flex-col px-[4px] max-[1152px]:min-h-[94px] max-[1152px]:px-[0px]">
        {/* 제목 */}
        <span className="line-clamp-2 text-[14px] leading-[19px] text-[#121212] max-[1152px]:text-[13px] max-[1152px]:leading-[18px]">
          {product.title}
        </span>

        {/* 정가 (취소선) */}
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="max:[1152px]:mt-[2px] mt-[4px] text-[12px] leading-[14px] text-[#949494] line-through">
            {product.originalPrice.toLocaleString()}원
          </span>
        )}

        {/* 할인율 및 펀매가 */}
        <div className="flex items-start text-[15px] leading-[24px] max-[1152px]:text-[13px] max-[1152px]:leading-[20px]">
          {discountRate && (
            <strong className="mr-[3px] font-bold text-[#d40022] max-[1152px]:mr-[2px]">
              {discountRate}%
            </strong>
          )}
          <strong className="text-[18px] font-bold text-[#121212] max-[1152px]:text-[16px]">
            {product.price.toLocaleString()}
          </strong>
          <span className="max-[1152px]:text-[14px] max-[1152px]:leading-[20px] max-[1152px]:font-medium">
            원
          </span>
        </div>

        {/* 배송비 */}
        {product.shippingFee > 0 && (
          <div className="mt-[2px] flex items-center gap-[1px] text-[12px] leading-[18px] font-normal text-[#949494]">
            <IconShipping className="h-[14px] w-[14px] text-[#949494]" />
            {product.shippingFee.toLocaleString()}원
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ProductCardVertical);
