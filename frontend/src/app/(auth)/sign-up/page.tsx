"use client";

import React, { useState } from "react";
import type { SyntheticEvent } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { transform } from "next/dist/build/swc/generated-native";
import { error } from "console";
import api from "@/lib/axios";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ==========================================================================================
  /** 1페이지 상태 관리 */
  // ==========================================================================================

  /** default는 한국어 */
  const [lang, setLang] = useState("ko_KR");

  /** 약관 동의 */
  const [agreements, setAgreements] = useState({
    terms: false, // 필수
    realname: false, // 선택
    location: false, // 선택
    privacy: false, // 선택
    event: false, // 선택 (하위 요소)
  });

  /** 개인정보 안내 UI (아코디언 토글) */
  const [isPrivacyGuideOpen, setIsPrivacyGuideOpen] = useState(false);

  // ==========================================================================================
  /** 2페이지 상태 관리 */
  // ==========================================================================================

  /** 회원 정보 입력 */
  const [formData, setFormData] = useState({
    loginId: "",
    pwd: "",
    email: "",
    name: "",
    birth: "",
    telecom: "",
    gender: "",
    nationality: "LOCAL",
    phone: "",
  });

  /** 포커스 */
  const [focusedField, setFocusedField] = useState("");

  /** 비밀번호 표시 */
  const [showPwd, setShowpwd] = useState(false);

  /** 에러 메시지 */
  const [errors, setErrors] = useState({
    loginId: "",
    pwd: "",
    email: "",
    name: "",
    birth: "",
    telecom: "",
    phone: "",
  });

  /** 비밀번호 안전 등급 */
  const [pwdLevel, setPwdLevel] = useState("");

  /** 통신사 선택 UI (모달 토글) */
  const [isTelecomModalOpen, setIsTelecomModalOpen] = useState(false);

  /** 인증 약관 UI (아코디언 토글) */
  const [isAuthTermsOpen, setIsAuthTermsOpen] = useState(false);

  /** 약관 동의 UI */
  const [authAgreements, setAuthAgreements] = useState({
    privacy: false,
    uniqueId: false,
    telecom: false,
    authAgency: false,
    naverPrivacy: false,
  });

  // ==========================================================================================
  /** 정적 변수 선언 */
  // ==========================================================================================

  // 2페이지 아니면 무조건 1페이지
  const currentPage = searchParams.get("pageNum") === "2" ? 2 : 1;

  // 언어 선택 라벨 (전체 번역 현재 미구현 상태)
  const languageLabels: Record<string, string> = {
    ko_KR: "한국어",
    en_US: "English",
    "zh-Hans_CN": "中文(简体)",
    "zh-Hant_TW": "中文(台灣)",
    ja_JP: "日本語",
  };

  // ==========================================================================================
  /**
   *  파생 상태 모음 / 상태값 연산 로직
   */
  // ==========================================================================================

  /** 필수 약관 체크 */
  const isRequiredChecked = agreements.terms;

  /** 1페이지 약관 전체 동의 */
  const isAllChecked = Object.values(agreements).every(
    (value) => value === true,
  );

  /** 2페이지 필수 인증 약관 전체 동의 */
  const isAllAuthAgreed = Object.values(authAgreements).every(
    (val) => val === true,
  );

  // ==========================================================================================
  /**
   *  일반 이벤트 핸들러 / 유틸리티 함수
   *  [공통 & 유틸 로직]
   *  [입력 핸들러]
   */
  // ==========================================================================================

  // ==================================== [공통 & 유틸 로직] ====================================

  /** 유효성 검사 */
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "loginId":
        return /^[a-z0-9][a-z0-9_\-]{4,19}$/.test(value);
      case "pwd":
        return /^[A-Za-z0-9`\-=\\[\];',./~!@#$%^&*()_+|{}:"<>?]{8,16}$/.test(
          value,
        );
      case "email":
        return (
          !value ||
          /^[-_.~0-9a-zA-Z]+(\.[-_.~0-9a-zA-Z]+)*@[-_.0-9a-zA-Z]+(\.[0-9a-zA-Z]+)*/.test(
            value,
          )
        );
      case "name":
        // 한글과 영문 대/소문자 2~20자 (특수기호, 공백 사용 불가)
        return /^[가-힣a-zA-Z]{2,20}$/.test(value);
      case "birth":
        // 8자리 숫자 포맷 확인
        if (!/^\d{8}$/.test(value)) return false;

        const year = parseInt(value.substring(0, 4), 10);
        const month = parseInt(value.substring(4, 6), 10);
        const day = parseInt(value.substring(6, 8), 10);

        // Date 객체로 실제 존재하는 날짜인지 검증
        const birthDate = new Date(year, month - 1, day);

        // JS는 2월 30일을 3월 2일로 자동 변환하기 때문에
        // 입력한 년, 월, 일이 Date 객체 변환 후에도 정확히 일치하는지 크로스체크
        if (
          birthDate.getFullYear() !== year ||
          birthDate.getMonth() + 1 !== month ||
          birthDate.getDate() !== day
        ) {
          return false; // 없는 날짜 차단 ex) 2026 02 30
        }

        // 네이버 회원 가입 로직 그대로 (-110년 + 1일 제한) 계산
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간을 자정으로 초기화하여 날짜만 비교

        const minDate = new Date(
          today.getFullYear() - 110,
          today.getMonth(),
          today.getDate() + 1,
        );

        // 110년보다 더 과거이거나, 미래의 날짜 차단
        if (birthDate < minDate || birthDate > today) {
          return false;
        }

        return true;
      case "telecom":
        return value !== ""; // 통신사가 선택되었는지 확인

      case "phone":
        return /^010-\d{3,4}-\d{4}$/.test(value);

      default:
        return true;
    }
  };

  /** 비밀번호 안전 등급 UI */
  const evaluatePwdLevel = (pw: string) => {
    if (!pw) return "";

    const basicRegex = /^[A-Za-z0-9`\-=\\[\];',./~!@#$%^&*()_+|{}:"<>?]{8,16}$/;
    if (!basicRegex.test(pw)) return "사용불가";

    // 키보드 기준, 나열된 문자나 숫자 혹은 연속으로 반복되는 문자는 위험 등급으로 고정
    const hasSequentialPattern = (str: string) => {
      const lowerStr = str.toLocaleLowerCase();

      // 정규식으로 동일 문자 체크
      if (/(.)\1\1/.test(lowerStr)) {
        return true;
      }

      // 시퀀스에 해당하는 값 (키보드 상 -> 방향과 <- 방향만 4줄만 설정)
      const sequences = [
        "1234567890",
        "0987654321",
        "qwertyuiop",
        "poiuytrewq",
        "asdfghjkl",
        "lkjhgfdsa",
        "zxcvbnm,./",
        "/.,mnbvcxz",
      ];

      // 3글자 이상 연속되는 경우 해당
      for (let i = 0; i < lowerStr.length - 2; i++) {
        const chunk = lowerStr.substring(i, i + 3);

        if (sequences.some((seq) => seq.includes(chunk))) {
          return true;
        }
      }
      return false;
    };

    if (hasSequentialPattern(pw)) return "위험";

    let typesCount = 0;

    if (/[a-z]/.test(pw)) typesCount++;
    if (/[A-Z]/.test(pw)) typesCount++;
    if (/[0-9]/.test(pw)) typesCount++;
    if (/[^a-zA-Z0-9]/.test(pw)) typesCount++;

    if (typesCount < 2) return "위험";
    if (typesCount === 2) return pw.length >= 10 ? "보통" : "위험";
    if (typesCount >= 3) return pw.length >= 10 ? "안전" : "보통";

    return "위험";
  };

  // ====================================== [입력 핸들러] =======================================

  /** 입력값에 따라 <input> 초기화, 비밀번호 안전 등급하이픈(-), UI 출력 */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let tempValue = value;

    if (name === "phone") {
      tempValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: tempValue }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "pwd") {
      setPwdLevel(evaluatePwdLevel(tempValue));
    }
  };

  /** focus out 시 유효성 검사 및 에러 메시지 전달 */
  const handleBlur = (
    e:
      | React.FocusEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target;
    let errorMsg = "";

    switch (name) {
      case "loginId":
        if (!value) errorMsg = "아이디: 필수 정보입니다.";
        else if (!validateField("loginId", value))
          errorMsg =
            "아이디: 5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다.";
        break;

      case "pwd":
        if (!value) errorMsg = "비밀번호: 필수 정보입니다.";
        else if (!validateField("pwd", value))
          errorMsg =
            "비밀번호: 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.";
        break;

      case "email":
        if (!validateField("email", value))
          errorMsg = "이메일: 이메일 주소가 정확한지 확인해 주세요.";
        break;

      case "name":
        if (!value) errorMsg = "이름: 필수 정보입니다.";
        else if (!validateField("name", value))
          errorMsg =
            "이름: 한글과 영문 대/소문자를 사용하세요. (특수기호, 공백 사용 불가)";
        break;

      case "birth":
        if (!value) errorMsg = "생년월일: 필수 정보입니다.";
        else if (value.length !== 8)
          errorMsg = "생년월일: 생년월일은 8자리 숫자로 입력해 주세요.";
        else if (!validateField("birth", value))
          errorMsg = "생년월일: 생년월일이 정확한지 확인해 주세요.";
        break;

      case "telecom":
        if (!value) errorMsg = "통신사: 이용하는 통신사를 선택해 주세요.";
        break;

      case "phone":
        const rawValue = value.replace(/[^0-9]/g, "");
        let phone = rawValue;

        if (rawValue.length > 3 && rawValue.length <= 7) {
          phone = rawValue.replace(/(\d{3})(\d{1,4})/, "$1-$2");
        } else if (rawValue.length > 7) {
          phone = rawValue.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
        }

        setFormData((prev) => ({ ...prev, phone }));

        if (!rawValue) {
          errorMsg = "휴대전화번호: 필수 정보입니다.";
        } else if (!validateField("phone", phone)) {
          errorMsg = "휴대전화번호: 형식이 올바르지 않습니다.";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  /** focus out시 모달 닫기 */
  const handleTelecomSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, telecom: value }));
    setIsTelecomModalOpen(false);
    setFocusedField("");

    if (errors.telecom) {
      setErrors((prev) => ({ ...prev, telecom: "" }));
    }
  };

  // ================================ [1페이지 입력(약관) 핸들러] ================================

  /** 전체 동의 체크 박스 핸들러 */
  const handleAllCheck = (checked: boolean) => {
    setAgreements({
      terms: checked,
      realname: checked,
      location: checked,
      privacy: checked,
      event: checked,
    });
  };

  /** 개별 체크 박스 핸들러 */
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

  // =================================== [2페이지 입력 핸들러] ===================================

  /** 약관 전체 동의 핸들러 */
  const handleAuthAllCheck = () => {
    const nextState = !isAllAuthAgreed;

    setAuthAgreements({
      privacy: nextState,
      uniqueId: nextState,
      telecom: nextState,
      authAgency: nextState,
      naverPrivacy: nextState,
    });
  };

  /** 약관 동의 개별 체크 핸들러 */
  const handleAuthSingleCheck = (name: keyof typeof authAgreements) => {
    setAuthAgreements((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // ==========================================================================================
  /**
   *  최종 액션 핸들러
   *  [페이지 이동 & API 통신]
   */
  // ==========================================================================================

  /** 페이지 이동 */
  const handleNextPage = () => {
    if (!isRequiredChecked) {
      alert("필수 이용 약관에 동의해주세요.");
      return;
    }
    router.push(`${pathname}?pageNum=2`);
  };

  /** 회원 가입 폼 제출 핸들러 */
  const handleSignUpSubmit = async (
    e: SyntheticEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    e.preventDefault(); // 브라우저 새로고침 방지

    if (!isAllAuthAgreed) {
      alert("인증 약관 전체동의는 필수입니다.");
      return;
    }

    const requiredFields = [
      "loginId",
      "pwd",
      "name",
      "birth",
      "telecom",
      "gender",
      "nationality",
      "phone",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert("입력하지 않은 필수 항목이 있습니다.");
        return;
      }
    }

    const hasErrors = Object.values(errors).some((errorMsg) => errorMsg !== "");
    if (hasErrors) {
      alert("입력하신 정보의 형식을 다시 확인해 주세요.");
      return;
    }

    const apiPayload = {
      // 1페이지 데이터 (서비스 약관 동의)
      termsAgreed: agreements.terms, // [필수] 이용 약관
      lealnameAgreed: agreements.realname, // 실명 인증된 아이디로 가입
      locationAgreed: agreements.location, // 위치기반서비스 이용약관
      privacyAgreed: agreements.privacy, // 개인정보 수집 및 이용
      eventAgreed: agreements.event, // 이벤트, 혜택 정보 수신

      // 2페이지 데이터 (회원 정보 입력 + 인증 약관)
      loginId: formData.loginId,
      pwd: formData.pwd,
      email: formData.email,
      name: formData.name,
      birth: formData.birth,
      telecom: formData.telecom,
      gender: formData.gender,
      nationality: formData.nationality,
      phone: formData.phone,
      authTermsAgreed: isAllAuthAgreed, // [필수] 인증 약관 전체 동의
    };
    console.log("회원가입 요청 데이터:", apiPayload);

    try {
      const response = await api.post("api/auth/signup", apiPayload);
      if (response.status === 200 || response.status === 201) {
        alert("회원 가입이 완료되었습니다!");
        router.push("/login");
      }
    } catch (error) {
      console.error("회원가입 API 호출 실패", error);
      alert("회원가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // ==========================================================================================
  /** 화면 렌더링 */
  // ==========================================================================================

  return (
    <div className="flex min-h-screen w-full flex-col items-center pb-[20px]">
      {/* header */}
      <div className="flex w-[456px] items-center justify-between pt-[30px] pr-[2px] pb-[30px] pl-[4px]">
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
        {currentPage === 1 && (
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

            {/* 언어 셀렉트 박스 영역 */}
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
          </div>
        )}
      </div>{" "}
      {/* header */}
      {/* 1페이지 body */}
      {currentPage === 1 && (
        <div className="w-[456px] rounded-[24px] border border-[rgba(0,0,0,0.1)] p-[27px_27px_31px]">
          {/* 개인정보 동의 wrapper (border영역) */}
          <div className="flex flex-col tracking-[-.4px]">
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

                <label className="cursor-pointer text-[17px] font-bold text-[#1e1e23]">
                  전체 동의하기
                </label>
              </div>

              <p className="mt-[7px] ml-[32px] text-[14px] leading-[19px] font-medium break-keep text-[#929294]">
                실명 인증된 아이디로 가입, 위치기반서비스 이용약관(선택),
                이벤트・혜택 정보 수신(선택) 동의를 포함합니다.
              </p>
            </div>

            {/* 필수 이용 약관 */}
            <div className="mt-[24px] flex items-center justify-between">
              {/* 클릭 이벤트 */}
              <div
                className="flex cursor-pointer items-center gap-[2px] align-middle text-[15px] font-semibold"
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
                <span className="text-[#03A94D]">필수</span>
                <span className="ml-[1px] leading-[30px] text-[#222]">
                  회원 이용 약관
                </span>
              </div>

              <span className="text-[14px] leading-[19px] font-normal text-[#737373] underline">
                보기
              </span>
            </div>

            {/* 선택 실명 인증 */}
            <div className="mt-[12px] flex items-center justify-between text-[15px] leading-[20px] font-semibold text-[#929294]">
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

                <span>선택</span>
                <span className="ml-[1px] leading-[30px] text-[#222]">
                  실명 인증된 아이디로 가입
                </span>
              </div>
            </div>

            {/* 선택 위치 정보 */}
            <div className="mt-[12px] flex items-center justify-between">
              {/* 클릭 이벤트 */}
              <div
                className="flex cursor-pointer items-center gap-[2px] text-[15px] leading-[20px] font-semibold text-[#929294]"
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

                <span>선택</span>
                <span className="ml-[1px] leading-[30px] text-[#222]">
                  위치기반서비스 이용약관
                </span>
              </div>

              <span className="text-[14px] leading-[19px] font-normal text-[#737373] underline">
                보기
              </span>
            </div>

            {/* 선택 개인정보 수집 (상위) */}
            <div className="mt-[12px] flex items-center justify-between">
              {/* 클릭 이벤트 */}
              <div
                className="flex cursor-pointer items-center gap-[2px] text-[15px] leading-[20px] font-semibold text-[#929294]"
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

                <span>선택</span>
                <span className="ml-[1px] leading-[30px] text-[#222]">
                  개인정보 수집 및 이용
                </span>
              </div>

              <span className="text-[14px] leading-[19px] font-normal text-[#737373] underline">
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

                <span className="ml-[1px] text-[14px] leading-[19px] font-medium text-[#737373]">
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

                  <span className="text-[15px] leading-[30px] font-semibold text-[#222]">
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
                className="z-10 text-[14px] leading-[19px] font-normal text-[#737373] underline"
                onClick={(e) => {
                  e.preventDefault();
                  alert("어린이용 안내 페이지로 이동");
                }}
              >
                어린이용 안내
              </a>
            </div>

            {isPrivacyGuideOpen && (
              <div className="mt-[8px] rounded-[8px] bg-[#f8f9fa] p-[15px] text-[14px] leading-[23px] font-normal text-[#767678]">
                <p className="mb-[23px]">
                  회원 가입 과정에서 개인정보 보호법 제15조제1항제4호(계약
                  체결/이행)에 따라, 다음과 같은 개인정보를 수집·이용합니다.
                </p>

                <p className="mb-[24px]">
                  수집하는 개인정보 항목 :<br />
                  [필수] 아이디, 비밀번호, 이름, 생년월일, 성별, 휴대전화번호,
                  실명 인증된 아이디로 가입 시 연계정보(CI), 중복가입
                  확인정보(DI), 내외국인 정보, 만14세 미만 아동의 경우
                  법정대리인정보 (법정대리인의 이름, 생년월일, 성별,
                  중복가입확인정보(DI), 휴대전화번호)
                  <br />
                  [선택] 이메일주소, 프로필 정보
                </p>
                <p>
                  ※ 선택 항목은 입력하지 않아도 회원 가입이 가능하며 회원 가입
                  이후 자유롭게 등록 가능합니다.
                  <br />
                  <strong className="font-bold">
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
              <span className="cursor-pointer text-[15px] leading-[20px] font-medium text-[#03a94d] underline">
                단체, 비즈니스 회원 가입
              </span>
            </div>
          </div>{" "}
          {/* 개인정보 동의 wrapper (border영역) */}
        </div> // 1페이지 body
      )}
      {currentPage === 2 && (
        <div className="flex w-[456px] flex-1 flex-col justify-between">
          <div>
            {/* 실명 인증 타이틀 및 토글 영역 */}
            <div
              className="mt-[23px] flex items-center justify-end gap-[4px]"
              onClick={() =>
                handleSingleCheck("realname", !agreements.realname)
              }
            >
              <span className="cursor-pointer text-[13px] leading-[18px] tracking-[-.4px] text-[#929294]">
                실명 인증된 아이디로 가입
              </span>
              <div
                className="h-[20px] w-[20px] shrink-0 cursor-pointer bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                  backgroundSize: "380px 340px",
                  backgroundPosition: agreements.realname
                    ? "-350px -270px"
                    : "-350px -248px",
                }}
              />
            </div>

            {/* 아이디 / 비밀번호 / 이메일 입력 컨테이너 */}
            <div className="my-[9px] flex flex-col">
              {/* 아이디 */}
              <div
                className={`relative flex h-auto items-center justify-between gap-[6px] rounded-t-[6px] border py-[9px] pr-[13px] pl-[8px] ${
                  errors.loginId
                    ? "z-10 rounded-t-[6px] border border-[#ff3f3f]"
                    : focusedField === "loginId" &&
                        formData.loginId.length > 0 &&
                        !errors.loginId
                      ? "z-10 border-[#03A94D]"
                      : "border-[#dfdfdf]"
                } `}
              >
                {/* 사람 모양 아이콘 */}
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: errors.loginId
                      ? "-318px -160px"
                      : focusedField === "loginId" ||
                          (formData.loginId.length > 0 && !errors.loginId)
                        ? "-318px -32px"
                        : "-318px -192px",
                  }}
                />
                {/* 아이디 입력 필드 */}
                <input
                  type="text"
                  name="loginId"
                  value={formData.loginId}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("loginId")}
                  onBlur={(e) => {
                    setFocusedField("");
                    handleBlur(e);
                  }}
                  placeholder="아이디"
                  className={`h-full w-full cursor-pointer bg-transparent pb-[1px] text-[16px] leading-[22px] outline-none ${
                    errors.loginId
                      ? "text-[#ff3f3f] underline placeholder-[#ff3f3f]"
                      : "text-[#222] placeholder-[#8e8e8e]"
                  }`}
                />
                <span className="text-[15px] tracking-[-.2px] text-[#8e8e8e]">
                  @naver.com
                </span>
              </div>

              {/* 비밀번호 */}
              <div
                className={`relative -mt-[1px] flex h-auto items-center justify-between gap-[6px] border py-[9px] pr-[13px] pl-[8px] ${
                  errors.pwd
                    ? "z-10 border border-[#ff3f3f]"
                    : focusedField === "pwd" &&
                        formData.pwd.length > 0 &&
                        !errors.pwd
                      ? "z-10 border-[#03A94D]"
                      : "border-[#dfdfdf]"
                }`}
              >
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: errors.pwd
                      ? "-318px -96px"
                      : focusedField === "pwd" ||
                          (formData.pwd.length > 0 && !errors.pwd)
                        ? "-318px -128px"
                        : "-318px -64px",
                  }}
                />
                {/* 비밀번호 입력 필드 */}
                <input
                  type={showPwd ? "text" : "password"}
                  name="pwd"
                  value={formData.pwd}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("pwd")}
                  onBlur={(e) => {
                    setFocusedField("");
                    handleBlur(e);
                  }}
                  placeholder="비밀번호"
                  className={`h-full w-full cursor-pointer pb-[1px] text-[16px] leading-[22px] outline-none ${
                    errors.pwd
                      ? "text-[#ff3f3f] underline placeholder-[#ff3f3f]"
                      : "text-[#222] placeholder-[#8e8e8e]"
                  }`}
                />
                {/* 비밀번호 안전도 메시지 출력 */}
                {pwdLevel && (
                  <div
                    className={`flex shrink-0 items-center justify-center rounded-[10px] px-[6px] pt-[4px] pb-[3px] text-[11px] leading-[13px] font-bold tracking-[-.4px] ${
                      pwdLevel === "사용불가" || pwdLevel === "위험"
                        ? "bg-[rgba(236,62,59,0.12)] text-[#eb0000]"
                        : pwdLevel === "보통"
                          ? "bg-[rgba(255,168,0,0.12)] text-[#ffa41c]"
                          : pwdLevel === "안전"
                            ? "bg-[rgba(3,169,77,0.12)] text-[#03A94D]"
                            : ""
                    }`}
                  >
                    {pwdLevel}
                  </div>
                )}
                {/* 비밀번호 표시 아이콘 토글 */}
                <div
                  className="h-[30px] w-[30px] shrink-0 cursor-pointer bg-no-repeat"
                  onClick={() => setShowpwd(!showPwd)}
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: showPwd
                      ? "-288px -310px"
                      : "-258px -278px",
                  }}
                />
              </div>

              {/* 본인 확인 이메일 */}
              <div
                className={`relative -mt-[1px] flex h-auto w-full items-center justify-between gap-[6px] rounded-b-[6px] border py-[9px] pr-[13px] pl-[8px] ${
                  errors.email
                    ? "z-10 border-[#ff3f3f]"
                    : focusedField === "email" &&
                        formData.email.length > 0 &&
                        !errors.email
                      ? "z-10 border-[#03A94D]"
                      : "border-[#dfdfdf]"
                } `}
              >
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: errors.email
                      ? "-318px 0"
                      : focusedField === "email" ||
                          (formData.email.length > 0 && !errors.email)
                        ? "-216px -128px"
                        : "-160px -310px",
                  }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={(e) => {
                    setFocusedField("");
                    handleBlur(e);
                  }}
                  placeholder="[선택] 이메일주소 (비밀번호 찾기 등 본인 확인용)"
                  className={`h-full w-full cursor-pointer pb-[1px] text-[16px] leading-[22px] outline-none ${
                    errors.email
                      ? "text-[#ff3f3f] underline placeholder:text-[#ff3f3f]"
                      : "text-[#222] placeholder:text-[#8e8e8e]"
                  }`}
                />
                <div className="h-[30px] w-[30px] shrink-0" />{" "}
                {/* 간격 맞춤용 빈 박스 */}
              </div>
              {/* 유효성 검사에 대한 멘트 출력 영역 */}
              {(errors.loginId || errors.pwd || errors.email) && (
                <div className="mt-[10px] flex flex-col px-[4px]">
                  {errors.loginId && (
                    <div className="flex items-start gap-[5px] text-[13px] leading-[18px] tracking-[-.4px] text-[#ff3f3f]">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-[50%] bg-[#ff3f3f]" />
                      <span>{errors.loginId}</span>
                    </div>
                  )}

                  {errors.pwd && (
                    <div className="flex items-start gap-[5px] text-[13px] leading-[18px] tracking-[-.4px] text-[#ff3f3f]">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-[50%] bg-[#ff3f3f]" />
                      <span>{errors.pwd}</span>
                    </div>
                  )}

                  {errors.email && (
                    <div className="flex items-start gap-[5px] text-[13px] leading-[18px] tracking-[-.4px] text-[#ff3f3f]">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-[50%] bg-[#ff3f3f]" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. 이름 / 생년월일 / 통신사 / 성별 / 내외국인 컨테이너 */}
            <div className="my-[10px] flex flex-col">
              {/* 이름 */}
              <div
                className={`relative flex h-auto w-full items-center justify-between gap-[6px] rounded-t-[6px] border py-[9px] pr-[13px] pl-[8px] ${
                  errors.name
                    ? "z-10 border-[#ff3f3f]"
                    : focusedField === "name" &&
                        formData.name.length > 0 &&
                        !errors.name
                      ? "z-10 border-[#03A94D]"
                      : "border-[#dfdfdf]"
                }`}
              >
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: errors.name
                      ? "-318px -160px"
                      : focusedField === "name" ||
                          (formData.name.length > 0 && !errors.name)
                        ? "-318px -32px"
                        : "-318px -192px",
                  }}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={(e) => {
                    setFocusedField("");
                    handleBlur(e);
                  }}
                  placeholder="이름"
                  className={`h-full w-full cursor-pointer bg-transparent text-[15px] leading-[22px] font-normal outline-none ${
                    errors.name
                      ? "text-[#ff3f3f] underline placeholder:text-[#ff3f3f]"
                      : "text-[#222] placeholder:text-[#8e8e8e]"
                  }`}
                />
                <div className="h-[30px] w-[30px] shrink-0" />
              </div>

              {/* 생년월일 */}
              <div
                className={`relative -mt-[1px] flex h-auto w-full items-center justify-between gap-[6px] border py-[9px] pr-[13px] pl-[8px] ${
                  errors.birth
                    ? "z-10 border-[#ff3f3f]"
                    : focusedField === "birth" &&
                        formData.birth.length > 0 &&
                        !errors.birth
                      ? "z-10 border-[#03A94D]"
                      : "border-[#dfdfdf]"
                }`}
              >
                <div
                  className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                    backgroundSize: "380px 340px",
                    backgroundPosition: errors.birth
                      ? "-96px -310px"
                      : focusedField === "birth" ||
                          (formData.birth.length > 0 && !errors.birth)
                        ? "-64px -310px"
                        : "-128px -310px",
                  }}
                />
                <input
                  type="text"
                  name="birth"
                  value={formData.birth}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("birth")}
                  onBlur={(e) => {
                    setFocusedField("");
                    handleBlur(e);
                  }}
                  placeholder="생년월일 8자리"
                  maxLength={8}
                  className={`h-full w-full cursor-pointer bg-transparent pb-[1px] text-[16px] leading-[22px] outline-none ${
                    errors.birth
                      ? "text-[#ff3f3f] underline placeholder:text-[#ff3f3f]"
                      : "text-[#222] placeholder:text-[#8e8e8e]"
                  }`}
                />
                <div className="h-[30px] w-[30px] shrink-0" />
              </div>

              {/* 통신사 선택 */}
              <div className="relative w-full">
                <div
                  className={`relative -mt-[1px] flex h-auto w-full items-center gap-[6px] border py-[9px] pr-[13px] pl-[8px] ${
                    errors.telecom
                      ? "z-10 border-[#ff3f3f]"
                      : focusedField === "telecom" || isTelecomModalOpen
                        ? "z-10 border-[#03A94D]"
                        : "border-[#dfdfdf]"
                  }`}
                >
                  {/* 통신사 아이콘 */}
                  <div
                    className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                      backgroundSize: "380px 340px",
                      backgroundPosition: errors.telecom
                        ? "-32px -310px"
                        : formData.telecom
                          ? "-318px -256px"
                          : "-32px -310px",
                    }}
                  />

                  <div
                    className="flex flex-1 cursor-pointer items-center justify-between"
                    onClick={() => {
                      setIsTelecomModalOpen(!isTelecomModalOpen);
                      setFocusedField("telecom");
                    }}
                  >
                    {/* 텍스트 */}
                    <div
                      className={`text-[16px] leading-[22px] tracking-[-.8px] ${
                        formData.telecom
                          ? "text-[#222]"
                          : errors.telecom
                            ? "text-[#ff3f3f]"
                            : "text-[#8e8e8e]"
                      }`}
                    >
                      {formData.telecom === ""
                        ? "통신사 선택"
                        : formData.telecom === "SKT"
                          ? "SKT"
                          : formData.telecom === "KT"
                            ? "KT"
                            : formData.telecom === "LG"
                              ? "LG U+"
                              : formData.telecom === "SKT_MVNO"
                                ? "SKT 알뜰폰"
                                : formData.telecom === "KT_MVNO"
                                  ? "KT 알뜰폰"
                                  : "LG U+ 알뜰폰"}
                    </div>

                    {/* 모달 오픈 시 화살표 아이콘 rotate */}
                    <div
                      className="h-[16px] w-[16px] shrink-0 cursor-pointer bg-no-repeat"
                      style={{
                        backgroundImage:
                          'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                        backgroundSize: "380px 340px",
                        backgroundPosition: "-96px -258px",
                        transform: isTelecomModalOpen
                          ? "rotate(180deg)"
                          : "roteta(0deg)",
                      }}
                    />
                  </div>
                </div>

                {/* 그리드 드롭다운 */}
                {isTelecomModalOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => {
                        setIsTelecomModalOpen(false);
                        setFocusedField("");
                        handleBlur({
                          target: { name: "telecom", value: formData.telecom },
                        });
                      }}
                    />
                    <div className="absolute top-[calc(100%-8px)] left-[40px] z-20 w-max overflow-hidden rounded-[6px] border border-[#c6c6c6] shadow-[1px_1px_10px_rgba(18,28,70,.08)]">
                      <ul
                        role="menu"
                        className="grid grid-cols-2 gap-[1px] bg-[#f2f2f2] pb-[1px]"
                      >
                        {[
                          { id: "SKT", label: "SKT" },
                          { id: "SKT_MVNO", label: "SKT 알뜰폰" },
                          { id: "KT", label: "KT" },
                          { id: "KT_MVNO", label: "KT 알뜰폰" },
                          { id: "LG", label: "LG U+" },
                          { id: "LG_MVNO", label: "LG U+ 알뜰폰" },
                        ].map((item) => (
                          <li
                            key={item.id}
                            role="presentation"
                            className="bg-white"
                          >
                            <button
                              type="button"
                              role="menuitem"
                              className="flex w-full cursor-pointer items-center py-[10.5px] pr-[19.5px] pl-[8px] text-left text-[14px] leading-[18px] font-normal tracking-[-.8px] text-[#222]"
                              onClick={() => handleTelecomSelect(item.id)}
                            >
                              <span className="text">{item.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* 성별 및 내외국인 버튼 영역 */}
              <div className="relative -mt-[1px] flex w-full items-center justify-between gap-[10px] rounded-b-[6px] border border-[#c6c6c6] px-[10px] py-[8px] text-[13px] leading-[18px]">
                {/* 성별 (남자/여자) */}
                <div className="flex h-auto flex-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, gender: "M" }))
                    }
                    className={`relative flex-1 rounded-l-[4px] border py-[6px] font-medium ${
                      formData.gender === "M"
                        ? "z-10 border-[#03A94D] text-[#03A94D]"
                        : "border-[#c6c6c6] text-[#929294]"
                    }`}
                  >
                    남자
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, gender: "F" }))
                    }
                    className={`relative -ml-[1px] flex-1 rounded-r-[4px] border py-[6px] font-medium ${
                      formData.gender === "F"
                        ? "z-10 border-[#03A94D] text-[#03A94D]"
                        : "border-[#c6c6c6] text-[#929294]"
                    }`}
                  >
                    여자
                  </button>
                </div>

                {/* 내외국인 */}
                <div className="flex h-auto flex-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, nationality: "LOCAL" }))
                    }
                    className={`relative flex-1 rounded-l-[4px] border py-[6px] font-medium ${
                      formData.nationality === "LOCAL"
                        ? "z-10 border-[#03A94D] text-[#03A94D]"
                        : "border-[#dfdfdf] text-[#929294]"
                    }`}
                  >
                    내국인
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        nationality: "FOREIGN",
                      }))
                    }
                    className={`relative -ml-[1px] flex-1 rounded-r-[4px] border py-[6px] font-medium ${
                      formData.nationality === "FOREIGN"
                        ? "z-10 border-[#03A94D] text-[#03A94D]"
                        : "border-[#dfdfdf] text-[#929294]"
                    }`}
                  >
                    외국인
                  </button>
                </div>
              </div>

              {/* 유효성 검사 에러 멘트 (이름, 생년월일, 통신사) */}
              {(errors.name || errors.birth || errors.telecom) && (
                <div className="mt-[9px] flex flex-col gap-[4px] px-[4px]">
                  {errors.name && (
                    <div className="flex items-start gap-[5px] text-[13px] leading-[18px] text-[#ff3f3f]">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-[#ff3f3f]" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                  {errors.birth && (
                    <div className="flex items-start gap-[5px] text-[13px] leading-[18px] text-[#ff3f3f]">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-[#ff3f3f]" />
                      <span>{errors.birth}</span>
                    </div>
                  )}
                  {errors.telecom && (
                    <div className="flex items-start gap-[5px] text-[13px] leading-[18px] text-[#ff3f3f]">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-[#ff3f3f]" />
                      <span>{errors.telecom}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 휴대전화 번호 */}
            <div
              className={`relative flex h-auto w-full items-center justify-between gap-[6px] rounded-[6px] border py-[9px] pr-[13px] pl-[8px] ${
                errors.phone
                  ? "z-10 border-[#ff3f3f]"
                  : focusedField === "phone" &&
                      formData.phone.length > 0 &&
                      !errors.phone
                    ? "z-10 border-[#03A94D]"
                    : "border-[#dfdfdf]"
              }`}
            >
              <div
                className="h-[30px] w-[30px] shrink-0 bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                  backgroundSize: "380px 340px",
                  backgroundPosition: "-192px -310px",
                }}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={(e) => {
                  setFocusedField("phone");
                  setFormData((prev) => ({
                    ...prev,
                    phone: prev.phone.replace(/-/g, ""),
                  }));
                }}
                onBlur={(e) => {
                  setFocusedField("");
                  handleBlur(e);
                }}
                placeholder="휴대전화번호"
                maxLength={11}
                className="h-full w-full cursor-pointer text-[15px] leading-[22px] placeholder-[#8e8e8e] outline-none"
              />
              <div className="h-[30px] w-[30px] shrink-0" />
            </div>

            {errors.phone && (
              <div className="mt-[9px] flex items-start gap-[5px] px-[4px] text-[13px] leading-[18px] text-[#ff3f3f]">
                <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-[50%] bg-[#ff3f3f]" />
                <span>{errors.phone}</span>
              </div>
            )}

            {/* 인증 약관 동의 UI */}
            <div className="mt-[10px] flex flex-col rounded-[6px] border border-[#dfdfdf]">
              <div className="flex items-center justify-between p-[13px]">
                <div
                  className="flex cursor-pointer items-center gap-[4px] text-[13px] leading-[22px] font-semibold tracking-[-.6px]"
                  onClick={handleAuthAllCheck}
                >
                  <div
                    className="mr-[2px] h-[22px] w-[22px] shrink-0 bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                      backgroundSize: "380px 340px",
                      backgroundPosition: isAllAuthAgreed
                        ? "-350px -200px"
                        : "-350px -176px",
                    }}
                  />
                  <span className="text-[#03A94D]">[필수]</span>
                  <span className="text-[15px] font-bold text-[#222]">
                    인증 약관 전체동의
                  </span>
                </div>

                <div
                  className="mr-[3px] flex h-[30px] w-[30px] cursor-pointer items-center justify-center"
                  onClick={() => setIsAuthTermsOpen(!isAuthTermsOpen)}
                >
                  <div
                    className="h-[16px] w-[16px] shrink-0 bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                      backgroundSize: "380px 340px",
                      backgroundPosition: "-96px -258px",
                      transform: isAuthTermsOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </div>
              </div>

              {/* 필수 인증 약관 링크 */}
              {isAuthTermsOpen && (
                <div className="flex flex-col gap-[2px] border-t border-[#dfdfdf] p-[14px] text-[14px] leading-[20px] tracking-[-.6px] text-[#737373]">
                  <div className="flex w-full items-center justify-between">
                    <div
                      className="flex w-1/2 cursor-pointer items-center"
                      onClick={() => handleAuthSingleCheck("privacy")}
                    >
                      <div
                        className="mr-[8px] h-[16px] w-[16px] shrink-0 bg-no-repeat"
                        style={{
                          backgroundImage:
                            'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                          backgroundSize: "380px 340px",
                          backgroundPosition: authAgreements.privacy
                            ? "-186px -258px"
                            : "-132px -258px",
                        }}
                      />
                      <span>개인정보 이용</span>
                      <a
                        href="https://nid.naver.com/user2/common/terms/terms2?t=viewPersonalInfoTerms&v=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="h-[16px] w-[16px] shrink-0 bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                            backgroundSize: "380px 340px",
                            backgroundPosition: "-282px -232px",
                          }}
                        />
                      </a>
                    </div>
                    <div
                      className="flex w-1/2 cursor-pointer items-center"
                      onClick={() => handleAuthSingleCheck("uniqueId")}
                    >
                      <div
                        className="mr-[8px] h-[16px] w-[16px] shrink-0 bg-no-repeat"
                        style={{
                          backgroundImage:
                            'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                          backgroundSize: "380px 340px",
                          backgroundPosition: authAgreements.uniqueId
                            ? "-186px -258px"
                            : "-132px -258px",
                        }}
                      />
                      <span>고유식별정보 처리</span>
                      <a
                        href="https://nid.naver.com/user2/common/terms/terms2?t=viewUniqInfoTerms&v=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="h-[16px] w-[16px] shrink-0 bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                            backgroundSize: "380px 340px",
                            backgroundPosition: "-282px -232px",
                          }}
                        />
                      </a>
                    </div>
                  </div>
                  <div className="mt-[4px] flex w-full items-center justify-between">
                    <div
                      className="flex w-1/2 cursor-pointer items-center"
                      onClick={() => handleAuthSingleCheck("telecom")}
                    >
                      <div
                        className="mr-[8px] h-[16px] w-[16px] shrink-0 bg-no-repeat"
                        style={{
                          backgroundImage:
                            'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                          backgroundSize: "380px 340px",
                          backgroundPosition: authAgreements.telecom
                            ? "-186px -258px"
                            : "-132px -258px",
                        }}
                      />
                      <span>통신사 이용약관</span>
                      <a
                        href="https://nid.naver.com/user2/common/terms/terms2?t=viewCellPhoneCarriersTerms&v=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="h-[16px] w-[16px] shrink-0 bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                            backgroundSize: "380px 340px",
                            backgroundPosition: "-282px -232px",
                          }}
                        />
                      </a>
                    </div>
                    <div
                      className="flex w-1/2 cursor-pointer items-center"
                      onClick={() => handleAuthSingleCheck("authAgency")}
                    >
                      <div
                        className="mr-[8px] h-[16px] w-[16px] shrink-0 bg-no-repeat"
                        style={{
                          backgroundImage:
                            'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                          backgroundSize: "380px 340px",
                          backgroundPosition: authAgreements.authAgency
                            ? "-186px -258px"
                            : "-132px -258px",
                        }}
                      />
                      <span>인증사 이용약관</span>
                      <a
                        href="https://nid.naver.com/user2/common/terms/terms2?t=viewServiceTerms&v=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="h-[16px] w-[16px] shrink-0 bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                            backgroundSize: "380px 340px",
                            backgroundPosition: "-282px -232px",
                          }}
                        />
                      </a>
                    </div>
                  </div>
                  <div className="mt-[4px] flex w-full items-center justify-between">
                    <div
                      className="flex w-1/2 cursor-pointer items-center"
                      onClick={() => handleAuthSingleCheck("naverPrivacy")}
                    >
                      <div
                        className="mr-[8px] h-[16px] w-[16px] shrink-0 bg-no-repeat"
                        style={{
                          backgroundImage:
                            'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                          backgroundSize: "380px 340px",
                          backgroundPosition: authAgreements.naverPrivacy
                            ? "-186px -258px"
                            : "-132px -258px",
                        }}
                      />
                      <span>네이버 개인정보수집</span>
                      <a
                        href="https://nid.naver.com/user2/common/terms/terms2?t=viewNaverTerms&v=2"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="h-[16px] w-[16px] shrink-0 bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/join/sprite/m_sp_06_realname_880025f9.png")',
                            backgroundSize: "380px 340px",
                            backgroundPosition: "-282px -232px",
                          }}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 인증요청 버튼 */}
          <button
            type="button"
            onClick={handleSignUpSubmit}
            className="flex w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#03A94D] py-[13.5px] text-[16px] leading-[21px] font-semibold text-white"
          >
            회원 가입
          </button>
        </div> // 2페이지 바디 끝
      )}
    </div>
  );
}
