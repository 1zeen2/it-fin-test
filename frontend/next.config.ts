import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  /**
   *  [API Reverse Proxy 설정]
   *   => Next.js 서버를 경량 API Gateway로 활용하여 SOP 제약 우회.
   *      외부 네트워크에서 접속 시 프런트, 백의 도메인 분리로 인해 발생하는
   *      CORS Preflight 오버헤드 차단 및 단일 터널링 아키텍처를 구성하기 위함.
   */
  async rewrites() {
    return [
      {
        source: '/api/:path*', // 모바일(브라우저)가 요청하는 경로
        destination: 'http://localhost:8080/api/:path*', // Next에서 변환할 uri (이 uri가 SpringBoot로 전송)
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shop-phinf.pstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shopping-phinf.pstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'phinf.pstatic.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ssl.pstatic.net', // 네이버 기본 프로필 이미지 서버
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
