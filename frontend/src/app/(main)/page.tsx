import BlogCurationSection from './_components/BlogCurationSection';
import HeroBanner from './_components/HeroBanner';
import QuickMenus from './_components/QuickMenus';
import TodayPromotions from './_components/TodayPromotions';
import TrendingKeyword from './_components/TrendingKeyword';
import CategoryRecommend from './_components/CategoryRecommend';
import SuperPrice from './_components/SuperPrice';
import MoblieLoginBaner from './_components/MobileLoginBanner';

export default function MainPage() {
  return (
    <div className="flex h-auto w-full flex-col">
      <HeroBanner />
      <MoblieLoginBaner />
      <QuickMenus />
      <TodayPromotions />
      <TrendingKeyword />
      <BlogCurationSection />
      {/* 회색 구분 선 추후에 1칸 내려야 함 */}
      <CategoryRecommend />
      <SuperPrice />
    </div>
  );
}
