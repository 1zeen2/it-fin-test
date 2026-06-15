import SuperPriceClient, { SuperPriceProduct } from './SuperPriceClient';

async function getSuperPriceProducts(): Promise<SuperPriceProduct[]> {
  try {
    const res = await fetch('http://localhost:8080/api/display/super-prices', {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('특가 상품을 가져올 수 없습니다.');
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('API 연결 실패 에러:', error);
    return [];
  }
}

export default async function SuperPrice() {
  const products = await getSuperPriceProducts();

  return <SuperPriceClient initialProducts={products} />;
}
