import Image from 'next/image';
import { QuickMenu } from '@/types/menu';

async function getQuickMenus(): Promise<QuickMenu[]> {
  try {
    const res = await fetch('http://localhost:8080/api/display/quick-menus', {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error('퀵 메뉴 데이터를 가져올 수 없습니다.');
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('퀵 메뉴 API 연결 실패 에러: ', error);
    return [];
  }
}

export default async function QuickMenus() {
  const menus = await getQuickMenus();

  if (!menus || menus.length === 0) return null;

  return (
    <div className="flex w-full justify-center border-b border-[#e8ecef] pb-[39px] max-[1152px]:px-4 max-[1152px]:pt-[16px] max-[1152px]:pb-[17px]">
      <nav className="flex w-full max-w-[1280px] items-center justify-between max-[1365px]:w-[960px] max-[1152px]:w-full xl:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-full justify-between max-[1152px]:gap-4 max-[1152px]:overflow-x-auto">
          {menus.map((menu, idx) => (
            <a
              key={menu.id}
              href={menu.linkUrl}
              className={`shrink-0 cursor-pointer flex-col items-center gap-2 max-[1152px]:gap-1.25 ${
                idx >= 10
                  ? 'hidden max-[1152px]:flex min-[1365px]:flex'
                  : 'flex'
              }`}
            >
              <div className="relative h-[64px] w-[64px] max-[1152px]:h-12 max-[1152px]:w-12">
                <Image
                  src={menu.imageUrl}
                  alt={menu.name}
                  fill
                  sizes="64px (max-[1152px]:48px)"
                  unoptimized
                  className="rounded-[24px] object-cover max-[1152px]:rounded-[20px]"
                />
              </div>

              <span className="text-[14px] leading-[17px] text-[#757575] max-[1152px]:text-[12px]">
                {menu.name}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
