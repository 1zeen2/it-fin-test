'use client';

import { memo } from 'react';
import type { BlogCuration } from '@/types/product';
import ProductCardHorizontal from '@/components/common/ProductCardHorizontal';
import Image from 'next/image';

interface BlogCurationCardProps {
  curation: BlogCuration;
  wishList: number[];
  onWishClick: (productId: number) => void;
}

function BlogCurationCard({
  curation,
  wishList,
  onWishClick,
}: BlogCurationCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[8px] max-[1152px]:rounded-[4px]">
      <a
        href={curation.blogUrl}
        className="relative flex h-[164px] w-full flex-col justify-between gap-[6px] overflow-hidden rounded-[8px] px-[30px] py-[36px] text-white max-[1152px]:h-[128px] max-[1152px]:rounded-[4px] max-[1152px]:px-[20px] max-[1152px]:py-[26px]"
        style={{
          backgroundImage: `url(${curation.postThumbnailUrl})`,
          backgroundPosition: '50%',
          backgroundSize: 'cover',
        }}
      >
        <div
          className="absolute inset-0 z-0 rounded-[8px] bg-black/25 backdrop-blur-[30px] max-[1152px]:rounded-[4px]"
          aria-hidden="true" // 스크린 리더가 이 빈 박스를 읽지 않도록 처리 (단순 음영 + 블러)
        />
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 16.67%, transparent 60.67%), rgba(0, 0, 0, 0.25)',
          }}
          aria-hidden="true"
        />
        <div className="max-1152px relative z-10 flex h-full w-full items-center justify-between gap-[6px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex gap-[10px]">
              <span className="flex w-[43px] items-center justify-center rounded-full bg-[#03a94d] py-[6px] text-[34px] font-bold text-white max-[1152px]:py-[5px]">
                <svg
                  viewBox="0 0 31 14"
                  className="h-[13px] w-[31px] fill-none max-[1152px]:h-[12] max-[1152px]:w-[27px]"
                >
                  <path
                    fill="currentColor"
                    d="M26.707 2.749c1.007 0 1.838.337 2.335.863V2.88h1.84v6.725c0 2.944-1.752 4.395-4.175 4.395-1.226 0-2.263-.337-2.905-.702l.628-1.554c.467.263 1.313.562 2.292.562 1.226 0 2.204-.89 2.218-2.033v-.304c-.336.395-1.051.88-2.16.88-2.409 0-4.044-1.641-4.044-4.029s1.636-4.071 3.971-4.071m-24.75.898c.424-.453 1.27-.908 2.335-.908 2.35 0 3.868 1.626 3.868 4.043s-1.592 4.058-4 4.058c-1.007 0-1.854-.425-2.306-.88v.747H0V0h1.957zm9.586 4.424c0 .832.28 1 .73 1 .14 0 .268-.013.277-.014l.048-.006v1.736l-.037.006c-.003 0-.29.046-.601.046-1.02 0-2.374-.258-2.374-2.485V0h1.957zm5.954-5.333c2.467 0 4.087 1.729 4.087 4.043s-1.679 4.058-4.087 4.058-4.072-1.714-4.072-4.028c0-2.315 1.722-4.073 4.072-4.073m9.357 1.744c-1.284 0-2.16.996-2.16 2.315s.889 2.3 2.16 2.3c1.313 0 2.145-.996 2.145-2.3s-.862-2.315-2.145-2.315m-22.811 0c-1.299 0-2.146.967-2.146 2.3S2.76 9.08 4.057 9.08c1.33 0 2.146-.967 2.146-2.3s-.861-2.3-2.16-2.3m13.453.03c-1.255 0-2.116.967-2.116 2.284s.875 2.27 2.13 2.27c1.286 0 2.118-.967 2.118-2.27 0-1.304-.877-2.284-2.132-2.284"
                  ></path>
                </svg>
              </span>
              <span className="text-[14px] leading-[26px] text-gray-300 max-[1152px]:text-[13px] max-[1152px]:leading-[22px]">
                by. {curation.author}
              </span>
            </div>
            <strong className="line-clamp-2 max-h-[60px] text-[20px] leading-[30px] font-bold break-words break-keep max-[1152px]:h-[48px] max-[1152px]:text-[16px] max-[1152px]:leading-[24px]">
              {curation.postTitle}
            </strong>
          </div>
          <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-[4px] max-[1152px]:h-[70px] max-[1152px]:w-[70px]">
            <Image
              src={curation.postThumbnailUrl}
              alt="블로그 썸네일"
              fill
              unoptimized={true}
              className="object-cover"
            />
          </div>
        </div>
      </a>

      <div className="flex flex-col gap-[12px] pt-[20px] max-[1152px]:gap-[10px] max-[1152px]:pt-[10px] max-[1152px]:pr-[16px]">
        {curation.products.map((product) => {
          const isWished = wishList.includes(product.id);

          return (
            <ProductCardHorizontal
              key={product.id}
              product={product}
              isWished={isWished}
              onWishClick={onWishClick}
            />
          );
        })}
      </div>
    </div>
  );
}

export default memo(BlogCurationCard);
