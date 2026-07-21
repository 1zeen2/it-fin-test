import HeroBannerClient from './HeroBannerClient';
import { HeroBannerData } from '@/types/display';

async function getHeroBanners(): Promise<HeroBannerData[]> {
  try {
    const res = await fetch('http://localhost:8080/api/display/hero-banners', {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    return res.json();
  } catch (error) {
    console.error('히어로 배너 로딩 에러:', error);

    return [];
  }
}

export default async function HeroBanner() {
  const banners = await getHeroBanners();

  return <HeroBannerClient banners={banners} />;
}
