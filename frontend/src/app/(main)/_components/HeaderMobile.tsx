'use client';

export default function HeaderMobile() {
  return (
    <header className="flex flex-col items-center justify-between">
      <div className="flex w-full items-center justify-between pr-[8px] pl-[16px]">
        <button className="flex h-[50px] cursor-pointer items-center">
          <svg className="h-[22px] w-[98px] fill-none" viewBox="0 0 108 22">
            <path
              fill="#7346F3"
              d="M42.02 22H22V0h20.02A1.98 1.98 0 0144 1.98v18.04A1.98 1.98 0 0142.02 22z"
            ></path>
            <path
              fill="#fff"
              d="M38.868 9.533h-4.4v-4.4h-2.935v4.4h-4.4v2.934h11.735V9.533zm-7.335 3.375v3.96h2.932v-2.022c0-1.402-1.483-1.938-2.932-1.938z"
            ></path>
            <path
              fill="#03C75A"
              d="M1.98 0H22v22H1.98A1.98 1.98 0 010 20.02V1.98A1.98 1.98 0 011.98 0z"
            ></path>
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M13.138 11.38L9.143 5.61H5.83v10.78H9.3v-5.77l3.996 5.769h3.313V5.61h-3.472v5.77z"
              clipRule="evenodd"
            ></path>
            <path
              fill="#7346F3"
              d="M68.037 17.2H49.5v2.73h18.537V17.2zM60.206 1.644h-2.873v4.455a3.514 3.514 0 01-2.047 3.196c-1.47.667-3.201 1.001-5.297 1.023l.029 2.869c2.503-.024 4.616-.442 6.458-1.278a6.322 6.322 0 002.294-1.776 6.321 6.321 0 002.294 1.776c1.842.836 3.955 1.254 6.458 1.278l.028-2.869c-2.095-.02-3.827-.354-5.296-1.023A3.514 3.514 0 0160.207 6.1V1.644zm28.548 15.578v2.708H70.217v-2.708h7.665v-2.607h3.138v2.607h7.734zM73.9 11.178V8.895h14.014V6.367H73.041a1.982 1.982 0 00-1.983 1.98v3.425c0 1.094.888 1.98 1.983 1.98h14.874v-2.574H73.9zm14.015-9.534H71.058v2.573h16.856V1.644zm8.247-.234c-1.587 0-2.852.513-3.792 1.536-.943 1.023-1.415 2.484-1.415 4.38v6.836c0 1.883.472 3.33 1.415 4.347.943 1.016 2.205 1.524 3.792 1.524 1.586 0 2.836-.508 3.792-1.524.956-1.017 1.436-2.464 1.436-4.347V7.326c0-1.896-.478-3.357-1.436-4.38-.959-1.023-2.221-1.536-3.792-1.536zm2.355 12.75c0 1.09-.21 1.894-.628 2.408-.418.515-.996.773-1.727.773-.732 0-1.329-.258-1.739-.773-.412-.514-.617-1.317-.617-2.409V7.324c0-1.076.205-1.874.617-2.398.412-.524.992-.785 1.739-.785.747 0 1.309.261 1.727.785.419.524.628 1.322.628 2.398v6.835zm6.441-12.84v7.26h-2.792v2.847h2.792v9.253h2.963V1.32h-2.963z"
            ></path>
          </svg>
        </button>
        <button className="cursor-pointer p-[8px]">
          <svg
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            className="_headerControl_icon_EaQfx"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
              d="M16.013 10.224v-4.42A4.003 4.003 0 0012.01 1.8v0a4.003 4.003 0 00-4.003 4.003v4.421"
            ></path>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20.644 7.707H3.356a.877.877 0 00-.854 1.077L4.662 18a3.508 3.508 0 003.416 2.707h7.845A3.508 3.508 0 0019.337 18l2.16-9.216a.877.877 0 00-.854-1.077z"
            ></path>
          </svg>
        </button>
      </div>
      <div className="w-full px-[16px]">
        <div className="flex h-[42px] items-center justify-between rounded-[8px] border border-[#7346f3] pr-[8px] pl-[7px] text-[15px] leading-[18px]">
          <div className="flex items-center justify-between gap-[2px]">
            <span className="p-[8px] text-[#7346f3] outline-none">
              <svg
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                className="text-[#7147f3]"
              >
                <circle
                  cx="10.412"
                  cy="10.412"
                  r="7.412"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                ></circle>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="M15.706 15.706L21 21"
                ></path>
              </svg>
            </span>
          </div>
          <input
            type="text"
            className="w-full pt-[1px] text-[16px] text-[#121212] outline-none placeholder:text-[#949494]"
            placeholder="상품명 또는 브랜드 입력"
          />
        </div>
      </div>
    </header>
  );
}
