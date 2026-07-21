interface IconProps {
  className?: string;
  fill?: string;
}

export default function IconHeart({ className, fill = 'none' }: IconProps) {
  return (
    <svg viewBox="0 0 12 10" className={className} fill={fill}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        d="M5.096 1.408A2.6 2.6 0 0 0 3.263.667a2.6 2.6 0 0 0-1.832.741 2.503 2.503 0 0 0 0 3.598l4.56 4.388L10.7 4.867c.89-.985.842-2.512-.128-3.459A2.6 2.6 0 0 0 8.74.667c-.693 0-1.345.262-1.834.741L4.89 3.353a1.2 1.2 0 0 0-.386.881c0 .332.137.646.386.882a1.38 1.38 0 0 0 1.871 0l1.964-1.887"
      />
    </svg>
  );
}
