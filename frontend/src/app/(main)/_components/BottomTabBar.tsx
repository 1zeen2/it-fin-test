'use client';

import React from 'react';

export default function BottomTabBar() {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-50 flex h-[56px] justify-center bg-white shadow-[inset_0_1px_0_0_#e8ecef]">
      <div className="flex h-full w-full max-w-[568px] justify-between">
        {/* 홈 아이콘 */}
        <a
          href="https://shopping.naver.com/ns/home"
          className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212]"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M6.417 2a4.4 4.4 0 00-4.4 4.417l.042 11.2A4.4 4.4 0 006.459 22H17.54a4.4 4.4 0 004.4-4.384l.042-11.2A4.4 4.4 0 0017.583 2H6.418zm3.068 4.5a1.1 1.1 0 00-2.2 0c0 1.336.345 2.65 1.142 3.655.821 1.038 2.05 1.649 3.573 1.649 1.524 0 2.752-.611 3.574-1.649.796-1.005 1.141-2.319 1.141-3.655a1.1 1.1 0 00-2.2 0c0 .985-.257 1.773-.666 2.29-.383.483-.963.814-1.849.814s-1.466-.33-1.849-.815c-.409-.516-.666-1.304-.666-2.289z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="flex items-center text-[11px] leading-[13px] font-extrabold tracking-[-0.033px] text-[#121212]">
            홈
          </span>
        </a>

        {/* 카테고리 아이콘 */}
        <button className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212]">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeWidth="1.8"
              d="M10.115 6.522a3.61 3.61 0 11-7.22 0 3.61 3.61 0 017.22 0zm3.843-1.691c0-1.008.817-1.825 1.825-1.825h3.382c1.008 0 1.825.817 1.825 1.825v3.382a1.825 1.825 0 01-1.825 1.825h-3.382a1.825 1.825 0 01-1.825-1.825V4.83zM3.006 15.827c0-1.007.817-1.824 1.824-1.824h3.383c1.007 0 1.824.817 1.824 1.824v3.383a1.825 1.825 0 01-1.824 1.824H4.83a1.825 1.825 0 01-1.824-1.824v-3.383zm13.28-1.088a1.34 1.34 0 012.321 0l2.173 3.763a1.34 1.34 0 01-1.16 2.01h-4.346a1.34 1.34 0 01-1.16-2.01l2.172-3.763z"
            ></path>
          </svg>
          <span className="flex items-center text-[11px] leading-[13px] tracking-[-.033px]">
            카테고리
          </span>
        </button>

        {/* 검색 아이콘 */}
        <button className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212]">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M3.9 10a6.1 6.1 0 1112.2 0 6.1 6.1 0 01-12.2 0zM10 2.1a7.9 7.9 0 104.914 14.086l4.45 4.45a.9.9 0 001.273-1.272l-4.45-4.45A7.9 7.9 0 0010 2.1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="flex items-center text-[11px] leading-[13px] tracking-[-.033px]">
            검색
          </span>
        </button>

        {/* 마이쇼핑 아이콘 */}
        <a
          href="https://shopping.naver.com/my/home"
          className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212]"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M11.914 11.144a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm-7.879 9.391a1.379 1.379 0 01-1.379-1.379v0c0-.762.359-1.481.968-1.94a13.354 13.354 0 0116.066 0c.608.46.966 1.177.966 1.94v0a1.38 1.38 0 01-1.38 1.38H4.035z"
            ></path>
          </svg>
          <span className="flex items-center text-[11px] leading-[13px] tracking-[-.033px]">
            마이쇼핑
          </span>
        </a>

        {/* 세로 구분선 */}
        <div className="h-[40px] w-[1px] shrink-0 self-center bg-[#e6e6ea]"></div>

        {/* 네이버 아이콘 */}
        <button className="flex h-full flex-1 flex-col items-center justify-center gap-[4px] text-[#121212]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="#03C75A" rx="5.4"></rect>
            <path
              fill="#fff"
              d="M14.67 11.77l-3.885-5.61a.375.375 0 00-.308-.16H7.594a.234.234 0 00-.235.234v10.313c0 .13.105.234.235.234h3.001c.13 0 .235-.105.235-.234V11.01l3.885 5.609c.07.1.185.161.308.161h2.883c.13 0 .235-.105.235-.234V6.234A.234.234 0 0017.906 6h-3.001a.234.234 0 00-.235.234v5.536z"
            ></path>
          </svg>
          <span className="flex items-center text-[11px] leading-[13px] tracking-[-.033px] text-[#121212]">
            네이버
          </span>
        </button>
      </div>
    </div>
  );
}
