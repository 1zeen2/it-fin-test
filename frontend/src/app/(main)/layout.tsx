import Header from "@/app/(main)/_components/Header";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex w-full flex-1 flex-col">{children}</main>

      <footer className="border-t border-gray-100 bg-gray-50 p-[20px] text-center text-[13px] text-gray-500">
        본 프로젝트는 개인 프로젝트를 위헤 제작되었으며, 상업적인 목적은 일절
        없음을 명확히 밝힙니다.
      </footer>
    </div>
  );
}
