export const PRODUCT_CATEGORIES = [
  '출산/육아',
  '화장품/미용',
  '스포츠/레저',
  '디지털/가전',
  '생활/건강',
  '식품',
  '패션의류',
  '패션잡화',
  '가구/인테리어',
] as const;

// as const로 읽기 전용 튜플로 선언하면 타입 추론이 극대화됨
export type CategoryName = (typeof PRODUCT_CATEGORIES)[number];
