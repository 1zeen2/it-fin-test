interface IconSearchProps {
  className?: string;
}

export default function IconSearch({ className = '' }: IconSearchProps) {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3.9 10a6.1 6.1 0 1112.2 0 6.1 6.1 0 01-12.2 0zM10 2.1a7.9 7.9 0 104.914 14.086l4.45 4.45a.9.9 0 001.273-1.272l-4.45-4.45A7.9 7.9 0 0010 2.1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
