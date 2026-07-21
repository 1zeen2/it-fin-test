import Image from 'next/image';
import type { TodayPromotions } from '@/types/promotions';
import ViewAllLink from '@/components/common/ViewAllLink';

async function getTodayPromotions(): Promise<TodayPromotions[]> {
  try {
    const res = await fetch(
      'http://localhost:8080/api/display/today-promotions',
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      console.log('오늘의 특가 상품을 가져올 수 없습니다.');
      return [];
    }

    return res.json();
  } catch (err) {
    console.error('API 연결 실패 에러: ', err);
    return [];
  }
}

const gridDisplay = (idx: number) => {
  if (idx >= 12) return 'hidden';
  if (idx >= 10) return 'flex max-[1365px]:hidden max-[1152px]:flex';
  return 'flex';
};

export default async function TodayPromotions() {
  const promotions = await getTodayPromotions();

  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full items-center justify-center border-b border-[#e8ecef] pt-[29px] pb-[41px] max-[1152px]:pb-[29px]">
      <div className="flex w-full max-w-[1280px] flex-col items-center justify-between gap-[11px] max-[1365px]:w-[960px] max-[1152px]:w-full">
        {/* 타이틀 영역 */}
        <div className="flex w-full items-center justify-between py-[18px] max-[1152px]:px-4 max-[1152px]:pt-[2px] max-[1152px]:pb-2.5">
          <div className="flex gap-[6px] text-[24px] font-bold tracking-[-.5px] max-[1152px]:gap-1.25 max-[1152px]:text-[18px]">
            <span className="text-[#7346f3]">오늘의 행사</span>
            <span className="text-[#000]">놓치지 마세요!</span>
          </div>
          <ViewAllLink href="https://shopping.naver.com/promotion?type=RANKING" />
        </div>

        <div className="grid w-full grid-cols-6 gap-x-[16px] gap-y-[22px] max-[1365px]:grid-cols-5 max-[1152px]:grid-cols-[repeat(6,180px)] max-[1152px]:justify-start max-[1152px]:gap-x-[12px] max-[1152px]:gap-y-[16px] max-[1152px]:overflow-x-auto max-[1152px]:px-4 [&::-webkit-scrollbar]:hidden">
          {promotions.map((item, idx) => (
            <a
              key={item.id}
              href={item.linkUrl}
              className={`group flex-col gap-[10px] select-none max-[1152px]:w-[180px] max-[1152px]:gap-[8px] ${gridDisplay(idx)}`}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-[8px] max-[1152px]:rounded-[4px]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  priority={idx < 6}
                  sizes="(max-width: 1365px) 180px, 180px, (max-width: 1152px) 200px, 200px"
                  className="object-cover transition-transform duration-250 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 z-10 bg-black/3 transition-colors duration-250"></div>
                {item.badgeText && (
                  <span
                    className="absolute top-0 left-0 rounded-br-[8px] px-[8px] py-[2px] text-[14px] leading-[22px] font-bold text-[#fff] max-[1152px]:px-[6px] max-[1152px]:py-0 max-[1152px]:text-[12px]"
                    style={{ backgroundColor: item.badgeBgColor }}
                  >
                    {item.badgeText}
                  </span>
                )}
              </div>
              <p className="line-clamp-2 max-h-[36px] px-[4px] text-[14px] leading-[19px] font-normal tracking-[-0.5px] break-all text-[#121212] max-[1152px]:px-0 max-[1152px]:text-[13px]">
                {item.highlightText && (
                  <span className="mr-[4px] font-bold text-[#7346f3]">
                    {item.highlightText}
                  </span>
                )}
                {item.title}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
