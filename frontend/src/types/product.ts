export interface Product {
  productId: number;
  title: string;
  originalPrice: number | null;
  price: number;
  shippingFee: number;
  shippingType: 'FREE' | 'PAID' | 'PAY_ON_DELIVERY' | 'CONDITIONAL';
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

export type BlogCurationProduct = Pick<
  Product,
  | 'productId'
  | 'title'
  | 'originalPrice'
  | 'price'
  | 'imageUrl'
  | 'linkUrl'
  | 'shippingFee'
> & { displayOrder: number };

export interface BlogCuration {
  curationId: number;
  blogName: string;
  author: string;
  postTitle: string;
  postThumbnailUrl: string;
  blogUrl: string;
  products: BlogCurationProduct[];
}

export type RecommendProduct = Pick<
  Product,
  | 'productId'
  | 'title'
  | 'originalPrice'
  | 'price'
  | 'imageUrl'
  | 'linkUrl'
  | 'shippingFee'
  | 'shippingType'
> & { isWished: boolean };
