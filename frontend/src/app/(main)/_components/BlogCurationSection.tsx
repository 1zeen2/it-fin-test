import BlogCurationSectionClient from './BlogCurationSectionClient';
import type { BlogCuration } from '@/types/product';

async function getBlogCurations(): Promise<BlogCuration[]> {
  try {
    const res = await fetch(
      'http://localhost:8080/api/display/blog-curations',
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) return [];

    const data = await res.json();

    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    return shuffledData.slice(0, 6);
  } catch (err) {
    console.error('블로그 큐레이션 로딩 에러: ', err);
    return [];
  }
}

export default async function BlogCurationSection() {
  const initialCurations = await getBlogCurations();

  if (initialCurations.length === 0) return null;

  return <BlogCurationSectionClient initialCurations={initialCurations} />;
}
