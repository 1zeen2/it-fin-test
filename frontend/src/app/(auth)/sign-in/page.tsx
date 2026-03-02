'use client';

import React, { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import axios from 'axios';

export default function SignInPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [pwd, setPwd] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isIpSecurity, setIsIpSecurity] = useState(false);

  const toggleCheck = () => setIsChecked(!isChecked);

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/users/signIn', { loginId, pwd });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      router.push('/');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || '로그인 실패.';
        alert(errorMessage);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    // 전체 배경 흰색 바탕 (스파이더젠 기준)
    <div className='flex min-h-screen w-full flex-col bg-white'>
      
      {/* 1. Header: NAVER 로고 영역 (Spidergen 싱크로율 100%) */}
      <div className='flex h-auto w-full flex-col items-center justify-end pt-[96px] pb-[31px]'>
        <h1 className='text-[40px] font-normal tracking-[0.4px] text-[#03c75a]'>
          로그인
        </h1>
      </div>

      {/* 2. Body: 로그인 폼 영역 */}
      <div className='mx-auto h-auto w-full max-w-[460px]'>
        <div className='rounded-[8px]'>
          
          {/* 상단 3개 탭 (ID, 일회용 번호, QR코드) */}
          <div className='flex h-[55px] w-full text-[16px] font-medium leading-[20px] tracking-[-0.5px]'>
            <div className='flex flex-1 items-center justify-center gap-[8px] border-t border-l border-[#e1e3e5] rounded-tl-[8px]'>
              <div className='h-[16px] w-[16px] bg-no-repeat'
                style={{
                  backgroundImage: 'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                  backgroundPosition: '-54px -314px',
                  backgroundSize: '336px 330px'
                }}
              ></div>
              <span className='text-center text-[#333]'>ID/전화번호</span>
            </div>

            <div className='absolute left-[390px] h-[63px] w-[25px] bg-no-repeat'
              style={{
                backgroundImage: 'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                backgroundPosition: '-225px -104px',
                backgroundSize: '336px 330px'
              }}
            ></div>
            
            <div className='flex flex-1 items-center justify-center gap-[8px] border-r border-[#e1e3e5] bg-[#f5f6f4]'>
              <div className='h-[16px] w-[16px] bg-no-repeat'
                style={{
                  backgroundImage: 'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                  backgroundPosition: '-316px -294px',
                  backgroundSize: '336px 330px'
                }}
                ></div>
              <span className='text-center text-[#777]'>일회용 번호</span>
            </div>
            
            <div className='flex flex-1 items-center justify-center gap-[8px] bg-[#f5f6f4] rounded-tr-lg'>
              <div className='h-[16px] w-[16px] bg-no-repeat'
                style={{
                  backgroundImage: 'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                  backgroundPosition: '-18px -314px',
                  backgroundSize: '336px 330px'
                }}
                ></div>
              <span className='text-center text-[#777]'>QR코드</span>
            </div>
          </div>

          {/* 입력 폼 영역 */}
          <div className='border-l border-r border-b border-[#e1e3e5] p-[24px] rounded-b-[8px]'>
            <form onSubmit={handleLogin}>
              
              {/* 아이디 / 비밀번호 입력란 */}
              <div className='flex w-auto flex-col rounded-[8px] border border-[#c5ccd2] bg-white'>
  
                {/* 아이디 입력 (row 1) */}
                <div className='flex h-[60px] items-center gap-[8px] border-b border-[#c5ccd2] pl-[15px] pr-[12px]'>
                  {/* row 1의 col 1 */}
                  <div className='flex flex-1 min-w-0 flex-col justify-center'>
                    <label className='text-[12px] leading-[15px] text-[#767678] gap-[4px]'>
                      아이디 또는 전화번호
                    </label>
                    {/* row 1의 col 2 */}
                    <input
                      id='loginId'
                      type='text'
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      className='w-full text-[16px] font-normal leading-[22px] tracking-[-.2px] text-[#303038] focus:outline-none placeholder:text-[#bebebe] bg-transparent'
                      required
                    />
                  </div>

                  {/* 우측 X 버튼 */}
                  <button 
                    type='button'
                    onClick={() => setLoginId('')}
                    className='flex h-[22px] w-[22px] shrink-0 items-center justify-center'
                  >
                    {/* 우측 X 버튼의 이미지 (X 이미지) */}
                    <div 
                      className='h-[22px] w-[22px] bg-no-repeat'
                      style={{
                        backgroundImage: 'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundPosition: '-292px 0px',
                        backgroundSize: '336px 330px'
                      }}
                    />
                  </button>
                </div>

                {/* 2. 비밀번호 입력 (row 2) */}
                <div className='flex h-[60px] items-center gap-[8px] pl-[15px] pr-[12px]'>
                  {/* 좌측 영역: Label과 Input (Vertical) */}
                  <div className='flex flex-1 flex-col justify-center'>
                    <label className='text-[12px] leading-[15px] text-[#767678] gap-[4px]'>
                      비밀번호
                    </label>
                    <input
                      id='pwd'
                      type='password'
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      className='w-full text-[16px] font-normal leading-[22px] tracking-[-.2px] text-[#303038] focus:outline-none placeholder:text-[#bebebe]'
                      required
                    />
                  </div>
                  {/* 우측 X 버튼 */}
                  <button 
                    type='button'
                    onClick={() => setPwd('')}
                    className='flex h-[22px] w-[22px] shrink-0 items-center justify-center '
                  >
                    <div 
                      className='h-[22px] w-[22px] bg-no-repeat'
                      style={{
                        backgroundImage: 'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundPosition: '-292px 0px',
                        backgroundSize: '336px 330px'
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* 로그인 유지 & IP 보안 */}
              <div className='mt-[12px] flex items-center justify-between'>
                  <div 
                    className='keep_check flex items-center cursor-pointer group' 
                    id='keep' 
                    role='checkbox' 
                    aria-checked={isChecked} 
                    tabIndex={0}
                    onClick={toggleCheck}
                    onKeyDown={(e) => e.key === ' ' && toggleCheck()} // 스페이스바 지원
                  >
                    <input 
                      type='checkbox' 
                      id='nvlong' 
                      name='nvlong' 
                      tabIndex={-1} 
                      className='sr-only' // 화면에서 완전히 숨김
                      checked={isChecked}
                      readOnly
                    />

                    {/* 커스텀 체크박스 아이콘 (Sprite Image) */}
                    <div 
                      className='h-[20px] w-[20px] bg-no-repeat'
                      style={{
                        backgroundImage: 'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundSize: '336px 330px',
                        // 체크 여부에 따른 좌표 변경 (네이버 스프라이트 기준 예상 좌표)
                        // 활성화 시 녹색 체크, 비활성화 시 회색 체크
                        backgroundPosition: isChecked ? '-66px -292px' : '-292px -236px'
                      }}
                    />

                    {/* 텍스트 영역 */}
                    <span 
                      className={`ml-[8px] text-[14px] tracking-[-0.5px] ${
                        isChecked ? 'text-[#03c75a] font-medium' : 'text-[#767678]'
                      }`}
                    >
                    로그인 상태 유지
                  </span>
                </div>

                <div className='flex items-center gap-[4px] text-[14px]'>
                  <span className='text-[#303038]'>IP보안</span>
                  
                  <div className='relative inline-block h-[20px] w-[44px] cursor-pointer'>
                    <input 
                      type="checkbox" 
                      id="switch" 
                      className="sr-only" // 실제 체크박스는 숨김
                      checked={isIpSecurity}
                      onChange={() => setIsIpSecurity(!isIpSecurity)}
                    />
                    
                    <label 
                      htmlFor="switch" 
                      className={`relative block h-full w-full rounded-full transition-colors ${isIpSecurity ? 'bg-[#09aa5c]' : 'bg-[#a5adb8]'}`}
                    >
                      {/* ON 텍스트 */}
                      <span 
                        className={`absolute left-[7px] top-1/2 -translate-y-1/2 text-[11px] font-bold leading-[20px] tracking-[-.3px] text-white transition-opacity ${isIpSecurity ? 'opacity-100' : 'opacity-0'}`}
                        role="checkbox" 
                        aria-checked="true"
                      >
                        ON
                      </span>

                      {/* OFF 텍스트 */}
                      <span 
                        className={`absolute right-[4px] top-1/2 -translate-y-1/2 text-[11px] font-bold leading-[20px] tracking-[-.3px] text-white transition-opacity ${isIpSecurity ? 'opacity-0' : 'opacity-100'}`}
                        role="checkbox" 
                        aria-checked="false"
                      >
                        OFF
                      </span>

                      {/* 스위치 핸들 (동그란 버튼 - 스프라이트 이미지 적용 가능) */}
                      <span 
                        className={`absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-all duration-200 ${isIpSecurity ? 'left-[26px]' : 'left-[2px]'}`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 로그인 버튼 */}
              <button
                type='submit'
                className='mt-5 flex h-12.5 w-full items-center justify-center rounded-lg bg-[#09aa5c] text-[17px] font-bold text-white transition-colors hover:bg-[#089b53]'
              >
                로그인
              </button>

              {/* 디바이더 (지문 얼굴 인증) */}
              <div className='relative flex h-[62px] w-full items-center justify-center'>
                <div className='absolute left-0 top-1/2 h-px w-full bg-[#efeff0]'></div>
                <span className='relative z-1 bg-white px-[12px] text-[14px] font-normal leading-[18px] tracking-[-0.4px] text-[#767678]'>
                  지문 · 얼굴 인증을 설정했다면
                </span>
              </div>

              {/* 패스키 로그인 버튼 */}
              <button
                type='button'
                className='flex h-12.5 w-full items-center justify-center rounded-lg border border-[#09aa5c] text-[17px] font-bold text-[#09aa5c] leading-[24px] tracking-[-.4px] transition-colors hover:bg-[#f4fdf8]'
              >
                패스키 로그인
              </button>

            </form>
          </div>
        </div>

        {/* 아이디 찾기, 비밀번호 찾기, 회원가입 */}
        <div className='flex h-auto items-center justify-center gap-[13.5px] pb-[48px] pt-[16px] text-[14px] leading-[17px] text-[#888888]'>
          <a href='#' className='hover:underline'>아이디 찾기</a>
          <div className='h-3 w-px bg-[#dadada]'></div>
          <a href='#' className='hover:underline'>비밀번호 찾기</a>
          <div className='h-3 w-px bg-[#dadada]'></div>
          <a href='/sign-up' className='hover:underline'>회원가입</a>
        </div>

        {/* 광고 사진 영역 */}
        <div className='h-[147px] w-full bg-no-repeat bg-center'
          style={{
            backgroundImage: 'url("https://ssl.pstatic.net/melona/libs/1378/1378592/e5b279a38f384c6ab02e_20260227133414260.png")',
            backgroundSize: 'contain'
          }}
        >
            
        </div>

      </div>

      {/* 3. Footer 영역 */}
      <div className='flex flex-col items-center justify-center pb-8 pt-12 text-[#888] text-[12px] leading-[15px] tracking-[-.5px]'>
        <div className='flex items-center justify-center gap-[7.5px]'>
          <a href='#' className='hover:underline text-nowrap'>이용약관</a>
          <div className='h-[12px] w-px bg-[#dadada]'></div>
          <a href='#' className='font-bold text-[#888] hover:underline text-nowrap'>개인정보처리방침</a>
          <div className='h-[12px] w-px bg-[#dadada]'></div>
          <a href='#' className='hover:underline text-nowrap'>책임의 한계와 법적고지</a>
          <div className='h-[12px] w-px bg-[#dadada]'></div>
          <a href='#' className='hover:underline text-nowrap'>회원정보 고객센터</a>
        </div>
        <div className='mt-2 text-sm'>
          IT-FIN 과제 제출을 위해 제작하였습니다.
        </div>
      </div>

    </div>
  );
}