import { TrendingKeywordData } from '@/types/display';
import TrendingKeywordClient from './TrendingKeywordClient';

async function getTrendingKeywords(): Promise<TrendingKeywordData[]> {
  try {
    const res = await fetch(
      'http://localhost:8080/api/display/trending-keywords',
      {
        cache: 'no-store',
      },
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('실시간 네이버 급상승 쇼핑 키워드 로딩 실패: ', error);
    return [];
  }
}

export default async function TrendingKeyword() {
  const trendingKeywords = await getTrendingKeywords();

  return <TrendingKeywordClient initialKeywords={trendingKeywords} />;
}
