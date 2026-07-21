export interface HeroBannerProductImage {
  /** 상품 웹 이미지 주소 (Next.js 최적화용) */
  webp: string;
  /** Webp 미지원 브라우저용 기본 이미지 주소 */
  fallback: string;
}

export interface HeroBannerData {
  id: number;
  title: string;
  linkUrl: string;
  bgImageWebp: string;
  /** 배너 내부 타이틀 이미지 주소 (내부 타이틀이 이미지가 아닌, 텍스트인 경우 null) */
  titleImageWebp: string | null;
  mainText: string | null;
  subText: string | null;
  /** 배너 우측 하단에 노출될 미니 상품 이미지 배열 */
  productsJson: HeroBannerProductImage[];
  displayOrder: number;
  isActive: boolean;
}

export interface TrendingKeywordData {
  id: number;
  keyword: string;
  normalizedKeyword: string;
  imageUrl: string;
  linkUrl: string;
  searchCount: number;
  createdAt: string;
  baseDate: string;
  isActive: boolean;
}
