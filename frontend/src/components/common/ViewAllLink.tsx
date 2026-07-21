import Link from 'next/link';
import IconChevron from './icons/IconChevron';

interface ViewAllLinkProps {
  href: string;
  text?: string;
  className?: string;
}

export default function ViewAllLink({
  href,
  text = '전체보기',
  className = '',
}: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex cursor-pointer items-center text-[17px] text-[#757575] max-[1152px]:text-[14px]`}
    >
      <span>{text}</span>
      <IconChevron className="mb-[1px] h-[16px] w-[16px] text-[#757575] max-[1152px]:h-[14px] max-[1152px]:w-[14px]" />
    </Link>
  );
}
