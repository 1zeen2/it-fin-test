export interface Product {
  id: number;
  title: string;
  originalPrice: number | null;
  price: number;
  shippingFee: number;
  shippingType: 'FREE' | 'PAID' | 'PAY_ON_DELIVERY' | 'CONDITIONAL';
  imageUrl: string;
  linkUrl: string;
  tag: string;
  category1: string;
  isActive: boolean;
}

export type BlogCurationProduct = Pick<
  Product,
  | 'id'
  | 'title'
  | 'originalPrice'
  | 'price'
  | 'imageUrl'
  | 'linkUrl'
  | 'shippingFee'
> & { displayOrder: number };

export interface BlogCuration {
  id: number;
  blogName: string;
  author: string;
  postTitle: string;
  postThumbnailUrl: string;
  blogUrl: string;
  products: BlogCurationProduct[];
}

export type CategoryRecommendProduct = Pick<
  Product,
  | 'id'
  | 'title'
  | 'originalPrice'
  | 'price'
  | 'imageUrl'
  | 'linkUrl'
  | 'shippingFee'
  | 'shippingType'
  | 'category1'
> & { isWished: boolean };
