import axios from 'axios';

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
  withCredentials: true, // 쿠키도 사용할 수도 있으니 true로 설정해둠.
});

/**
 *  Request Interceptor
 *  모든 API 요청 직전에 실행되며, 로컬 스토리지의 토큰을 헤더에 삽입.
 */
api.interceptors.request.use((config) => {
    // 클라이언트에서만 로컬 스토리지 접근
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  }
);

/**
 *  Response Interceptor
 *  서버 응답 후 실행되며, 401에러 시 토큰 재발급 로직을 수행할 예정
 */
api.interceptors.response.use((response) => response,
  async (error) => {
    // 여기서 토큰 재발급 (/api/auth/reissue) 관련 로직 추가 예정
    return Promise.reject(error);
  }
)

export default api;