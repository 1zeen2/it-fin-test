import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
/**
 *  전역 Axios 인스턴스 설정
 *    => 백엔드 기본 URL 설정
 *    => 요청 시 Timeout 설정
 *    => 공통 헤더 설정
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // 쿠키도 사용할 수도 있으니 true로 설정해둠.
});

/**
 *  Request Interceptor
 *  모든 API 요청 직전에 실행되며, 로컬 스토리지의 토큰을 헤더에 삽입.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 클라이언트에서만 로컬 스토리지 접근 (Next.js SSR 방어)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 *  Response Interceptor
 *  서버 응답 후 실행되며, 401에러 시 토큰 재발급 로직을 수행
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 401 에러 감지 및 무한 루프 방지 플래그 확인
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한 루프 방지 로직

      /**
       *  Next.js 클라이언트 환경 검증
       *    => Next는 client에서 실행되기 전에 Node 서버에서 SSR을 시도하는데,
       *       서버에는 window나 localStorage가 없기 때문에
       *       localStorage.getItem("refreshToken")을 호출하는 순간 에러가 발생
       *       (클라이언트에서는 렌더링 실패, 서버에서는 500 Internal Server Error)
       */
      if (typeof window === "undefined") {
        return Promise.reject(error);
      }

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("리프레시 토큰이 없습니다.");
        }

        /**
         *  axios로 재발급 API 호출
         *    => api인스턴스에 헤더에 token을 추가하는 로직이 있음.
         *       refreshToken마저 만료되면
         *       만료된 토큰이 header 안에 포함돼서 날라올 수 있으므로
         *       axios로 파이프라인을 타지 않는 순정 상태의 axios 인스턴스로
         *       네트워크 요청을 보내야 함.
         */
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reissue`,
          { refreshToken: refreshToken },
        );

        // 새로 받은 토큰 저장
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // 원래 요청의 헤더를 새 토큰으로 교체
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 재발급 실패한 경우 (로그아웃 처리 후 로그인 페이지로 리다이렉트)
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    // 401 에러가 아니거나, 재시도 실패한 에러는 그대로 반환
    return Promise.reject(error);
  },
);

export default api;
