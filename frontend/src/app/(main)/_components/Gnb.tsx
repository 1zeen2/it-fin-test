'use client';

import { useState } from 'react';

const MENU_LIST = [
  '홈',
  '오늘끝딜',
  '컬리N마트',
  '베스트',
  '슈퍼적립',
  '쇼핑 라이브',
  '지금배달',
  '선물샵',
  '패션타운',
  'N배송',
  '푸드윈도',
  '하이엔드',
  '미스터',
  '기획전',
];

export default function Gnb() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <nav className="flex h-[54px] w-full items-center overflow-hidden py-[10px]">
      <ul className="flex w-[970px] items-center justify-between pb-[6px]">
        {MENU_LIST.map((menu, index) => {
          const isActive = activeIndex === index;
          return (
            <li key={menu}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group relative flex h-auto shrink-0 cursor-pointer items-center justify-center gap-[2px] pt-[9px] text-[15px] font-bold whitespace-nowrap ${
                  isActive
                    ? 'text-[#7346f3]'
                    : 'text-[#121212] hover:text-[#7346f3]'
                }`}
              >
                <span className="relative pb-[6px]">
                  {menu}

                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full bg-[#7346f3] ${
                      isActive ? 'block' : 'hidden group-hover:block'
                    }`}
                  />
                </span>

                {menu === '쇼핑 라이브' && (
                  <div className="flex items-center pb-[6px]">
                    <svg className="h-[12px] w-[12px] fill-none text-[#757575]">
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.25"
                        d="M4.734 2H2.761s0 0 0 0A.76.76 0 0 0 2 2.76v6.48c0 .42.34.76.76.76h6.464c.42 0 .76-.34.76-.76q0 0 0 0V7.274"
                      />
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.25"
                        d="M10 2v3.043M10 2H6.962M10 2 6.456 5.55"
                      />
                    </svg>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
