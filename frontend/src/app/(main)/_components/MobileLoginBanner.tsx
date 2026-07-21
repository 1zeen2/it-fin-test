import IconChevron from '@/components/common/icons/IconChevron';
import IconLock from '@/components/common/icons/IconLock';
import Link from 'next/link';

export default function MobileLoginBanner() {
  return (
    <div className="hidden w-full items-center justify-between border-b border-[#e8ecef] px-4 pt-[3px] pb-[13px] max-[1152px]:flex">
      {/* 텍스트 */}
      <div className="flex items-center text-[14px]">
        <IconLock className="h-5 w-5 text-[#7346f3]" />
        <p className="ml-1 font-bold">로그인</p>
        <p>하고 맞춤 혜택 받으세요</p>
      </div>

      <Link
        href="/login"
        className="flex h-4 w-auto items-center text-[#7346f3]"
      >
        <span className="text-[14px] leading-none font-bold">로그인하기</span>
        <IconChevron className="h-4 w-4" />
      </Link>
    </div>
  );
}
