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

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get('/api/display/quick-menus');
        setMenus(response.data);
      } catch (error) {
        console.error('퀵 메뉴 로딩 실패:', error);
      }
    };
    fetchMenus();
  }, []);

  return (
    <div className="flex w-full justify-center border-b border-[#e8ecef] pb-[39px]">
      <nav className="flex w-full max-w-[1280px] items-center justify-between max-[1365px]:w-[960px] xl:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-full justify-between">
          {menus.map((menu, idx) => (
            <div
              key={menu.id}
              className={`shrink-0 cursor-pointer flex-col items-center gap-2 ${
                idx >= 10 ? 'hidden min-[1365px]:flex' : 'flex'
              }`}
              onClick={() => console.log(`Menu Selected: ${menu.menuCode}`)}
            >
              <div className="relative h-[64px] w-[64px]">
                <Image
                  src={menu.imageUrl}
                  alt={menu.name}
                  fill
                  sizes="64px"
                  unoptimized
                  className="rounded-[24px] object-cover"
                />
              </div>
              <span className="text-[14px] leading-[17px] text-[#757575]">
                {menu.name}
              </span>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
