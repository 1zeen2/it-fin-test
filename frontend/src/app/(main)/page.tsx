"use client";

import Header from "@/components/main/Header";
import HeroBanner from "@/components/main/HeroBanner";

export default function MainPage() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col bg-white">
        <Header />
      </div>

      {/* 본문 컨텐츠 뼈대 */}
      <section className="flex h-auto w-full items-center justify-center bg-[#FFF] text-[#888]">
        <HeroBanner />
      </section>

      <section className="flex h-[1000px] w-full flex-col items-center p-[20px] text-[#888]">
        [쇼핑 상품 리스트 스크롤 영역]
      </section>
    </div>
  );
}
