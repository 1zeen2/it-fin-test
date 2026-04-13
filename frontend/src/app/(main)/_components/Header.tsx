'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Gnb from './Gnb';
import api from '@/lib/axios';
import { useAuth } from '@/feature/auth/AuthContext';
import Image from 'next/image';
import UserInfoModal from '@/feature/auth/components/UserInfoModal';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoggedIn, logout } = useAuth();

  const [userInfo, setUserInfo] = useState<{
    loginId: string;
    name: string;
    nickname?: string;
    email?: string;
    profileImageUrl?: string;
  } | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const displayName = userInfo?.nickname || userInfo?.name || '회원';
  const email = userInfo?.email;
  const profileImageSrc =
    userInfo?.profileImageUrl ||
    'https://ssl.pstatic.net/static/common/myarea/myInfo.gif';

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/api/users/me');
        setUserInfo(response.data);
      } catch (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다.', error);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn]);

  const handleSearch = async () => {
    const trimedQuery = searchQuery.trim();

    if (!trimedQuery) {
      setSearchQuery('');

      router.push('/search');
      return;
    }

    const externalUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(trimedQuery)}`;
    window.open(externalUrl, '_blank', 'noopener,noreferrer');

    api
      .post('/api/v1/trending-keywords/search', {
        keyword: trimedQuery,
      })
      .catch((error) => {
        console.error('검색어 카운트 로직 오류: ', error);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <header className="flex w-full flex-col items-center border-b border-[#e8ecef] bg-white">
      <div className="flex w-full max-w-[1280px] flex-col">
        <div className="flex h-auto w-full items-center justify-between">
          {/* row 1, col 1 */}
          <div className="flex items-center gap-[20px] text-[#757575]">
            {/* 네이버 아이콘 */}
            <a
              href="https://www.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="네이버 메인으로 이동"
            >
              <svg className="h-[10px] w-[46px] cursor-pointer fill-none">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M13.238.5l-3.46 8.952h2.941l.418-1.185h3.317l.418 1.185h2.942L16.354.5h-3.116zm1.558 2.82l.987 2.796h-1.974l.987-2.796zM29.245.5v8.952h6.966V7.258h-4.154V6.05h4.023V3.9h-4.023V2.694h4.067V.5h-6.879zm-3.85 0l-2.077 5.886L21.242.5H18.3l3.46 8.952h3.116L28.336.5h-2.941zM6.013.5v4.791L2.726.501H0v8.95h2.856v-4.79l3.287 4.79H8.87V.502H6.013zm35.821 4.169H40.32V2.782h1.514c.514 0 .93.422.93.943a.937.937 0 01-.93.944zm1.922 1.712l.268-.114c1.026-.435 1.547-1.378 1.547-2.573 0-1.131-.406-1.968-1.208-2.487C43.618.725 42.65.5 41.32.5h-3.726v8.952h2.769V6.95h.995l1.687 2.502h2.941l-2.23-3.071z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>

            {/* 네이버 페이 아이콘 */}
            <a
              href="https://pay.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer items-center gap-[2px]"
            >
              <svg
                className="box h-[14px] w-[13px] fill-none"
                viewBox="0 0 13 14"
              >
                <g clipPath="url(#IconNCircle13x14CurrentColor_svg__a)">
                  <path
                    fill="currentColor"
                    d="M13 7A6.5 6.5 0 110 7a6.5 6.5 0 0113 0zM7.587 3.945v3.268L5.312 3.945H3.445v6.118h1.966V6.785l2.275 3.27H9.56v-6.11H7.587z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="IconNCircle13x14CurrentColor_svg__a">
                    <path fill="#fff" d="M0 .5h13v13H0z"></path>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[12px]">네이버페이</span>
            </a>
          </div>

          {/* row 1 col 2 */}
          <div className="flex items-center gap-[8px]">
            {isLoggedIn ? (
              <div className="relative flex items-center">
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex cursor-pointer items-center gap-[2px] rounded-full hover:underline"
                >
                  <div className="relative h-[28px] w-[28px] overflow-hidden rounded-full border border-black/10">
                    <Image
                      src={profileImageSrc}
                      alt="프로필 이미지"
                      fill
                      sizes="28px"
                      priority
                      className="object-cover"
                    />
                  </div>
                  <span className="max-w-[62px] truncate text-[12px] font-medium text-black">
                    {displayName}님
                  </span>
                </button>

                <svg
                  width="12px"
                  height="12px"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="px-[8px] py-[11px]">
                  <a
                    href="https://talks.naver.com/?frm=pcgnb&anchor=&category="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[18px] w-[18px] cursor-pointer items-center"
                    style={{
                      backgroundImage:
                        'url(https://shopv.pstatic.net/web/modules/gnb/p/static/20240717_1600/img/sprite/svg/spGlobal_svg.svg)',
                      backgroundSize: '80px 73px',
                      backgroundPosition: '-30px -26px',
                    }}
                  ></a>
                </div>
                <div className="px-[12px] py-[11.5px]">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[17px] w-[16px] cursor-pointer items-center"
                    style={{
                      backgroundImage:
                        'url(https://shopv.pstatic.net/web/modules/gnb/p/static/20240717_1600/img/sprite/svg/spGlobal_svg.svg)',
                      backgroundSize: '80px 73px',
                      backgroundPosition: '-4px -52px',
                    }}
                  ></a>
                </div>
                <div className="px-[10px] py-[13px]">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[14px] w-[20px] cursor-pointer items-center"
                    style={{
                      backgroundImage:
                        'url(https://shopv.pstatic.net/web/modules/gnb/p/static/20240717_1600/img/sprite/svg/spGlobal_svg.svg)',
                      backgroundSize: '80px 73px',
                      backgroundPosition: '-32px -4px',
                    }}
                  ></a>
                </div>

                {isDropdownOpen && (
                  <UserInfoModal
                    onClose={() => setIsDropdownOpen(false)}
                    displayName={displayName}
                    profileImageSrc={profileImageSrc}
                    email={email}
                  />
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="mr-[8px] cursor-pointer rounded-[4px] border border-[#d3dadf] px-[7px] text-[11px] leading-[22px] font-medium text-[#121212]"
              >
                로그인
              </Link>
            )}
            <span className="text-[12px] text-[#dedadf]">|</span>
            <button className="flex h-auto w-auto cursor-pointer items-center justify-center p-[13px]">
              <div
                className="h-[14px] w-[14px]"
                style={{
                  backgroundImage:
                    'url(https://shopv.pstatic.net/web/modules/gnb/p/static/20240717_1600/img/sprite/svg/spGlobal_svg.svg)',
                  backgroundSize: '80px 73px',
                  backgroundPosition: '-28px -52px',
                }}
              ></div>
            </button>
          </div>
        </div>

        {/* row 2 col 1*/}
        <div className="flex h-auto w-full items-center justify-between py-[1px]">
          <div className="flex items-center justify-between gap-[24px]">
            <div className="flex items-center py-[20px]">
              <svg
                className="h-[22px] w-[108px] cursor-pointer fill-none"
                viewBox="0 0 108 22"
              >
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
            </div>

            {/* 메인 검색창 */}
            <div className="flex h-auto w-[500px] items-center justify-between rounded-[8px] border border-[#7346f3] pl-[18px] text-[15px] leading-[18px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-[#121212] outline-none placeholder:text-[#949494]"
                placeholder="상품명 또는 브랜드 입력"
              />
              <div className="flex h-auto w-auto items-center justify-between gap-[2px]">
                <div className="h-auto w-auto cursor-pointer px-[10px] py-[16px]">
                  <svg className="h-[8px] w-[12px] rotate-180 fill-none text-[#7346f3]">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M6.38.943a.5.5 0 00-.76 0L.707 6.675a.5.5 0 00.38.825h9.826a.5.5 0 00.38-.825L6.38.943z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>

                <span className="text-[12px] text-[#e8ecef]">|</span>
                <button
                  onClick={handleSearch}
                  className="mr-[3px] h-auto w-auto cursor-pointer p-[8px] text-[#7346f3] outline-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[24px] w-[24px] fill-none"
                  >
                    <circle
                      cx="10.412"
                      cy="10.412"
                      r="7.412"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    ></circle>
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M15.706 15.706L21 21"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* row 2 col 2 */}
          <div className="flex items-center gap-[26px] text-[13px] leading-[16px] font-medium text-[#121212]">
            <button className="flex h-auto w-auto cursor-pointer flex-col items-center gap-[4px] py-[6px]">
              <svg className="h-[28px] w-[28px] fill-none">
                <path
                  stroke="currentColor"
                  strokeWidth="1.3"
                  d="M12.365 8.522a3.86 3.86 0 11-7.72 0 3.86 3.86 0 017.72 0zm3.343-1.691c0-1.146.929-2.075 2.075-2.075h3.382c1.146 0 2.075.929 2.075 2.075v3.382a2.075 2.075 0 01-2.075 2.075h-3.382a2.075 2.075 0 01-2.075-2.075V6.83zM4.756 17.827c0-1.146.929-2.074 2.074-2.074h3.383c1.145 0 2.074.928 2.074 2.074v3.382a2.075 2.075 0 01-2.074 2.075H6.83a2.075 2.075 0 01-2.074-2.075v-3.382zm13.314-1.213a1.59 1.59 0 012.753 0l2.173 3.763a1.59 1.59 0 01-1.377 2.385h-4.345a1.59 1.59 0 01-1.377-2.385l2.173-3.763z"
                ></path>
              </svg>
              카테고리
            </button>
            <button className="flex h-auto w-auto cursor-pointer flex-col items-center gap-[4px] py-[6px]">
              <svg className="h-[28px] w-[28px] fill-none">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.3"
                  d="M13.915 13.144a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm-7.88 9.391a1.379 1.379 0 01-1.379-1.378v0c0-.763.36-1.482.968-1.94a13.354 13.354 0 0116.066 0c.608.459.966 1.176.966 1.938v0a1.38 1.38 0 01-1.38 1.38H6.035z"
                ></path>
              </svg>
              마이쇼핑
            </button>
            <button className="flex cursor-pointer flex-col items-center gap-[4px]">
              <svg className="h-[28px] w-[28px] fill-none">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.3"
                  d="M17.75 12.75V8A3.75 3.75 0 0014 4.25v0A3.75 3.75 0 0010.25 8v4.75"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.3"
                  d="M22.442 10.25H5.558a.836.836 0 00-.813 1.03l2.113 8.897a3.346 3.346 0 003.255 2.573h7.774a3.346 3.346 0 003.255-2.573l2.113-8.897a.836.836 0 00-.813-1.03z"
                ></path>
              </svg>
              장바구니
            </button>
          </div>
        </div>

        <div className="w-full">
          <Gnb />
        </div>
      </div>
    </header>
  );
}
