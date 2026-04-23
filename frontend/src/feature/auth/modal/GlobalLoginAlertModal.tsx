'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginAlertModal } from '../LoginAlertModalContext';

export default function LoginAlertModal() {
  const router = useRouter();

  const { isModalOpen, closeLoginAlertModal } = useLoginAlertModal();

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    // 배경 오버레이
    <div
      onClick={closeLoginAlertModal}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/70"
    >
      {/* 모달 박스 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in fade-in zoom-in-95 flex w-[320px] flex-col overflow-hidden bg-white shadow-xl duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* 텍스트 */}
        <div className="flex flex-col items-center gap-[8px] p-[32px] text-center">
          <strong className="text-[18px] leading-[24px] whitespace-pre-line text-[#121212]">
            로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?
          </strong>
        </div>

        {/* 버튼 */}
        <div className="flex w-full border-t border-[#e8ecef99] text-[13px] leading-[50px] tracking-[-.065px]">
          <button
            onClick={() => {
              closeLoginAlertModal();
              router.push('/login');
            }}
            className="flex-1 cursor-pointer border-r border-[#e8ecef99] font-bold text-[#7346f3]"
          >
            로그인 하기
          </button>
          {/* 세로 구분선 */}

          <button
            onClick={closeLoginAlertModal}
            className="flex-1 cursor-pointer text-[#121212]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
