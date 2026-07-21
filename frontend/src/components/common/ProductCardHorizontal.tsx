import { memo } from 'react';
import Image from 'next/image';
import type { BlogCurationProduct } from '@/types/product';
import IconHeart from './icons/IconHeart';
import IconShipping from './icons/IconShipping';

interface ProductCardProps {
  product: BlogCurationProduct;
  isWished: boolean;
  onWishClick: (productId: number) => void;
  className?: string;
}

function ProductCardHorizontal({
  product,
  isWished,
  onWishClick,
  className = '',
}: ProductCardProps) {
  const discountRate =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  return (
    <div
      className={`group relative flex flex-row items-center gap-[12px] max-[1152px]:items-start ${className}`}
    >
      <a href={product.linkUrl} className="absolute inset-0 z-10" />

      <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-[4px] max-[1152px]:h-[114px] max-[1152px]:w-[114px]">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          unoptimized={true}
          className="object-cover"
        />
        {/* 찜하기 버튼 */}
        <div className="absolute right-0 bottom-0 z-20 flex h-[40px] w-[40px] cursor-pointer items-center justify-center max-[1152px]:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWishClick(product.id);
            }}
            className="inline-flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/20"
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
      {/* 상품 정보 텍스트 */}
      <div className="flex flex-1 flex-col justify-center px-[4px] max-[1152px]:px-0">
        {/* 상품명 */}
        <span className="line-clamp-2 text-[14px] leading-[19px] text-[#121212] max-[1152px]:line-clamp-1 max-[1152px]:text-[12px] max-[1152px]:leading-[16px]">
          {product.title}
        </span>

        {/* 정가 (취소선) */}
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="mt-[2px] text-[12px] leading-[14px] text-[#949494] line-through max-[1152px]:text-[10px]">
            {product.originalPrice.toLocaleString()}원
          </span>
        )}

        {/* 할인률 및 판매가 */}
        <div className="mt-[2px] flex items-center text-[15px] leading-[20px] max-[1152px]:text-[13px]">
          {/* 할인률 */}
          {discountRate && (
            <strong className="mr-[3px] text-[#d40022] max-[1152px]:mr-[2px]">
              {discountRate}%
            </strong>
          )}
          {/* 판매가 */}
          <strong className="text-[16px] text-[#121212]">
            {product.price.toLocaleString()}
          </strong>
          <span className="text-[14px] font-medium">원</span>
        </div>

        {/* 배송비 */}
        {product.shippingFee > 0 && (
          <div className="mt-[2px] flex items-center gap-[2px] text-[12px] leading-[18px] font-normal text-[#949494] max-[1152px]:text-[10px]">
            <IconShipping className="h-[14px] w-[14px] text-[#949494]" />
            {product.shippingFee.toLocaleString()}원
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ProductCardHorizontal);
