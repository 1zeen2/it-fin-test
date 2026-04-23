'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '../AuthContext';

interface UserInfoModalProps {
  displayName: string;
  email?: string;
  profileImageSrc: string;
  onClose: () => void;
}

export default function UserInfoModal({
  displayName,
  profileImageSrc,
  email,
  onClose,
}: UserInfoModalProps) {
  const { logout } = useAuth();

  return (
    <div className="absolute top-[36px] right-0 z-50 w-[300px] rounded-[8px] border border-[#e3e5e8] bg-white p-[20px] shadow-[0_4px_16px_0_rgba(0,0,0,0.08)]">
      {/* 상단: 이름 및 로그아웃 */}
      <div className="flex items-center justify-between border-b border-[#f4f4f4] pb-[16px]">
        <div className="flex items-center gap-[10px]">
          {/* 프로필 이미지 영역: 추후 이미지 업로드 기능 연동 시 src만 교체하면 됨 */}
          <div className="relative h-[38px] w-[38px] overflow-hidden rounded-full bg-gray-100">
            <Image
              src={profileImageSrc}
              alt="모달 프로필 이미지"
              fill
              sizes="38px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <strong className="text-[15px] font-bold text-[#121212]">
              {displayName}님
            </strong>
            <span className="text-[12px] text-[#757575]">
              {email || '이메일 정보 없음'}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="rounded-[4px] border border-[#d3dadf] px-[8px] py-[4px] text-[11px] font-medium text-[#757575] transition-colors hover:bg-gray-50"
        >
          로그아웃
        </button>
      </div>

      {/* 중단: 네이버 스타일 메뉴 메뉴 */}
      <div className="flex gap-[12px] pt-[16px] text-[13px] text-[#555555]">
        <span className="cursor-pointer hover:underline">네이버ID</span>
        <span className="text-[#e3e5e8]">|</span>
        <span className="cursor-pointer hover:underline">보안설정</span>
        <span className="text-[#e3e5e8]">|</span>
        <span className="cursor-pointer hover:underline">내인증서</span>
      </div>

      {/* 하단: 멤버십 혜택 배너 (UI 목업) */}
      <div className="mt-[12px] flex cursor-pointer items-center justify-between rounded-[6px] bg-[#f8f9fa] p-[12px] transition-colors hover:bg-gray-100">
        <div className="flex items-center gap-[6px]">
          <span className="rounded-[4px] bg-[#03C75A] px-[4px] py-[2px] text-[10px] font-bold text-white">
            N + 멤버십
          </span>
        </div>
        <span className="text-[14px] font-bold text-[#121212]">
          1,981원 &gt;
        </span>
      </div>
    </div>
  );
}
