'use client';

import BlogCurationSection from '@/app/(main)/_components/BlogCurationSection';
import HeroBanner from '@/app/(main)/_components/HeroBanner';
import Lnb from '@/app/(main)/_components/Lnb';
import TodayPromotions from '@/app/(main)/_components/TodayPromotions';
import TrendingKeyword from '@/app/(main)/_components/TrendingKeyword';

export default function MainPage() {
  return (
    <div className="flex h-auto w-full flex-col">
      <HeroBanner />
      <Lnb />
      <TodayPromotions />
      <TrendingKeyword />
      <BlogCurationSection />
    </div>
  );
}
