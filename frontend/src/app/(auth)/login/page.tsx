"use client";

import { useState, useEffect, useRef } from "react";
import type { SyntheticEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";

const TABS = [
  {
    id: "id",
    label: "ID/전화번호",
    activeIconPos: "-54px -314px",
    inactiveIconPos: "-72px -314px",
  },
  {
    id: "ones",
    label: "일회용 번호",
    activeIconPos: "-316px -276px",
    inactiveIconPos: "-316px -294px",
  },
  {
    id: "qr",
    label: "QR코드",
    activeIconPos: "-316px -240px",
    inactiveIconPos: "-18px -314px",
  },
] as const;

// 타이머 포맷팅 함수 ("mm분 ss초 형식")
const formatTime = (seconds: number) => {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `0${mm}분 ${ss.toString().padStart(2, "0")}초`;
};

// 컴포넌트
export default function SignInPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"id" | "ones" | "qr">("id");
  const [focusedInput, setFocusedInput] = useState<
    "" | "loginId" | "pwd" | "ones"
  >("");

  /** id, 전화번호 입력 변수 */
  const [loginId, setLoginId] = useState("");
  const [pwd, setPwd] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isIpSecurity, setIsIpSecurity] = useState(false);

  /** 일회용 번호 입력 변수 */
  const [disposableNum, setDisposableNum] = useState(""); // 일회용 번호

  /** QR 로그인 관련 상태 */
  const [qrSessionId, setQrSessionId] = useState("");
  const [qrAuthNumber, setQrAuthNumber] = useState("");
  const [qrTimeLeft, setQrTimeLeft] = useState(180); // 3분 = 180초
  const [qrStatus, setQrStatus] = useState<"PENDING" | "SUCCESS" | "EXPIRED">(
    "PENDING",
  );
  const [qrRefreshKey, setQrRefreshKey] = useState(0); // 재시도 버튼

  // SSE 연결 객체를 담아둘 ref (탭 전환 시 연결을 끊음.)
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // QR 생성 및 SSE 연결 함수
    const initQrSignIn = async () => {
      try {
        setQrStatus("PENDING");
        setQrTimeLeft(180);

        // 서버에 QR 세션 요청
        const res = await api.post("/api/auth/qr");
        const { sessionId, authNumber } = res.data;

        setQrSessionId(sessionId);
        setQrAuthNumber(authNumber);

        // 타이머 (downCount)
        timer = setInterval(() => {
          setQrTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setQrStatus("EXPIRED");

              if (eventSourceRef.current) eventSourceRef.current.close();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // SSE 연결 (구독 시작)
        const baseURL = api.defaults.baseURL;
        const sseUrl = `${baseURL}/api/auth/qr/subscribe?sessionId=${sessionId}`;

        const eventSource = new EventSource(sseUrl);
        eventSourceRef.current = eventSource;

        // 연결 성공 이벤트
        eventSource.addEventListener("connected", (e) => {
          console.log("SSE 연결 성공: ", e.data);
        });

        // 인증 성공 이벤트
        eventSource.addEventListener("auth-success", (e) => {
          console.log("QR 인증 완료 페이로드: ", e.data);
          const data = JSON.parse(e.data);

          // 발급받은 토큰 저장
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          setQrStatus("SUCCESS");
          clearInterval(timer);
          eventSource.close();

          alert("QR 로그인이 완료되었습니다.");
          router.push("/"); // 로그인 성공 시 메인 페이지로 보냄
        });

        eventSource.onerror = (err) => {
          console.error("SSE 에러 발생: ", err);
          eventSource.close();
        };
      } catch (error) {
        console.error("QR 생성 실패: ", error);
        alert("QR 코드 생성에 실패했습니다. 다시 시도해주세요");
      }
    };

    // qr탭이 활성화됐을 때만 실행
    if (activeTab === "qr") {
      initQrSignIn();
    }

    // 다른 탭으로 변경하거나, 컴포넌트가 언마운트될 때 해제
    return () => {
      if (timer) clearInterval(timer);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [activeTab, qrRefreshKey, router]); // 재시도 클릭 시 useEffect가 다시 돌아야 함

  // 로그인 상태 유지 및 IP 보안 토글
  const toggleCheck = () => setIsChecked(!isChecked);

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/auth/login", { loginId, pwd });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "로그인 실패.";
        alert(errorMessage);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
    // isChecked, isIpaSecurity는 추후 API 페이로드에 담아 보낼 예정
  };

  // 일회용 번호 로그인 폼 제출 처리 함수
  const handleDisposableSignIn = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (disposableNum.length !== 8) {
      alert("일회용 번호 8자리를 정확히 입력해 주세요.");

      return;
    }

    /**
     *  서버에 일회용 번호 검증 요청
     *  백엔드 파라미터명인 ("authNumber")와 동일하게 작성
     */
    try {
      const response = await api.post("/api/auth/disposable/verify", null, {
        params: { authNumber: disposableNum },
      });

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      router.push("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "로그인 실패.";

        alert(errorMessage);

        setDisposableNum(""); // 실패 시 입력창 초기화
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <div className="flex h-auto w-full flex-col items-center justify-end pt-[125px] pb-[48px]">
        <h1 className="text-[40px] font-normal tracking-[0.4px] text-[#03c75a]">
          로그인 화면
        </h1>
      </div>

      {/* Body 로그인 폼 (ID입력, 일회용 번호, QR코드) */}
      <div className="mx-auto h-auto w-full max-w-[460px]">
        {/* 로그인 폼 영역 */}
        <div className="w-full overflow-visible rounded-[12px] bg-[#f5f6f4]">
          {/* 상단 3개 탭 영역 */}
          <div className="relative z-10 -mb-[1px] flex h-[54px] w-full text-[17px] leading-[20px] font-medium tracking-[-.5px]">
            {TABS.map((tab, index) => {
              const isActive = activeTab === tab.id;

              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-1 cursor-pointer items-center justify-center gap-[8px] ${
                    isActive
                      ? "z-20 rounded-t-[12px] border border-[#e1e3e5] border-b-white bg-white"
                      : ""
                  } ${
                    (activeTab === "id" && tab.id === "qr") ||
                    (activeTab === "qr" && tab.id === "ones")
                      ? "border-l border-[#e1e3e5]"
                      : ""
                  } `}
                >
                  {/* 왼쪽 S자 곡선 (ones 탭, qr 탭일 때만 활성화) */}
                  {isActive && (tab.id === "ones" || tab.id === "qr") && (
                    <span
                      className="absolute bottom-[-9px] -left-[14px] z-10 h-[62px] w-[26px] bg-no-repeat"
                      style={{
                        backgroundImage:
                          'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundSize: "336px 330px",
                        backgroundPosition: "-225px -104px",
                        transform: "scaleX(-1)",
                      }}
                    />
                  )}

                  {/* 오른쪽 S자 곡선 (id 탭, ones 탭일 때만 활성화) */}
                  {isActive && (tab.id === "id" || tab.id === "ones") && (
                    <span
                      className="absolute -right-[14px] bottom-[-9px] z-10 h-[62px] w-[26px] bg-no-repeat"
                      style={{
                        backgroundImage:
                          'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundSize: "336px 330px",
                        backgroundPosition: "-225px -104px",
                      }}
                    />
                  )}

                  {/* 탭 아이콘 */}
                  <div
                    className="relative z-20 mt-[2px] h-[16px] w-[16px] bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                      backgroundPosition: isActive
                        ? tab.activeIconPos
                        : tab.inactiveIconPos,
                      backgroundSize: "336px 330px",
                    }}
                  />
                  {/* 탭 텍스트 */}
                  <span
                    className={`relative z-20 text-center ${isActive ? "text-[#333]" : "text-[#777]"}`}
                  >
                    {tab.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 1-2. 하단 폼 컨텐츠 영역 (하얀색 바탕) */}
          <div
            className={`relative z-0 rounded-b-[12px] border border-[#e1e3e5] bg-white px-[24px] pt-[24px] pb-[24px] ${activeTab === "id" ? "rounded-tr-[8px]" : ""} ${activeTab === "ones" ? "rounded-tl-[8px] rounded-tr-[8px]" : ""} ${activeTab === "qr" ? "rounded-tl-[8px]" : ""} `}
          >
            {activeTab === "id" && (
              <form onSubmit={handleLogin}>
                {/* 아이디 / 비밀번호 입력란 */}
                <div className="flex w-full flex-col rounded-[8px] border border-[#C5CCD2]">
                  {/* 아이디 입력 (row 1) */}
                  <div className="relative flex w-full items-center border-b border-[#C5CCD2] pt-[8px] pr-[12px] pb-[7px] pl-[15px]">
                    {focusedInput === "loginId" && (
                      <div className="pointer-events-none absolute -inset-[1px] z-10 rounded-t-[8px] border-[2px] border-[#09aa5c]" />
                    )}

                    <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center">
                      <label
                        htmlFor="loginId"
                        className="cursor-pointer text-[12.5px] tracking-[-.5px] text-[#767678]"
                      >
                        아이디 또는 전화번호
                      </label>
                      <input
                        id="loginId"
                        type="text"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        onFocus={() => setFocusedInput("loginId")}
                        onBlur={() => setFocusedInput("")}
                        className="w-full cursor-pointer bg-transparent py-[4px] text-[16px] font-normal tracking-[-.5px] text-[#303038] placeholder:text-[#bebebe] focus:outline-none [&:-webkit-autofill]:shadow-[0_0_0_1000px_#fff_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#303038]"
                        required
                      />
                    </div>

                    {loginId && (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setLoginId("");
                        }}
                        className="relative z-20 flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center"
                      >
                        <div
                          className="h-[22px] w-[22px] bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                            backgroundPosition: "-292px 0px",
                            backgroundSize: "336px 330px",
                          }}
                        />
                      </button>
                    )}
                  </div>

                  {/* 비밀번호 입력란 (row 2) */}
                  <div className="relative flex h-[58px] items-center gap-[8px] pr-[12px] pl-[15px]">
                    {focusedInput === "pwd" && (
                      <div className="pointer-events-none absolute -top-[1px] -right-[1px] -bottom-[1px] -left-[1px] z-10 rounded-b-[8px] border border-[#09aa5c]" />
                    )}

                    <div className="relative z-20 flex min-w-0 flex-1 flex-col justify-center">
                      <label
                        htmlFor="pwd"
                        className={`text-[12px] leading-[15px] tracking-[-.8px] transition-colors ${focusedInput === "pwd" ? "text-[#09aa5c]" : "text-[#767678]"}`}
                      >
                        비밀번호
                      </label>
                      <input
                        id="pwd"
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        onFocus={() => setFocusedInput("pwd")}
                        onBlur={() => setFocusedInput("")}
                        className="w-full cursor-pointer bg-transparent text-[16px] leading-[22px] font-normal tracking-[-.2px] text-[#303038] placeholder:text-[#bebebe] focus:outline-none [&:-webkit-autofill]:shadow-[0_0_0_1000px_#fff_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#303038]"
                        required
                      />
                    </div>

                    {pwd && (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setPwd("");
                        }}
                        className="relative z-20 flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center"
                      >
                        <div
                          className="h-[22px] w-[22px] bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                            backgroundPosition: "-292px 0px",
                            backgroundSize: "336px 330px",
                          }}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* 로그인 유지 & IP 보안 */}
                <div className="mt-[12px] flex items-center justify-between">
                  <div
                    className="keep_check group flex cursor-pointer items-center"
                    onClick={toggleCheck}
                  >
                    <div
                      className="h-[20px] w-[20px] bg-no-repeat"
                      style={{
                        backgroundImage:
                          'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundSize: "336px 330px",
                        backgroundPosition: isChecked
                          ? "-66px -292px"
                          : "-292px -236px",
                      }}
                    />
                    <span
                      className={`ml-[8px] text-[14px] tracking-[-0.5px] ${isChecked ? "font-medium text-[#03c75a]" : "text-[#767678]"}`}
                    >
                      로그인 상태 유지
                    </span>
                  </div>

                  <div className="flex items-center gap-[4px] text-[14px]">
                    <span className="text-[#303038]">IP보안</span>

                    <div className="relative inline-block h-[20px] w-[44px]">
                      <input
                        type="checkbox"
                        id="switch"
                        className="sr-only" // 실제 체크박스는 숨김
                        checked={isIpSecurity}
                        onChange={() => setIsIpSecurity(!isIpSecurity)}
                      />

                      <label
                        htmlFor="switch"
                        className={`relative block h-full w-full rounded-full transition-colors ${isIpSecurity ? "bg-[#09aa5c]" : "bg-[#a5adb8]"}`}
                      >
                        {/* ON 텍스트 */}
                        <span
                          className={`absolute top-1/2 left-[7px] -translate-y-1/2 cursor-pointer text-[11px] leading-[20px] font-bold tracking-[-.3px] text-white transition-opacity ${isIpSecurity ? "opacity-100" : "opacity-0"} `}
                          role="checkbox"
                          aria-checked="true"
                        >
                          ON
                        </span>

                        {/* OFF 텍스트 */}
                        <span
                          className={`absolute top-1/2 right-[4px] -translate-y-1/2 cursor-pointer text-[11px] leading-[20px] font-bold tracking-[-.3px] text-white transition-opacity ${isIpSecurity ? "opacity-0" : "opacity-100"} `}
                          role="checkbox"
                          aria-checked="false"
                        >
                          OFF
                        </span>

                        {/* 스위치 핸들 (동그란 버튼 - 스프라이트 이미지 적용 가능) */}
                        <span
                          className={`absolute top-[2px] h-[16px] w-[16px] cursor-pointer rounded-full bg-white shadow-sm transition-all duration-200 ${isIpSecurity ? "left-[26px]" : "left-[2px]"} `}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 로그인 버튼 */}
                <button
                  type="submit"
                  className="mt-5 flex h-12.5 w-full cursor-pointer items-center justify-center rounded-lg bg-[#09aa5c] text-[17px] font-bold text-white"
                >
                  로그인
                </button>

                <div className="relative flex h-[62px] w-full items-center justify-center">
                  <div className="absolute top-1/2 left-0 h-px w-full bg-[#efeff0]"></div>
                  <span className="relative z-10 bg-white px-[12px] text-[14px] leading-[18px] font-normal tracking-[-0.4px] text-[#767678]">
                    지문 · 얼굴 인증을 설정했다면
                  </span>
                </div>

                <button
                  type="button"
                  className="flex h-12.5 w-full cursor-pointer items-center justify-center rounded-lg border border-[#09aa5c] text-[17px] leading-[24px] font-bold tracking-[-.4px] text-[#09aa5c]"
                >
                  패스키 로그인
                </button>
              </form>
            )}

            {activeTab === "ones" && (
              <form onSubmit={handleDisposableSignIn}>
                {/* 안내 텍스트 */}
                <div className="mb-[16px] flex flex-col items-center justify-center text-[15px] leading-[21px] tracking-[-.6px] text-[#1e1e23]">
                  {/* 첫 번째 줄 (Row 1) */}
                  <div className="flex items-center justify-center pt-[16px]">
                    네이버앱의{" "}
                    <span className="mx-[3px] font-medium text-[#09aa5c]">
                      메뉴 &gt; 설정
                    </span>
                    {/* 설정(톱니바퀴) 아이콘 */}
                    <em
                      className="h-[17px] w-[16px] bg-no-repeat" // align-middle, inline-block 제거 (Flex가 대신 정렬함)
                      style={{
                        backgroundImage:
                          'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundSize: "336px 330px",
                        backgroundPosition: "-316px -222px",
                      }}
                    />
                    <span className="ml-[4px] font-medium text-[#09aa5c]">
                      &gt; 로그인 아이디 관리 &gt;
                    </span>
                  </div>

                  {/* 두 번째 줄 (Row 2) */}
                  <div className="flex items-center justify-center pb-[14px]">
                    <span className="font-medium text-[#09aa5c]">더보기</span>
                    {/* 더보기(점3개) 아이콘 */}
                    <em
                      className="mx-[5px] h-[12px] w-[3px] bg-no-repeat"
                      style={{
                        backgroundImage:
                          'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundSize: "336px 330px",
                        backgroundPosition: "-285px -103px",
                      }}
                    />
                    <span className="font-medium text-[#09aa5c]">
                      &gt; 일회용 로그인 번호
                    </span>
                    <span>에 보이는 번호를 입력해 주세요.</span>

                    {/* 도움말(?) 아이콘 링크 */}
                    <a
                      href="https://blog.naver.com/nv_account/223016451462"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-[4px] flex h-[11px] w-[11px] items-center justify-center bg-no-repeat" // Flex 컨테이너로 변경, mb 제거
                      style={{
                        backgroundImage:
                          'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundSize: "336px 330px",
                        backgroundPosition: "-275px -64px",
                      }}
                    >
                      <span className="sr-only">도움말</span>
                    </a>
                  </div>
                </div>

                {/* 일회용 번호 입력창 */}
                <div
                  className={`relative flex h-[50px] items-center rounded-[6px] border bg-white px-[15px] transition-colors ${focusedInput === "ones" ? "border-[#03c75a] ring-1 ring-[#03c75a]" : "border-[#c6c6c6]"}`}
                >
                  <input
                    type="text"
                    id="disposable"
                    name="key"
                    placeholder="번호를 입력하세요."
                    value={disposableNum}
                    onChange={(e) => setDisposableNum(e.target.value)}
                    onFocus={() => setFocusedInput("ones")}
                    onBlur={() => setFocusedInput("")}
                    className="w-full bg-transparent text-center text-[16px] font-normal tracking-[-.2px] text-[#303038] placeholder:text-[#777777] focus:outline-none"
                    autoComplete="off"
                    maxLength={8} // 일회용 번호는 보통 8자리
                  />

                  {/* X (삭제) 버튼 */}
                  {disposableNum && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setDisposableNum("");
                      }}
                      className="relative z-20 flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center"
                    >
                      <div
                        className="h-[22px] w-[22px] bg-no-repeat"
                        style={{
                          backgroundImage:
                            'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                          backgroundPosition: "-292px 0px",
                          backgroundSize: "336px 330px",
                        }}
                      />
                    </button>
                  )}
                </div>

                {/* 로그인 버튼 */}
                <div className="mt-[10px]">
                  <button
                    type="submit"
                    className={`flex h-12.5 w-full cursor-pointer items-center justify-center rounded-lg text-[17px] leading-[24px] font-normal tracking-[-.4px] text-white ${disposableNum.length > 0 ? "bg-[#09aa5c]" : "cursor-not-allowed bg-[#a5adb8]"} `}
                    disabled={disposableNum.length === 0}
                  >
                    로그인
                  </button>
                </div>
              </form>
            )}

            {activeTab === "qr" && (
              <div className="flex flex-col items-center justify-center pt-[4px]">
                {qrStatus === "EXPIRED" ? (
                  // 유효시간 만료 화면
                  <div className="flex w-full flex-col items-center justify-center py-[20px]">
                    <div
                      className="mb-[14px] h-[50px] w-[50px] bg-no-repeat"
                      style={{
                        backgroundImage:
                          'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                        backgroundPosition: "-66px -150px",
                        backgroundSize: "336px 330px",
                      }}
                    />
                    <div className="text-center text-[12.5px] leading-[19px] text-[#8e8e8e]">
                      해당 QR코드의 유효시간이 지났습니다.
                      <br /> 다시 로그인을 시도하시겠습니까?
                    </div>
                    <button
                      type="button"
                      onClick={() => setQrRefreshKey((prev) => prev + 1)}
                      className="mt-[10px] flex w-auto items-center justify-center gap-[6px] pb-[22px] text-[15px] leading-[19px] font-semibold text-[#09aa5c]"
                    >
                      <span
                        className="inline-block h-[20px] w-[21px] bg-no-repeat"
                        style={{
                          backgroundImage:
                            'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                          backgroundSize: "336px 330px",
                          backgroundPosition: "-292px -214px",
                        }}
                      />
                      재시도
                    </button>
                  </div>
                ) : (
                  // 정상 대기 화면
                  <div className="flex w-full flex-col items-center justify-center">
                    {/* QR 출력 영역 */}
                    <div className="relative mb-[24px] flex w-full items-center justify-center">
                      {/* QR */}
                      <div className="relative z-10 inline-block rounded-[8px] bg-white p-[8px]">
                        <QRCodeSVG
                          value={`http://localhost:3000/mobile/qr?sessionId=${qrSessionId}`}
                          size={100}
                          className={`transition-opacity ${qrStatus === "SUCCESS" ? "opacity-20" : ""}`}
                          level={"M"} // 에러 복원 수준 (M은 표준)
                          marginSize={0}
                        />

                        {/* 인증 완료 시 오버레이 */}
                        {qrStatus === "SUCCESS" && (
                          <div className="absolute inset-0 flex items-center justify-center font-bold text-[#03c75a]">
                            인증 완료!
                          </div>
                        )}
                      </div>

                      {/* 우측 남은 시간 타이머 박스 (absolute를 사용해 QR 중앙 고정 후 우측으로 띄움) */}
                      <div className="absolute top-3/4 left-[50%] ml-[60px] flex -translate-y-1/2 flex-col">
                        <span className="text-[13px] leading-[20px] font-semibold text-[#555]">
                          남은시간
                        </span>
                        <span className="mt-[2px] text-[15px] font-bold tracking-[-.5px] text-[#09aa5c]">
                          {formatTime(qrTimeLeft)}
                        </span>
                      </div>
                    </div>

                    <h2 className="mb-[12px] text-center text-[14px] leading-[18px] font-medium tracking-[-0.35px] text-[#1e1e23]">
                      공용 네트워크, 공용 PC라면 안전을 위해
                      <br /> QR코드로 로그인해주세요.
                    </h2>

                    {/* [영역 3] 서브 안내 텍스트 영역 */}
                    {/* 사용자 요청 스펙: size 12, line-height 18, color #666 */}
                    <div className="flex flex-col items-center justify-center text-[12px] leading-[18px] text-[#666]">
                      <div className="flex items-center justify-center">
                        네이버 앱
                        <em
                          className="mx-[4px] inline-block h-[11px] w-[11px] rounded-full bg-[white]"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                            backgroundSize: "336px 330px",
                            backgroundPosition: "-275px -90px",
                          }}
                        />
                        &gt; 렌즈
                        <em
                          className="mx-[4px] inline-block h-[11px] w-[11px] bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                            backgroundSize: "336px 330px",
                            backgroundPosition: "-275px -77px",
                          }}
                        />
                        를 눌러 QR코드를 스캔하여
                      </div>

                      <div className="mt-[2px] flex items-center justify-center">
                        보이는 숫자 중{" "}
                        <strong className="mx-[4px] text-[15px] font-bold text-[#03c75a]">
                          {qrAuthNumber || "--"}
                        </strong>
                        를 선택하면 로그인 됩니다.
                        <a
                          href="#none"
                          className="ml-[4px] flex h-[15px] w-[15px] items-center justify-center bg-no-repeat"
                          style={{
                            backgroundImage:
                              'url("https://ssl.pstatic.net/static/nid/login/sprite/m_sp_01_login_7b3d4fc3.png")',
                            backgroundSize: "336px 330px",
                            backgroundPosition: "-122px -292px",
                          }}
                        >
                          <span className="sr-only">도움말</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 아이디 찾기, 비밀번호 찾기, 회원가입 */}
      <div className="flex h-auto items-center justify-center gap-[13.5px] pt-[20px] pb-[48px] text-[14px] leading-[17px] text-[#888888]">
        <a href="#" className="cursor-pointer">
          아이디 찾기
        </a>
        <div className="h-3 w-px bg-[#dadada]"></div>
        <a href="#" className="cursor-pointer">
          비밀번호 찾기
        </a>
        <div className="h-3 w-px bg-[#dadada]"></div>
        <a href="/sign-up" className="cursor-pointer">
          회원가입
        </a>
      </div>

      {/* 광고 사진 영역 */}
      <a
        href="https://m.blog.naver.com/nv_account/224092438104?dtm_source=naver_pclogin&dtm_medium=mktatrb_etc&dtm_campaign=2512-nid-002&pcode=naver_pclogin&campaign_id=2512-nid-002&channel_id=naver_pclogin"
        target="_blank"
        rel="noopener noreferrer"
        className="block h-[147px] w-full cursor-pointer bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://ssl.pstatic.net/melona/libs/1378/1378592/5d96432bc60f437ea2a6_20260105120825307.png")',
          backgroundSize: "contain",
        }}
      >
        {/* 웹 접근성을 위한 숨김 텍스트 */}
        <span className="sr-only">
          [광고] 네이버 멤버십 캠페인 페이지로 이동
        </span>
      </a>

      {/* 3. Footer 영역 */}
      <div className="flex flex-col items-center justify-center pt-12 pb-8 text-[12px] leading-[15px] tracking-[-.5px] text-[#888]">
        <div className="flex items-center justify-center gap-[7.5px]">
          <a href="#" className="text-nowrap">
            이용약관
          </a>
          <div className="h-[12px] w-px bg-[#dadada]"></div>
          <a href="#" className="font-bold text-nowrap text-[#888]">
            개인정보처리방침
          </a>
          <div className="h-[12px] w-px bg-[#dadada]"></div>
          <a href="#" className="text-nowrap">
            책임의 한계와 법적고지
          </a>
          <div className="h-[12px] w-px bg-[#dadada]"></div>
          <a href="#" className="text-nowrap">
            회원정보 고객센터
          </a>
        </div>
        <div className="mt-2 text-center text-sm break-keep">
          본 프로젝트는 개인 프로젝트를 위헤 제작되었으며
          <br className="md:block" />
          상업적인 목적은 일절 없음을 명확히 밝힙니다.
        </div>
      </div>
    </div>
  );
}
