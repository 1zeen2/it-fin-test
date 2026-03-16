"use client";

import Header from "@/components/main/Header";
import HeroBanner from "@/components/main/HeroBanner";
import Lnb from "@/components/main/Lnb";
import TodayPromotions from "@/components/main/TodayPromotions";
import TrendingKeyword from "@/components/main/TrendingKeyword";

export default function MainPage() {
  return (
    <div className="flex h-auto w-full flex-col">
      <Header />

      <HeroBanner />

      <Lnb />

      <TodayPromotions />

      <TrendingKeyword />
    </div>
  );
}
