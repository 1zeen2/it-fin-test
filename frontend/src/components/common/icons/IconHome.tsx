interface IconHomeProps {
  isActive: boolean;
  className?: string;
}

export default function IconHome({ isActive, className = '' }: IconHomeProps) {
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
          d="M6.417 2a4.4 4.4 0 00-4.4 4.417l.042 11.2A4.4 4.4 0 006.459 22H17.54a4.4 4.4 0 004.4-4.384l.042-11.2A4.4 4.4 0 0017.583 2H6.418zm3.068 4.5a1.1 1.1 0 00-2.2 0c0 1.336.345 2.65 1.142 3.655.821 1.038 2.05 1.649 3.573 1.649 1.524 0 2.752-.611 3.574-1.649.796-1.005 1.141-2.319 1.141-3.655a1.1 1.1 0 00-2.2 0c0 .985-.257 1.773-.666 2.29-.383.483-.963.814-1.849.814s-1.466-.33-1.849-.815c-.409-.516-.666-1.304-.666-2.289z"
          clipRule="evenodd"
        ></path>
      ) : (
        <g>
          <path
            stroke="currentColor"
            strokeWidth="1.8"
            d="M2.917 6.413a3.5 3.5 0 013.5-3.513h11.166a3.5 3.5 0 013.5 3.513l-.042 11.2a3.5 3.5 0 01-3.5 3.487H6.46a3.5 3.5 0 01-3.5-3.487l-.042-11.2z"
          ></path>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            d="M15.615 6.5c0 2.322-1.205 4.204-3.615 4.204S8.385 8.822 8.385 6.5"
          ></path>
        </g>
      )}
    </svg>
  );
}
