interface IconShippingProps {
  className?: string;
}
export default function IconShipping({ className }: IconShippingProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="0.85" clipPath="url(#a)">
        <path
          d="M12.24 11.6a1.201 1.201 0 0 0-2.4 0 1.2 1.2 0 0 0 1.2 1.2c.666-.004 1.2-.54 1.2-1.2Zm-6.08 0a1.2 1.2 0 0 0-1.2-1.2c-.663 0-1.197.537-1.2 1.2a1.203 1.203 0 0 0 1.2 1.2 1.203 1.203 0 0 0 1.2-1.2Z"
          clipRule="evenodd"
        ></path>
        <path
          strokeLinecap="square"
          d="M7.667 4v0a.333.333 0 0 0-.334-.333h-5A.333.333 0 0 0 2 4v4.333m1.667 3.334H2.333A.333.333 0 0 1 2 11.333v-3m0 0h7.333m0-.006v-2.66c0-.184.15-.334.334-.334h2.794c.126 0 .241.072.298.185l1.206 2.412a.33.33 0 0 1 .035.149v3.254c0 .184-.15.334-.333.334h-1.334m-6 0h3.334"
        ></path>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h16v16H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
