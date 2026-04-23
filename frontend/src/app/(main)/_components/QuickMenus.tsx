'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Image from 'next/image';

// 타입 정의 (interface)
interface category {
  id: number;
  name: string; // SEO alt 텍스트
  imageUrl: string;
  categoryCode: string;
  displayOrder: number | null;
  isActive: boolean;
}

export default function QuickMenus() {
  const [categories, setCategories] = useState<category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/display/quick-menus');

        setCategories(response.data);
      } catch (error) {
        console.error('카테고리 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex h-auto w-full flex-row items-center justify-center border-b border-[#e8ecef] pb-[39px]">
      <nav className="flex h-auto w-[1280px] flex-row justify-between overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <div
            key={category.categoryCode}
            className="flex shrink-0 cursor-pointer flex-col items-center gap-2"
            onClick={() =>
              console.log(`Category Selected: ${category.categoryCode}`)
            }
          >
            <div className="relative h-[64px] w-[64px]">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="64px"
                className="rounded-[24px] object-cover"
              />
            </div>
            <span className="text-[14px] leading-[17px] text-[#757575]">
              {category.name}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}
