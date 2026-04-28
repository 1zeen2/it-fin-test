'use client';

import { useState, useRef, useEffect } from 'react';

export default function AdTooltip() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsTooltipOpen(false);
      }
    };

    if (isTooltipOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipOpen]);

  const handleToggleTooltip = () => {
    if (!isTooltipOpen && containerRef.current) {
      const bottonRect = containerRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - bottonRect.bottom;

      setPosition(spaceBelow < 150 ? 'top' : 'bottom');
    }

    setIsTooltipOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        onClick={handleToggleTooltip}
        className="w-[30px] cursor-pointer rounded-[6px] border border-[#e6e6ea] bg-white text-center"
      >
        <span className="text-[13px] leading-[18px] font-semibold text-[#2a2a2c]">
          AD
        </span>
      </button>

      {isTooltipOpen && (
        <div
          ref={tooltipRef}
          className={`absolute left-0 z-50 w-[210px] rounded-[8px] border border-[#3f3f3f] bg-white px-[15px] py-[11px] ${
            position === 'top'
              ? 'bottom-[calc(100%+4px)]'
              : 'top-[calc(100%+4px)]'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsTooltipOpen(false);
            }}
            className="float-right cursor-pointer text-[#949494]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.25"
                d="M4.166 4.167l11.667 11.666m0-11.667L4.166 15.833"
              ></path>
            </svg>
          </button>

          <p className="text-[13px] leading-[18px] tracking-[-0.5px] break-keep whitespace-pre-wrap text-[#121212]">
            이 광고는 개인화 정보를 기반으로 AiTEMS를 통해 자동 추천된 상품군을
            대상으로, 광고품질점수 및 입찰가 등을 반영하여 노출됩니다.
          </p>
        </div>
      )}
    </div>
  );
}
