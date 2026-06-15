'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Image from 'next/image';

// 타입 정의 (interface)
interface Menu {
  id: number;
  name: string;
  imageUrl: string;
  menuCode: string;
  displayOrder: number | null;
  isActive: boolean;
}

export default function QuickMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get('/api/display/quick-menus');

        setMenus(response.data);
      } catch (error) {
        console.error('퀵 메뉴 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className="flex h-auto w-full flex-row items-center justify-center border-b border-[#e8ecef] pb-[39px]">
      <nav className="flex h-auto w-[1280px] flex-row justify-between overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="flex shrink-0 cursor-pointer flex-col items-center gap-2"
            onClick={() => console.log(`Menu Selected: ${menu.menuCode}`)}
          >
            <div className="relative h-[64px] w-[64px]">
              <Image
                src={menu.imageUrl}
                alt={menu.name}
                fill
                sizes="64px"
                unoptimized={true}
                className="rounded-[24px] object-cover"
              />
            </div>
            <span className="text-[14px] leading-[17px] text-[#757575]">
              {menu.name}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}
