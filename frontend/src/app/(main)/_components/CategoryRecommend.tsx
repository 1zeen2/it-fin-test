import CategoryRecommendClient from './CategoryRecommendClient';
import { PRODUCT_CATEGORIES } from '@/constants/category';
import type { CategoryRecommendProduct } from '@/types/product';

async function fetchCategoryRecommendData() {
  const shuffledCategories = [...PRODUCT_CATEGORIES].sort(
    () => Math.random() - 0.5,
  );

  const initialCategory = shuffledCategories[0];

  let initialProducts: CategoryRecommendProduct[] = [];

  try {
    const res = await fetch(
      `http://localhost:8080/api/products?category1=${encodeURIComponent(initialCategory)}`,
      { cache: 'no-store' },
    );

    if (res.ok) {
      initialProducts = await res.json();
    }
  } catch (err) {
    console.error('카테고리 상품 초기 로딩 에러:', err);
  }
  return {
    shuffledCategories,
    initialProducts,
  };
}

export default async function CategoryRecommend() {
  const { shuffledCategories, initialProducts } =
    await fetchCategoryRecommendData();

  return (
    <CategoryRecommendClient
      categories={shuffledCategories}
      initialProducts={initialProducts}
    />
  );
}
