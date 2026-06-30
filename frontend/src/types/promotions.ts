export interface TodayPromotions {
  id: number;
  title: string;
  imageUrl: string;
  badgeText?: string;
  badgeBgColor?: string;
  highlightText?: string;
  linkUrl: string;
}

export interface SuperPriceProducts {
  id: number;
  title: string;
  originalPrice: number | null;
  price: number;
  discountRate: number | null;
  shippingFee: number;
  displayTag: string;
  imageUrl: string;
  linkUrl: string;
}
