"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { transform } from "next/dist/build/swc/generated-native";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = searchParams.get("pageNum") === "2" ? 2 : 1; // 2페이지 아니면 무조건 1페이지 (뒤로 가기 시 해당 페이지를 저장해두는 데 사용)
  const [lang, setLang] = useState("ko_KR"); // default는 한국어

  const languageLabels: Record<string, string> = {
    ko_KR: "한국어",
    en_US: "English",
    "zh-Hans_CN": "中文(简体)",
    "zh-Hant_TW": "中文(台灣)",
    ja_JP: "日本語",
  };

  const [agreements, setAgreements] = useState({
    // 약관 동의 상태 관리
    terms: false, // 필수
    realname: false, // 선택
    location: false, // 선택
    privacy: false, // 선택
    event: false, // 선택 (하위 요소)
  });

  // 개인정보 안내 (아코디언 토글) 상태 관리
  const [isPrivacyGuideOpen, setIsPrivacyGuideOpen] = useState(false);

  // 필수 약관 또는 전체 동의 상태 확인
  const isRequiredChecked = agreements.terms;
  const isAllChecked = Object.values(agreements).every(
    (value) => value === true,
  );

  // 전체 동의 체크 박스 핸들러
  const handleAllCheck = (checked: boolean) => {
    setAgreements({
      terms: checked,
      realname: checked,
      location: checked,
      privacy: checked,
      event: checked,
    });
  };

  // 개별 체크 박스 핸들러
  const handleSingleCheck = (
    name: keyof typeof agreements,
    checked: boolean,
  ) => {
    setAgreements((prev) => {
      const nextState = { ...prev, [name]: checked };

      // 개인정보 수집(privacy), 이벤트(event)는 함께 체크 / 해제 됨
      if (name === "privacy") {
        nextState.event = checked;
      } else if (name === "event") {
        nextState.privacy = checked;
      }

      return nextState;
    });
  };

  const handleNextPage = () => {
    if (!isRequiredChecked) {
      alert("필수 이용 약관에 동의해주세요.");
      return;
    }
    router.push(`${pathname}?pageNum=2`);
  };

  const handlePrevPage = () => {
    router.back();
  };

  // 회원 정보 입력 상태 관리 (2페이지)
  const [formData, setFormData] = useState({
    loginId: "",
    pwd: "",
    pwdConfirm: "",
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    email: "",
    phone: "",
  });

  // 회원 가입 폼 제출 핸들러
  const handleSignUpSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 백엔드 연동 로직 작성 예정
    console.log("회원가입 요청 데이터:", formData);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      {/* header */}
      <div className="flex w-[456px] items-center justify-between pt-[29px] pr-[2px] pb-[30px] pl-[4px]">
        {/* 네이버 로고 */}
        <div
          className="h-[18px] w-[94px] cursor-pointer bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
            backgroundSize: "380px 340px",
            backgroundPosition: "0 -258px",
          }}
          onClick={() => router.push("/")}
        />
        {/* 국적 표기 */}
        <div className="flex h-full w-auto items-center justify-center">
          {/* 지구본 */}
          <div
            className="h-[18px] w-[18px] bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
              backgroundPosition: "-350px -292px",
              backgroundSize: "380px 340px",
            }}
          />

          {/* 언어 셀렉트 박스 영역*/}
          <div className="relative flex h-full items-center justify-center">
            <select
              className="absolute inset-0 z-10 h-full w-auto cursor-pointer text-center text-[13px] opacity-0"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="ko_KR" className="text-[13px]">
                한국어
              </option>
              <option value="en_US" className="text-[13px]">
                English
              </option>
              <option value="zh-Hans_CN" className="text-[13px]">
                中文(简体)
              </option>
              <option value="zh-Hant_TW" className="text-[13px]">
                中文(台灣)
              </option>
              <option value="ja_JP" className="text-[13px]">
                日本語
              </option>
            </select>

            {/* 선택된 언어 표시 */}
            <div className="flex cursor-pointer items-center">
              <span className="ml-[6px] px-[16px] text-center text-[13px] font-normal text-[#303038]">
                {languageLabels[lang]}
              </span>
            </div>
          </div>

          {/* 아래 화살표 이미지 */}
          <div
            className="ml-[4px] flex h-[16px] w-[16px] bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
              backgroundPosition: "-168px -258px",
              backgroundSize: "380px 340px",
            }}
          />
        </div>{" "}
        {/* 헤더 우측 국적 표기 영역 */}
      </div>{" "}
      {/* header */}
      {/* 1페이지 body */}
      {currentPage === 1 && (
        <div className="w-[456px]">
          {/* 개인정보 동의 wrapper (border영역) */}
          <div className="flex flex-col rounded-[24px] border border-[rgba(0,0,0,0.1)] bg-white p-[27px_27px_31px] tracking-[-.5px]">
            {/* 전체 동의하기 영역 */}
            <div className="flex flex-col">
              <div
                className="flex cursor-pointer items-center gap-[2px]"
                onClick={() => handleAllCheck(!isAllChecked)}
              >
                {/* 체크 아이콘 */}
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px", // 헤더에서 썼던 사이즈와 동일하게 맞춰야 안 깨집니다.
                    backgroundPosition: isAllChecked
                      ? "-318px -224px"
                      : "-282px -200px",
                  }}
                />

                <label className="cursor-pointer text-[16px] font-bold text-[#1e1e23]">
                  전체 동의하기
                </label>
              </div>

              <p className="mt-[7px] ml-[32px] text-[13.5px] leading-[19px] font-medium text-[#929294]">
                실명 인증된 아이디로 가입, 위치기반서비스 이용약관(선택),
                이벤트・혜택 정보 수신(선택) 동의를 포함합니다.
              </p>
            </div>

            {/* 필수 이용 약관 */}
            <div className="mt-[24px] flex items-center justify-between">
              {/* 클릭 이벤트 */}
              <div
                className="flex cursor-pointer items-center gap-[2px]"
                onClick={() => handleSingleCheck("terms", !agreements.terms)}
              >
                {/* 체크 이미지 */}
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: agreements.terms
                      ? "-318px -224px"
                      : "-282px -200px",
                  }}
                />
                <span className="text-[14.5px] leading-[20px] font-medium text-[#03A94D]">
                  필수
                </span>
                <span className="ml-[1px] text-[14.5px] leading-[30px] font-medium text-[#222]">
                  회원 이용 약관
                </span>
              </div>

              <span className="text-[13.5px] leading-[19px] font-normal text-[#737373] underline">
                보기
              </span>
            </div>

            {/* 선택 실명 인증 */}
            <div className="mt-[12px] flex items-center justify-between">
              {/* 클릭 이벤트 */}
              <div
                className="flex cursor-pointer items-center gap-[2px]"
                onClick={() =>
                  handleSingleCheck("realname", !agreements.realname)
                }
              >
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: agreements.realname
                      ? "-318px -224px"
                      : "-282px -200px",
                  }}
                />

                <span className="text-[14.5px] leading-[30px] font-medium text-[#929294]">
                  선택
                </span>
                <span className="ml-[1px] text-[14.5px] leading-[30px] font-medium text-[#222]">
                  실명 인증된 아이디로 가입
                </span>
              </div>
            </div>

            {/* 선택 위치 정보 */}
            <div className="mt-[12px] flex items-center justify-between">
              {/* 클릭 이벤트 */}
              <div
                className="flex cursor-pointer items-center gap-[2px]"
                onClick={() =>
                  handleSingleCheck("location", !agreements.location)
                }
              >
                {/* 체크 이미지 */}
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: agreements.location
                      ? "-318px -224px"
                      : "-282px -200px",
                  }}
                />

                <span className="text-[14.5px] leading-[30px] font-medium text-[#929294]">
                  선택
                </span>
                <span className="ml-[1px] text-[14.5px] leading-[30px] font-medium text-[#222]">
                  위치기반서비스 이용약관
                </span>
              </div>

              <span className="text-[13.5px] leading-[19px] font-normal text-[#737373] underline">
                보기
              </span>
            </div>

            {/* 선택 개인정보 수집 (상위) */}
            <div className="mt-[12px] flex items-center justify-between">
              {/* 클릭 이벤트 */}
              <div
                className="flex cursor-pointer items-center gap-[2px]"
                onClick={() =>
                  handleSingleCheck("privacy", !agreements.privacy)
                }
              >
                {/* 체크 이미지 */}
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: agreements.privacy
                      ? "-318px -224px"
                      : "-282px -200px",
                  }}
                />

                <span className="text-[14.5px] leading-[30px] font-medium text-[#929294]">
                  선택
                </span>
                <span className="ml-[1px] text-[14.5px] leading-[30px] font-medium text-[#222]">
                  개인정보 수집 및 이용
                </span>
              </div>

              <span className="text-[13.5px] leading-[19px] font-normal text-[#737373] underline">
                보기
              </span>
            </div>

            {/* 선택 이벤트 혜택 (하위) */}
            <div className="mt-[7px] ml-[32px] flex items-center">
              {/* 클릭 이벤트 */}
              <div
                className="flex cursor-pointer items-center gap-[2px]"
                onClick={() => handleSingleCheck("event", !agreements.event)}
              >
                {/* 체크 이미지 */}
                <div
                  className="h-[16px] w-[16px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: agreements.event
                      ? "-186px -258px"
                      : "-132px -258px",
                  }}
                />

                <span className="ml-[1px] text-[13.5px] leading-[19px] font-normal text-[#737373]">
                  이벤트・혜택 정보 수신
                </span>
              </div>
            </div>

            {/* 개인정보 안내 토글 (UI 요소) */}
            <div className="mt-[20px] flex items-center justify-between">
              <div className="flex cursor-pointer items-center justify-between">
                <div
                  className="flex items-center gap-[2px]"
                  onClick={() => setIsPrivacyGuideOpen(!isPrivacyGuideOpen)}
                >
                  <div
                    className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                      backgroundSize: "380px 340px",
                      backgroundPosition: "-216px -96px",
                    }}
                  />

                  <span className="text-[14.5px] leading-[30px] font-medium tracking-[-.7px] text-[#222]">
                    개인정보 수집 및 이용 안내
                  </span>

                  <div
                    className="ml-[3px] h-[13px] w-[13px] shrink-0 bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                      backgroundSize: "380px 340px",
                      backgroundPosition: "-232px -184px",
                      transform: isPrivacyGuideOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </div>
              </div>

              <a
                href="#"
                className="z-10 text-[13.5px] leading-[19px] font-normal text-[#737373] underline"
                onClick={(e) => {
                  e.preventDefault();
                  alert("어린이용 안내 페이지로 이동");
                }}
              >
                어린이용 안내
              </a>
            </div>

            {isPrivacyGuideOpen && (
              <div className="mt-[8px] rounded-[8px] bg-[#f8f9fa] p-[15px]">
                <p className="mb-[23px] text-[13.5px] leading-[23px] font-normal text-[#767678]">
                  회원 가입 과정에서 개인정보 보호법 제15조제1항제4호(계약
                  체결/이행)에 따라, 다음과 같은 개인정보를 수집·이용합니다.
                </p>

                <p className="mb-[24px] text-[13.5px] leading-[23px] font-normal text-[#767678]">
                  수집하는 개인정보 항목 :<br />
                  [필수] 아이디, 비밀번호, 이름, 생년월일, 성별, 휴대전화번호,
                  실명 인증된 아이디로 가입 시 연계정보(CI), 중복가입
                  확인정보(DI), 내외국인 정보, 만14세 미만 아동의 경우
                  법정대리인정보 (법정대리인의 이름, 생년월일, 성별,
                  중복가입확인정보(DI), 휴대전화번호)
                  <br />
                  [선택] 이메일주소, 프로필 정보
                </p>
                <p className="text-[13.5px] leading-[23px] text-[#767678]">
                  ※ 선택 항목은 입력하지 않아도 회원 가입이 가능하며 회원 가입
                  이후 자유롭게 등록 가능합니다.
                  <br />
                  <strong className="font-bold text-[#767678]">
                    자세한 내용은{" "}
                    <a
                      href="https://policy.naver.com/policy/privacy.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      개인정보 처리방침
                    </a>
                    에서 확인하실 수 있습니다.
                  </strong>
                </p>
              </div>
            )}

            {/* 다음 버튼 */}
            <button
              type="button"
              onClick={handleNextPage}
              disabled={!isRequiredChecked}
              className={`mt-[23px] flex h-auto w-full items-center justify-center rounded-[8px] py-[12.5px] text-[15.5px] font-medium text-white ${isRequiredChecked ? "cursor-pointer bg-[#03A94D]" : "cursor-not-allowed bg-[#8990a0]"} `}
            >
              다음
            </button>

            {/* 하단 단체/비즈니스 링크 */}
            <div className="mt-[30px]">
              <span className="cursor-pointer text-[14.5px] leading-[20px] font-medium tracking-[-0.7px] text-[#03a94d] underline">
                단체, 비즈니스 회원 가입
              </span>
            </div>
          </div>{" "}
          {/* 개인정보 동의 wrapper (border영역) */}
        </div> // 1페이지 body
      )}
      {/* ========================================== */}
      {/* STEP 2. 회원 정보 입력 화면 (뼈대)            */}
      {/* ========================================== */}
      {currentPage === 2 && (
        <form onSubmit={handleSignUpSubmit} className="w-[456px]">
          <div className="mb-[20px] rounded-[12px] border border-[#dadada] bg-white p-[30px] text-center">
            <h2 className="text-[20px] font-bold">회원 정보 입력 (개발 중)</h2>
            <p className="mt-2 text-[14px] text-[#666]">
              이곳에 아이디, 비밀번호 폼이 위치할 예정입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-[10px] h-[54px] w-full rounded-[8px] bg-[#8990a0] text-[18px] font-bold text-white"
          >
            이전으로 돌아가기
          </button>
          <button
            type="submit"
            className="h-[54px] w-full rounded-[8px] bg-[#03c75a] text-[18px] font-bold text-white"
          >
            가입하기
          </button>
        </form>
      )}
    </div>
  );
}
