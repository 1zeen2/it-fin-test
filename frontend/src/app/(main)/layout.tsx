import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex w-full flex-1 flex-col">{children}</main>

      <footer className="border-t border-gray-100 bg-gray-50 p-[20px] text-center text-[13px] text-gray-500">
        본 프로젝트는 IT-FIN 과제 제출을 위해 제작되었습니다.
      </footer>
    </div>
  );
}
