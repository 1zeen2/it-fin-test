import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

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
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/**
 *  Response Interceptor
 *  서버 응답 후 실행되며, 401에러 시 토큰 재발급 로직을 수행
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 비밀번호 불일치 같은 로그인 요청 시 발생한 401에러는 제외
    if (
      error.response?.status === 401 &&
      originalRequest.url?.includes('/api/auth/login')
    ) {
      return Promise.reject(error);
    }

    // 토큰 만료와 같은, 그 외의 401 에러 감지와 무한 루프 방지
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reissue`,
          {},
          { withCredentials: true }, // 순정 axios에도 쿠키 포함
        );

        // 백엔드에서 새 쿠기를 발급해주면, 원래 요청을 재발송.
        return api(originalRequest);
      } catch (refreshError) {
        // 재발급조차 실패한 경우 (리프레시 토큰도 만료됨)
        if (typeof window !== 'undefined') {
          localStorage.clear();
          alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
