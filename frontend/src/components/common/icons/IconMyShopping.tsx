interface IconMyShoppingProps {
  isActive: boolean;
  className?: string;
}

export default function IconMyShopping({
  isActive,
  className = '',
}: IconMyShoppingProps) {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      {isActive ? (
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M12 2a4.75 4.75 0 100 9.5A4.75 4.75 0 0012 2zm-8.75 16.5c0-1.8 1.45-3.25 3.25-3.25h11c1.8 0 3.25 1.45 3.25 3.25V20c0 .55-.45 1-1 1H4.25c-.55 0-1-.45-1-1v-1.5z"
          clipRule="evenodd"
        />
      ) : (
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M11.914 11.144a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm-7.879 9.391a1.379 1.379 0 01-1.379-1.379v0c0-.762.359-1.481.968-1.94a13.354 13.354 0 0116.066 0c.608.46.966 1.177.966 1.94v0a1.38 1.38 0 01-1.38 1.38H4.035z"
        />
      )}
    </svg>
  );
}
