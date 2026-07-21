interface IconProps {
  className?: string;
}

export default function IconChevron({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
        d="M5.5 13.003l5-5-5-5"
      />
    </svg>
  );
}
